import ModbusRTU from 'modbus-serial';

const client = new ModbusRTU();

const IP = '127.0.0.1'; // Replace with your server's IP address.
const PORT = 502;

const MAX_READ_REGISTERS = 125;
const NUM_REGISTERS_PER_FLOAT_32 = 2;
const NUM_REGISTERS_PER_FLOAT_64 = 4;

export async function connect() {
  try {
    // Connect to Modbus TCP server
    await client.connectTCP(IP, { port: PORT });
    // client.setID(UNIT_ID)
    console.log(`Connected to Modbus server at ${IP}:${PORT}`);
  } catch (error) {
    console.error('Connection Error:', error);
  }
}

/**
 * Reads input registers and decodes them into an array of 32-bit floats.
 *
 * @param {number} start - The starting register address to read from.
 * @param {number} numFloats - The number of 32-bit floats to read.
 * @param {number} store - The Modbus unit (slave) ID.
 * @returns {Promise<number[]>} A promise that resolves to an array of floats.
 */
export async function readInputRegistersTo32BitFloats(start, numFloats, store) {
  return readInputRegistersToFloats(
    start,
    numFloats,
    store,
    NUM_REGISTERS_PER_FLOAT_32
  );
}

/**
 * Reads input registers and decodes them into an array of 64-bit floats.
 *
 * @param {number} start - The starting register address to read from.
 * @param {number} numFloats - The number of 64-bit floats to read.
 * @param {number} store - The Modbus unit (slave) ID.
 * @returns {Promise<number[]>} A promise that resolves to an array of floats.
 */
export async function readInputRegistersTo64BitFloats(start, numFloats, store) {
  return readInputRegistersToFloats(
    start,
    numFloats,
    store,
    NUM_REGISTERS_PER_FLOAT_64
  );
}

/**
 * Reads input registers and decodes them into an array of floats.
 *
 * @param {number} start - The starting register address to read from.
 * @param {number} numFloats - The number of floats to read.
 * @param {number} store - The Modbus unit (slave) ID.
 * @param {number} numberOfRegistersPerFloat - Specify number of registers per float.
 * For 32-bit floats, use 2. For 64-bit floats, use 4.
 * @returns {Promise<number[]>} A promise that resolves to an array of floats.
 */
export async function readInputRegistersToFloats(
  start,
  numFloats,
  store,
  numberOfRegistersPerFloat
) {
  const floats = [];
  let remaining = numFloats;

  // Set the client's unit ID to the provided store value.
  client.setID(store);

  // Read in groups to respect the maximum registers (each float = 2 registers).
  while (remaining > 0) {
    // Calculate maximum number of floats that can be read in one call.
    const maxFloatsRead = Math.floor(
      MAX_READ_REGISTERS / numberOfRegistersPerFloat
    ); // e.g. 125/2 = 62 floats max
    const floatsToRead = Math.min(maxFloatsRead, remaining);
    const numRegistersToRead = floatsToRead * numberOfRegistersPerFloat; // 2 registers per 32-bit float

    try {
      // Read the registers starting at the current address.
      const res = await client.readInputRegisters(start, numRegistersToRead);

      // Basic response validation (similar to self.CheckCall in your Python code)
      if (!res || !res.data || res.data.length !== numRegistersToRead) {
        throw new Error(
          `Error reading registers at address ${start} for ${floatsToRead} floats.`
        );
      }
      const registers = res.data; // Array of 16-bit unsigned integers

      // Convert the registers array to a Buffer.
      // Each register is 2 bytes.
      const buffer = Buffer.alloc(registers.length * numberOfRegistersPerFloat);
      registers.forEach((value, index) => {
        // Write each 16-bit register in Big-Endian order.
        buffer.writeUInt16BE(value, index * numberOfRegistersPerFloat);
      });

      // Decode each 32-bit float from the buffer.
      for (let i = 0; i < floatsToRead; i++) {
        const offset = i * 4; // 4 bytes per float
        let data = buffer.readFloatBE(offset);
        // If the decoded value is not a number, set it to null
        if (isNaN(data)) {
          data = null;
        }
        floats.push(data);
      }

      // Update the remaining count and starting address for the next batch.
      remaining -= floatsToRead;
      start += numRegistersToRead;
    } catch (error) {
      console.error('Error reading input registers:', error);
      throw error;
    }
  }

  return floats;
}

/**
 * Reads input registers and decodes them into string.
 * First address is always a length.
 *
 * @param {number} start - The starting register address to read from.
 * @param {number} store - The Modbus unit (slave) ID.
 * For 32-bit floats, use 2. For 64-bit floats, use 4.
 * @returns {Promise<string>} A promise that resolves to an array of floats.
 */
export async function readInputRegistersToString(start, store) {
  // Set the client's unit ID to the provided store value.
  client.setID(store);

  // read start address to get length
  try {
    const res = await client.readInputRegisters(start, 1); // one register for unsigned 16bit int

    // Basic response validation (similar to self.CheckCall in your Python code)
    if (!res || !res.data || res.data.length !== 1) {
      throw new Error(
        `Error reading registers at address ${start} for ${floatsToRead} floats.`
      );
    }
    const length = res.data[0]; // Array of 16-bit unsigned integers

    if (length < 1) {
      return '';
    }

    let remaining = length;
    start++;
    let string = '';

    // Read in groups to respect the maximum registers (each float = 2 registers).
    while (remaining > 0) {
      // Calculate maximum number of floats that can be read in one call.
      const maxCharsRead = Math.floor(MAX_READ_REGISTERS / 2); // e.g. 125/2 = 62 chars max
      const charsToRead = Math.min(maxCharsRead, remaining);
      const numRegistersToRead = charsToRead * 2; // 2 registers per 32-bit float

      // Read the registers starting at the current address.
      const res = await client.readInputRegisters(start, numRegistersToRead);

      // Basic response validation (similar to self.CheckCall in your Python code)
      if (!res || !res.data || res.data.length !== numRegistersToRead) {
        throw new Error(
          `Error reading registers at address ${start} for ${charsToRead} floats.`
        );
      }
      const registers = res.data; // Array of 16-bit unsigned integers

      // Convert the registers array to a Buffer.
      // Each register is 2 bytes.
      const buffer = Buffer.alloc(registers.length * 2);
      registers.forEach((value, index) => {
        // Write each 16-bit register in Big-Endian order.
        buffer.writeUInt16BE(value, index * 2);
      });

      string += buffer.toString('utf-8');

      // Update the remaining count and starting address for the next batch.
      remaining -= charsToRead;
      start += numRegistersToRead;
    }

    return string;
  } catch (error) {
    console.error('Error reading input registers:', error);
    throw error;
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

      remaining -= nRegistersToRead;
      start += nRegistersToRead;
    } catch (error) {
      console.error('Error reading registers:', error);
      return null;
    }
  }

  return registers;
};
