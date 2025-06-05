from pymodbus.client import ModbusTcpClient as ModbusClient
from pymodbus.pdu import ModbusPDU
import socketio
import time
import asyncio
from threading import Thread
import struct
import traceback

from custom_types.api_request_types import ConfigInput
from custom_types.enums import RegisterType

class ModbusReader():
    def __init__(self, ip, legacy, sio: socketio.AsyncServer):
        self.ip = ip
        self.legacy = legacy
        self.client: ModbusClient = None
        self.sio_server = sio
    
    def is_connected(self):
        return self.client != None and self.client.connected and self.client.is_socket_open()

    def connect(self):
        try:
            self.client = ModbusClient(self.ip)
            res = self.client.connect()

            asyncio.run(self.__broadcast_connection(res))

            return res
        except Exception as e:
            print("Problem occured during ModbusReader.connect", e)
            return False
    
    def close(self):
        try:
            if self.is_connected():
                self.client.close()
                self.client = None
                return True
            return False
        except Exception as e:
            print("Problem occured during ModbusReader.close\n", e)
            raise False
    
    def update_config(self, config: ConfigInput):
        try:
            self.ip = config.probeIp
            self.legacy = config.legacy

            return True
        except Exception as e:
            print("Problem occured during ModbusReader.update_config\n", e)
            return False

    def __check_call(self, response: ModbusPDU):
        if response.isError():
            raise ConnectionAbortedError(
                "Pymodbus returned an error!"
            )
    
    def __poll_modbus(self):
        n_registers_map = {
            1: {
                RegisterType.COIL: 1,
                RegisterType.HOLDING_REGISTER: 2,
                RegisterType.INPUT_REGISTER: 776
            },
            2: {
                RegisterType.COIL: 3,
                RegisterType.DISCRETE_INPUT: 19 if self.legacy else 20,
                RegisterType.HOLDING_REGISTER: 10 if self.legacy else 232,
                RegisterType.INPUT_REGISTER: 47284
            },
            6: {
                RegisterType.COIL: 14,
                RegisterType.DISCRETE_INPUT: 15,
                RegisterType.HOLDING_REGISTER: 10,
                RegisterType.INPUT_REGISTER: 10 if self.legacy else 325
            }
        }

        while True:
            for unit_id in n_registers_map:
                try:
                    for register_type in n_registers_map[unit_id]:
                        registers = None
                        key = f"{unit_id}_{register_type.value}"
                        n_registers = n_registers_map[unit_id][register_type]

                        registers = self.__read_registers(register_type, address=0, count=n_registers, slave=unit_id)
                        asyncio.run(self.__broadcast_registers(key=key, registers=registers))
                except Exception as e:
                    print("Error happened during __poll_modbus")
                    traceback.print_exception(e)

                    break
    
    def create_poll_thread(self):
        return Thread(target=self.__poll_modbus, daemon=True)
    
    async def __broadcast_registers(self, key: str, registers: list | None):
        try:
            if registers is None:
                await self.sio_server.emit(key, None)
            else:
                buf = b''.join(struct.pack('!H', v) for v in registers)
                await self.sio_server.emit(key, buf)
        except Exception as e:
            print("Problem occured during ModbusReader.__broadcast_registers\n", e)

    async def __broadcast_connection(self, connected: bool):
        try:
            await self.sio_server.emit('connection', connected)
        except Exception as e:
            print("Problem occured during ModbusReader.__broadcast_connection\n", e)
    
    def __read_registers(self, register_type: RegisterType, address: int, count: int, slave: int):
        try:
            while not self.is_connected() and not self.connect():
                time.sleep(1)
            
            if register_type is RegisterType.COIL:
                registers = self.__read_singlebit_registers(self.client.read_coils, address=address, count=count, slave=slave)
            elif register_type is RegisterType.DISCRETE_INPUT:
                registers = self.__read_singlebit_registers(self.client.read_discrete_inputs, address=address, count=count, slave=slave)
            elif register_type is RegisterType.HOLDING_REGISTER:
                registers = self.__read_multibit_registers(self.client.read_holding_registers, address=address, count=count, slave=slave)
            elif register_type is RegisterType.INPUT_REGISTER:
                registers = self.__read_multibit_registers(self.client.read_input_registers, address=address, count=count, slave=slave)
            
            self.close()

            return registers
        except Exception as e:
            print("Problem occured during ModbusReader.__read_registers\n", e)
            print("Closing Modbus connection...")
            self.close()
            asyncio.run(self.__broadcast_connection(False))
    
    def __read_multibit_registers(self, read_func, address: int, count: int, slave: int):
        try:
            MAX_READ_REGISTERS = 124

            registers = []
            remaining = count
            while remaining > 0:
                n_registers_to_read = min(MAX_READ_REGISTERS, remaining)

                rr = read_func(address=address, count=n_registers_to_read, slave=slave)
                self.__check_call(rr)

                registers += rr.registers

                address += n_registers_to_read
                remaining -= n_registers_to_read

            return registers
        except Exception as e:
            print("Problem occured during ModbusReader.__read_registers\n", e)
            print("Closing Modbus connection...")
            self.close()
            asyncio.run(self.__broadcast_connection(False))
    
    def __read_singlebit_registers(self, read_func, address, count, slave):
        try:
            rr = read_func(address=address, count=count, slave=slave)
            self.__check_call(rr)

            return rr.bits[:count]
        except Exception as e:
            print("Problem occured during ModbusReader.__read_registers\n", e)
            print("Closing Modbus connection...")
            self.close()
            asyncio.run(self.__broadcast_connection(False))

