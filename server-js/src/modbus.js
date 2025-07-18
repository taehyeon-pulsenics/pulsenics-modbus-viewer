const ModbusRTU = require('modbus-serial');
const { Server } = require('socket.io');
const { Actor } = require('xstate');

// Modbus protocol limits
const LIMITS = {
  coils: 2000, // max bits per readCoils/readDiscreteInputs
  discrete: 2000,
  holdingRegs: 125, // max registers per readHoldingRegisters/readInputRegisters
  inputRegs: 125,
};

// Configuration for your six stores/slaves
// You can override any of coils/discrete/holdingRegs/inputRegs per slave
const SLAVES = [
  {
    name: 'DC',
    unitId: 1,
    readConfig: {
      coils: { start: 0, count: 1 },
      discrete: { start: 0, count: 0 },
      holdingRegs: { start: 0, count: 2 },
      inputRegs: { start: 0, count: 776 },
    },
  },
  {
    name: 'AC 1',
    unitId: 2,
    readConfig: {
      coils: { start: 0, count: 3 },
      discrete: { start: 0, count: 20 },
      holdingRegs: { start: 0, count: 232 },
      inputRegs: {
        start: 0,
        count: 47284,
        stateUpdate: {
          frequenciesActor: { start: 4, end: 244 },
        },
      },
    },
  },
  {
    name: 'Miscellaneous',
    unitId: 6,
    readConfig: {
      coils: { start: 0, count: 14 },
      discrete: { start: 0, count: 15 },
      holdingRegs: { start: 0, count: 10 },
      inputRegs: { start: 0, count: 325 },
    },
  },
];

/**
 * Initialize socket connection to Modbus Server at given address
 * @param {string} host IPv4 of Modbus Server
 * @param {string} port Port of Modbus Server
 * @param {Server} io Socket IO server instance
 */
const initModbusConnections = (host, port, io) => {
  for (const slave of SLAVES) {
    const client = createModbusClientConnection(host, port, slave.unitId, io);
    slave.client = client;
  }
};

/**
 * Create new Modbus connection at given address's unit
 *
 * @param {string} host IPv4 of Modbus Server
 * @param {string} port Port of Modbus Server
 * @param {number} unitId Unit (Slave) ID
 * @param {Server} io Socket IO server instance
 * @returns {ModbusRTU} New opened ModbusRTU instance
 */
const createModbusClientConnection = (host, port, unitId, io) => {
  const client = new ModbusRTU();

  client
    .connectTCP(host, { port })
    .then(() => {
      client.setID(unitId);

      broadcast_connection(io, true);
    })
    .catch(() => {
      broadcast_connection(io, false);
    });

  return client;
};

// Helper: read in chunks and concatenate results
async function readInChunks(client, fnName, start, count, chunkLimit) {
  const readFn = client[fnName].bind(client);
  const result = [];
  let offset = 0;

  while (offset < count) {
    const thisCount = Math.min(chunkLimit, count - offset);
    const addr = start + offset;

    // e.g. client.readCoils(addr, thisCount)
    const resp = await readFn(addr, thisCount);
    result.push(...resp.data);
    offset += thisCount;
  }

  return result;
}

// Poller
/**
 *
 * @param {string} host IPv4 of Modbus Server
 * @param {string} port Port of Modbus Server
 * @param {{ [key: str]: Actor }} actors
 * @param {Server} io
 */
async function pollAllSlaves(host, port, actors, io) {
  for (const slave of SLAVES) {
    const { name, unitId, client, readConfig } = slave;

    try {
      // Coils
      const coils =
        readConfig.coils.count > 0
          ? await readInChunks(
              client,
              'readCoils',
              readConfig.coils.start,
              readConfig.coils.count,
              LIMITS.coils
            )
          : null;
      broadcast_registers(io, `${unitId}_1`, coils);
    } catch (err) {
      console.error(`Error polling coils of ${name}:`, err.message);
      if (!client.isOpen) {
        slave.client = createModbusClientConnection(host, port, unitId, io);
      }
    }

    // Discrete inputs
    try {
      const discrete =
        readConfig.discrete.count > 0
          ? await readInChunks(
              client,
              'readDiscreteInputs',
              readConfig.discrete.start,
              readConfig.discrete.count,
              LIMITS.discrete
            )
          : null;
      broadcast_registers(io, `${unitId}_2`, discrete);
    } catch (err) {
      console.error(`Error polling discrete inputs of ${name}:`, err.message);
      if (!client.isOpen) {
        slave.client = createModbusClientConnection(host, port, unitId, io);
      }
    }

    try {
      // Holding registers
      const holding =
        readConfig.holdingRegs.count > 0
          ? await readInChunks(
              client,
              'readHoldingRegisters',
              readConfig.holdingRegs.start,
              readConfig.holdingRegs.count,
              LIMITS.holdingRegs
            )
          : null;
      broadcast_registers(io, `${unitId}_3`, holding);
    } catch (err) {
      console.error(`Error holding registers of ${name}:`, err.message);
      if (!client.isOpen) {
        slave.client = createModbusClientConnection(host, port, unitId, io);
      }
    }

    try {
      // Input registers
      const inputs =
        readConfig.inputRegs.count > 0
          ? await readInChunks(
              client,
              'readInputRegisters',
              readConfig.inputRegs.start,
              readConfig.inputRegs.count,
              LIMITS.inputRegs
            )
          : null;

      if (readConfig.inputRegs.stateUpdate) {
        for (const actor of Object.keys(readConfig.inputRegs.stateUpdate)) {
          const regs = inputs.slice(
            readConfig.inputRegs.stateUpdate[actor].start,
            readConfig.inputRegs.stateUpdate[actor].end
          );
          actors[actor].send({
            type: 'POLL',
            regs,
          });
        }
      }

      broadcast_registers(io, `${unitId}_4`, inputs);
    } catch (err) {
      console.error(`Error polling input registers of ${name}:`, err.message);
      if (!client.isOpen) {
        slave.client = createModbusClientConnection(host, port, unitId, io);
      }
    }
  }
}

/**
 *
 * @param {str} host
 * @param {str | number} port
 * @param {{ [key: str]: Actor }} actors
 * @param {Server} io
 * @param {NodeJS.Timeout} interval
 * @returns
 */
function pollModbus(host, port, actors, io, interval) {
  clearInterval(interval);

  initModbusConnections(host, port, io);

  const newInterval = setInterval(() => {
    pollAllSlaves(host, port, actors, io);
  }, 1000);

  return newInterval;
}

const broadcast_registers = (io, key, registers) => {
  if (!registers) {
    io.emit(key, 'null');
    return;
  }

  const buffer = Buffer.alloc(registers.length * 2);

  registers.forEach((value, index) => {
    buffer.writeUInt16BE(value, index * 2);
  });

  io.emit(key, buffer);
};

const broadcast_connection = (io, connection) => {
  io.emit('connection', connection);
};

module.exports = { pollModbus };
