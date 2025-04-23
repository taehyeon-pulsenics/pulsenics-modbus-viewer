import ModbusRTU from 'modbus-serial';
import CONFIG from './config.cjs';

const client = new ModbusRTU();

const IP = CONFIG.probeIp; // Replace with your server's IP address.
const PORT = 502;

const MAX_READ_REGISTERS = 125;

export async function connect(ip = CONFIG.probeIp) {
  try {
    // Connect to Modbus TCP server
    await client.connectTCP(ip, { port: PORT });
    // client.setID(UNIT_ID)
    console.log(`Connected to Modbus server at ${IP}:${PORT}`);
  } catch (error) {
    console.error('Connection Error:', error);
  }
}

export async function disconnect() {
  try {
    client.close();
    console.log(`Disconnected`);
  } catch (error) {
    console.error('Disconnection Error:', error);
  }
}

export const ADDRESS_TYPE = Object.freeze({
  COIL: Symbol(1),
  DISCRETE_INPUT: Symbol(2),
  HOLDING_REGISTER: Symbol(3),
  INPUT_REGISTER: Symbol(4),
});

/**
 * Poll modbus server from specific unit ID for specific number of registers, from address 0
 *
 * @param {number} store - The Modbus unit (slave) ID.
 * @param {ADDRESS_TYPE} addressType - Address Type
 * @param {number} nRegisters - number of registers to pull
 * @returns {Promise<(number | boolean)[]?>} A promise that resolves to an array of registers. Null if any error occurs
 */
export const readRegisters = async (store, addressType, nRegisters) => {
  // Set the client's unit ID to the provided store value.
  client.setID(store);

  let remaining = nRegisters;
  let start = 0;
  let registers = [];

  while (remaining > 0) {
    const nRegistersToRead = Math.min(remaining, MAX_READ_REGISTERS);

    try {
      let res;
      switch (addressType) {
        case ADDRESS_TYPE.COIL:
          res = await client.readCoils(start, nRegistersToRead);
          break;
        case ADDRESS_TYPE.DISCRETE_INPUT:
          res = await client.readDiscreteInputs(start, nRegistersToRead);
          break;
        case ADDRESS_TYPE.HOLDING_REGISTER:
          res = await client.readHoldingRegisters(start, nRegistersToRead);
          break;
        case ADDRESS_TYPE.INPUT_REGISTER:
          res = await client.readInputRegisters(start, nRegistersToRead);
          break;
        default:
          throw new Error('Unidentified address type');
      }

      const expected =
        addressType === ADDRESS_TYPE.COIL ||
        addressType === ADDRESS_TYPE.DISCRETE_INPUT
          ? Math.ceil(nRegistersToRead / 8) * 8
          : nRegistersToRead;

      if (!res || !res.data || res.data.length !== expected) {
        throw new Error(
          `Error reading registers at address ${start} for ${nRegistersToRead} registers (unit ID ${store}).`
        );
      }

      registers.push(...res.data.slice(0, nRegistersToRead));
    } catch (error) {
      console.log(store, addressType, start);
      console.error('Error reading registers:', error);
      return null;
    } finally {
      remaining -= nRegistersToRead;
      start += nRegistersToRead;
    }
  }

  return registers;
};
