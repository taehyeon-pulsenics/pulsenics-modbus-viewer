const ModbusRTU = require('modbus-serial');

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
      inputRegs: { start: 0, count: 47284 },
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

let connectionBroadcastInterval;

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

async function connectToAllSlaves(host, port, io) {
  // Create and connect clients
  for (const slave of SLAVES) {
    const client = new ModbusRTU();
    slave.client = client;

    try {
      await client.connectTCP(host, { port });

      client.setID(slave.unitId);

      broadcast_connection(io, true);
    } catch (err) {
      broadcast_connection(io, false);
    }
  }
}

// Poller
async function pollAllSlaves(io) {
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
    }

    try {
      // Input registers
      const inputs =
        readConfig.holdingRegs.count > 0
          ? await readInChunks(
              client,
              'readInputRegisters',
              readConfig.inputRegs.start,
              readConfig.inputRegs.count,
              LIMITS.inputRegs
            )
          : null;
      broadcast_registers(io, `${unitId}_4`, inputs);
    } catch (err) {
      console.error(`Error polling input registers of ${name}:`, err.message);
    }
  }
}

function pollModbus(host, port, io, interval) {
  clearInterval(interval);

  const newInterval = setInterval(() => {
    connectToAllSlaves(host, port, io).then(() => {
      pollAllSlaves(io);
    });
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
