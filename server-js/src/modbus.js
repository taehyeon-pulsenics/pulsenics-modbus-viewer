const ModbusRTU = require('modbus-serial');
const { Server } = require('socket.io');
const { Actor } = require('xstate');
const { MODBUS_STATE } = require('./modbus-state');

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
      inputRegs: {
        start: 0,
        count: 776,
        actors: {
          [MODBUS_STATE.DC.CURRENT]: { address: [{ start: 6, end: 8 }] },
          [MODBUS_STATE.DC.PROBE_VOLTAGE]: { address: [{ start: 4, end: 6 }] },
          [MODBUS_STATE.DC.CMU_1_VOLTAGE]: {
            address: [
              {
                start: 8 + 48 * (1 - 1),
                end: 8 + 48 * 1,
              },
            ],
          },
          [MODBUS_STATE.DC.CMU_2_VOLTAGE]: {
            address: [
              {
                start: 8 + 48 * (2 - 1),
                end: 8 + 48 * 2,
              },
            ],
          },
          [MODBUS_STATE.DC.CMU_3_VOLTAGE]: {
            address: [
              {
                start: 8 + 48 * (3 - 1),
                end: 8 + 48 * 3,
              },
            ],
          },
          [MODBUS_STATE.DC.CMU_4_VOLTAGE]: {
            address: [
              {
                start: 8 + 48 * (4 - 1),
                end: 8 + 48 * 4,
              },
            ],
          },
          [MODBUS_STATE.DC.CMU_5_VOLTAGE]: {
            address: [
              {
                start: 8 + 48 * (5 - 1),
                end: 8 + 48 * 5,
              },
            ],
          },
          [MODBUS_STATE.DC.CMU_6_VOLTAGE]: {
            address: [
              {
                start: 8 + 48 * (6 - 1),
                end: 8 + 48 * 6,
              },
            ],
          },
          [MODBUS_STATE.DC.CMU_7_VOLTAGE]: {
            address: [
              {
                start: 8 + 48 * (7 - 1),
                end: 8 + 48 * 7,
              },
            ],
          },
          [MODBUS_STATE.DC.CMU_8_VOLTAGE]: {
            address: [
              {
                start: 8 + 48 * (8 - 1),
                end: 8 + 48 * 8,
              },
            ],
          },
          [MODBUS_STATE.DC.CMU_9_VOLTAGE]: {
            address: [
              {
                start: 8 + 48 * (9 - 1),
                end: 8 + 48 * 9,
              },
            ],
          },
          [MODBUS_STATE.DC.CMU_10_VOLTAGE]: {
            address: [
              {
                start: 8 + 48 * (10 - 1),
                end: 8 + 48 * 10,
              },
            ],
          },
          [MODBUS_STATE.DC.CMU_11_VOLTAGE]: {
            address: [
              {
                start: 8 + 48 * (11 - 1),
                end: 8 + 48 * 11,
              },
            ],
          },
          [MODBUS_STATE.DC.CMU_12_VOLTAGE]: {
            address: [
              {
                start: 8 + 48 * (12 - 1),
                end: 8 + 48 * 12,
              },
            ],
          },
          [MODBUS_STATE.DC.CMU_13_VOLTAGE]: {
            address: [
              {
                start: 8 + 48 * (13 - 1),
                end: 8 + 48 * 13,
              },
            ],
          },
          [MODBUS_STATE.DC.CMU_14_VOLTAGE]: {
            address: [
              {
                start: 8 + 48 * (14 - 1),
                end: 8 + 48 * 14,
              },
            ],
          },
          [MODBUS_STATE.DC.CMU_15_VOLTAGE]: {
            address: [
              {
                start: 8 + 48 * (15 - 1),
                end: 8 + 48 * 15,
              },
            ],
          },
          [MODBUS_STATE.DC.CMU_16_VOLTAGE]: {
            address: [
              {
                start: 8 + 48 * (16 - 1),
                end: 8 + 48 * 16,
              },
            ],
          },
        },
      },
    },
  },
  {
    name: 'AC 1',
    unitId: 2,
    readConfig: {
      coils: {
        start: 0,
        count: 3,
        actors: {
          [MODBUS_STATE.AC.SAMPLE_COILS]: {
            address: [{ start: 0, end: 4 }],
          },
        },
      },
      discrete: {
        start: 0,
        count: 20,
        actors: {
          [MODBUS_STATE.AC.SAMPLE_STATUS]: {
            address: [
              { start: 0, end: 2 },
              { start: 18, end: 20 },
            ],
          },
          [MODBUS_STATE.AC.CONNECTED_CMUS]: {
            address: [{ start: 2, end: 18 }],
          },
        },
      },
      holdingRegs: {
        start: 0,
        count: 232,
        actors: {
          [MODBUS_STATE.AC.SAMPLE_CONTROLS]: {
            address: [{ start: 0, end: 10 }],
          },
          [MODBUS_STATE.AC.SAMPLE_METADATA]: {
            address: [{ start: 100, end: 232 }],
          },
        },
      },
      inputRegs: {
        start: 0,
        count: 47284,
        actors: {
          [MODBUS_STATE.AC.FREQUENCIES]: {
            address: [{ start: 4, end: 244 }],
          },
          [MODBUS_STATE.AC.CURRENT]: {
            address: [{ start: 244, end: 724 }],
          },
          [MODBUS_STATE.AC.PROBE_VOLTAGE]: {
            address: [{ start: 724, end: 1204 }],
          },
          [MODBUS_STATE.AC.CMU_1_VOLTAGE]: {
            address: [{ start: 1204 + 11520 * (1 - 1), end: 1204 + 11520 * 1 }],
          },
          [MODBUS_STATE.AC.CMU_2_VOLTAGE]: {
            address: [{ start: 1204 + 11520 * (2 - 1), end: 1204 + 11520 * 2 }],
          },
          [MODBUS_STATE.AC.CMU_3_VOLTAGE]: {
            address: [{ start: 1204 + 11520 * (3 - 1), end: 1204 + 11520 * 3 }],
          },
          [MODBUS_STATE.AC.CMU_4_VOLTAGE]: {
            address: [{ start: 1204 + 11520 * (4 - 1), end: 1204 + 11520 * 4 }],
          },
        },
      },
    },
  },
  {
    name: 'Miscellaneous',
    unitId: 6,
    readConfig: {
      coils: {
        start: 0,
        count: 14,
        actors: {
          [MODBUS_STATE.MISC.COILS]: {
            address: [{ start: 0, end: 14 }],
          },
        },
      },
      discrete: {
        start: 0,
        count: 18,
        actors: {
          [MODBUS_STATE.MISC.FAULTS]: {
            address: [{ start: 0, end: 18 }],
          },
        },
      },
      holdingRegs: {
        start: 0,
        count: 10,
        actors: {
          [MODBUS_STATE.MISC.NEW_LIMITS]: {
            address: [{ start: 0, end: 10 }],
          },
        },
      },
      inputRegs: {
        start: 0,
        count: 325,
        actors: {
          [MODBUS_STATE.MISC.LIMITS]: {
            address: [{ start: 0, end: 10 }],
          },
          [MODBUS_STATE.MISC.PROBE_SERIAL_NUMBER]: {
            address: [{ start: 100, end: 117 }],
          },
          [MODBUS_STATE.MISC.MODBUS_VERSION_NUMBER]: {
            address: [{ start: 117, end: 134 }],
          },
          [MODBUS_STATE.MISC.CLIENT_MESSAGE]: {
            address: [{ start: 200, end: 325 }],
          },
        },
      },
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
    createModbusClientConnection(host, port, slave.unitId, io)
      .then((client) => {
        slave.client = client;
      })
      .catch((e) => {
        console.error(e);
      });
  }
};

