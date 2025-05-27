from pymodbus.client import ModbusTcpClient as ModbusClient
from pymodbus.pdu import ModbusPDU
import socketio
import time
import asyncio
from threading import Thread
import struct

from custom_types.api_request_types import ConfigInput
from custom_types.enums import RegisterType

class ModbusReader():
    def __init__(self, ip, legacy, sio: socketio.AsyncServer):
        self.ip = ip
        self.legacy = legacy
        self.client: ModbusClient = None
        self.sio_server = sio
    
    def is_connected(self):
        return self.client != None and self.client.connected

    def connect(self):
        try:
            self.client = ModbusClient(self.ip)
            self.client.connect()
            print(f"Connected to Modbus server @ {self.ip}:502 (legacy: {self.legacy})")
            return True
        except Exception as e:
            print("Problem occured during ModbusReader.connect", e)
            return False
    
    def close(self):
        try:
            if self.is_connected():
                self.client.close()
                print(f"Closed Connection to Modbus server @ {self.ip}:502")
                return True
            return False
        except Exception as e:
            print("Problem occured during ModbusReader.close\n", e)
            raise False
    
    def update_config(self, config: ConfigInput):
        try:
            self.close()

            self.ip = config.probeIp
            self.legacy = config.legacy

            if not self.connect():
                raise ConnectionAbortedError(
                    f"Failed to reconnect to Modbus server @ {self.ip}"
                )
            
            return True
        except Exception as e:
            print("Problem occured during ModbusReader.update_config\n", e)
            return False

    def __check_call(self, response: ModbusPDU):
        if response.isError():
            raise ConnectionAbortedError(
                f"Lost connection with Pulsenics Probe @ {self.ip}"
            )
    
    def __poll_modbus(self):
        n_registers_map = {
            1: {
                RegisterType.COIL: 1,
                RegisterType.HOLDING_REGISTER: 2,
                RegisterType.INPUT_REGISTER: 8
            },
            2: {
                RegisterType.COIL: 3,
                RegisterType.DISCRETE_INPUT: 19 if self.legacy else 20,
                RegisterType.HOLDING_REGISTER: 10 if self.legacy else 232,
                RegisterType.INPUT_REGISTER: 1204
            },
            6: {
                RegisterType.COIL: 14,
                RegisterType.DISCRETE_INPUT: 15,
                RegisterType.HOLDING_REGISTER: 10,
                RegisterType.INPUT_REGISTER: 10 if self.legacy else 325
            }
        }

        while True:
            if not self.is_connected():
                self.__broadcast_connection(False)
                while not self.connect():
                    time.sleep(1)
            self.__broadcast_connection(True)
            for unit_id in n_registers_map:
                for register_type in n_registers_map[unit_id]:
                    registers = None
                    key = f"{unit_id}_{register_type.value}"
                    n_registers = n_registers_map[unit_id][register_type]

                    if register_type is RegisterType.COIL:
                        try:
                            rr = self.client.read_coils(address=0, count=n_registers, slave=unit_id)
                            self.__check_call(rr)

                            registers = rr.bits[:n_registers]
                        except Exception as e:
                            print("Problem occured during ModbusReader.__poll_modbus's read_coil\n", e)
                    elif register_type is RegisterType.DISCRETE_INPUT:
                        try:
                            rr = self.client.read_discrete_inputs(address=0, count=n_registers, slave=unit_id)
                            self.__check_call(rr)

                            registers = rr.bits[:n_registers]
                        except Exception as e:
                            print("Problem occured during ModbusReader.__poll_modbus's read_discrete_inputs\n", e)
                    elif register_type is RegisterType.HOLDING_REGISTER:
                        registers = self.__read_registers(self.client.read_holding_registers, address=0, count=n_registers, slave=unit_id)
                    elif register_type is RegisterType.INPUT_REGISTER:
                        registers = self.__read_registers(self.client.read_input_registers, address=0, count=n_registers, slave=unit_id)

                    asyncio.run(self.__broadcast_registers(key=key, registers=registers))
    
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
            print("Problem occured during ModbusReader.__broadcast_registers\n", e)
    
    def __read_registers(self, read_func, address, count, slave):
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