/**
 * Create new Modbus connection at given address's unit
 *
 * @param {string} host IPv4 of Modbus Server
 * @param {string} port Port of Modbus Server
 * @param {number} unitId Unit (Slave) ID
 * @param {Server} io Socket IO server instance
 * @returns {Promise<ModbusRTU | null>} New opened ModbusRTU instance or null
 */
const createModbusClientConnection = async (host, port, unitId, io) => {
  try {
    const client = new ModbusRTU();

    await client.connectTCP(host, { port });

    client.setID(unitId);

    return client;
  } catch (e) {
    console.error(e);
    return null;
  }
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
    const resp = await withTimeout(readFn(addr, thisCount), 5000);
    result.push(...resp.data);
    offset += thisCount;
  }

  return result;
}

// Poller
/**
 *
 * @param {{ [key: str]: Actor }} actors
 */
async function pollAllSlaves(actors) {
  for (const slave of SLAVES) {
    const { name, client, readConfig } = slave;

    if (!!client && client.isOpen) {
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

        if (coils && readConfig.coils.actors) {
          for (const actor of Object.keys(readConfig.coils.actors)) {
            const actorDetail = readConfig.coils.actors[actor];
            const addresses = actorDetail.address;
            let regs = [];
            for (const { start, end } of addresses) {
              regs = regs.concat(coils.slice(start, end));
            }
            actors[actor].send({
              type: 'POLL',
              regs,
            });
          }
        }
      } catch (err) {
        console.error(`Error polling coils of ${name}:`, err.message);

        return false;
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

        if (discrete && readConfig.discrete.actors) {
          for (const actor of Object.keys(readConfig.discrete.actors)) {
            const actorDetail = readConfig.discrete.actors[actor];
            const addresses = actorDetail.address;
            let regs = [];
            for (const { start, end } of addresses) {
              regs = regs.concat(discrete.slice(start, end));
            }
            actors[actor].send({
              type: 'POLL',
              regs,
            });
          }
        }
      } catch (err) {
        console.error(`Error polling discrete inputs of ${name}:`, err.message);
        return false;
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

        if (holding && readConfig.holdingRegs.actors) {
          for (const actor of Object.keys(readConfig.holdingRegs.actors)) {
            const actorDetail = readConfig.holdingRegs.actors[actor];
            const addresses = actorDetail.address;
            let regs = [];
            for (const { start, end } of addresses) {
              regs = regs.concat(holding.slice(start, end));
            }
            actors[actor].send({
              type: 'POLL',
              regs,
            });
          }
        }
      } catch (err) {
        console.error(`Error holding registers of ${name}:`, err.message);
        return false;
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

        if (inputs && readConfig.inputRegs.actors) {
          for (const actor of Object.keys(readConfig.inputRegs.actors)) {
            const actorDetail = readConfig.inputRegs.actors[actor];
            const addresses = actorDetail.address;
            let regs = [];
            for (const { start, end } of addresses) {
              regs = regs.concat(inputs.slice(start, end));
            }
            actors[actor].send({
              type: 'POLL',
              regs,
            });
          }
        }
      } catch (err) {
        console.error(`Error polling input registers of ${name}:`, err.message);
        return false;
      }
    } else {
      console.error('Modbus server not opened');
      return false;
    }
  }
  return true;
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

  let busy = false;

  const newInterval = setInterval(() => {
    if (!busy) {
      // it gets stuck somewhere over here
      busy = true;
      pollAllSlaves(actors)
        .then((v) => {
          if (v) {
            broadcast_connection(io, true);
          } else {
            broadcast_connection(io, false);
            initModbusConnections(host, port, io);
          }
          busy = false;
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, 1000);

  return newInterval;
}

/**
 *
 * @param {Server} io
 * @param {boolean} connection
 */
const broadcast_connection = (io, connection) => {
  io.emit('connection', connection);
};

module.exports = { pollModbus };

/**
 * Returns a promise that resolves or rejects with the result of the input promise,
 * or rejects with a timeout error if the specified time limit is exceeded.
 *
 * @param {Promise} promise - The promise to race against the timeout.
 * @param {number} ms - The time in milliseconds to wait before rejecting with a timeout error.
 * @returns {Promise} A promise that resolves or rejects with the result of the input promise,
 * or rejects with a timeout error if the time limit is exceeded.
 */
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    ),
  ]);
}
