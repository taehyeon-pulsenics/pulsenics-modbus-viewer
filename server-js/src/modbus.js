const ModbusRTU = require('modbus-serial');
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
 * Initializes Modbus connections for each slave device.
 *
 * @param {string} host - The hostname or IP address of the Modbus server.
 * @param {number} port - The port number on which the Modbus server is listening.
 *
 * Iterates over the list of SLAVES, creating a Modbus client connection
 * for each slave using the specified host and port. Assigns the created
 * client to the slave object. Logs any errors encountered during the
 * connection process.
 */
const initModbusConnections = (host, port) => {
  for (const slave of SLAVES) {
    createModbusClientConnection(host, port, slave.unitId)
      .then((client) => {
        slave.client = client;
      })
      .catch((e) => {
        console.error(e);
      });
  }
};

/**
 * Establishes a Modbus TCP connection to a specified host and port.
 *
 * @param {string} host - The IP address or hostname of the Modbus server.
 * @param {number} port - The port number on which the Modbus server is listening.
 * @param {number} unitId - The unit ID of the Modbus device.
 * @returns {Promise<object|null>} A promise that resolves to the Modbus client instance if successful, or null if an error occurs.
 */
const createModbusClientConnection = async (host, port, unitId) => {
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

/**
 * Reads data from a Modbus client in chunks, allowing for large data sets to be processed
 * without exceeding Modbus inherit polling limits or timeouts.
 *
 * @param {Object} client - The Modbus client instance used for communication.
 * @param {string} fnName - The name of the function to call on the client for reading data.
 * @param {number} start - The starting address for the read operation.
 * @param {number} count - The total number of data points to read.
 * @param {number} chunkLimit - The maximum number of data points to read in a single chunk.
 * @returns {Promise<Array>} - A promise that resolves to an array containing the read data.
 */
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

/**
 * Polls all Modbus slaves for their coils, discrete inputs, holding registers, and input registers.
 *
 * Iterates over each slave in the SLAVES array, checking if the Modbus client is open.
 * For each slave, it reads data in chunks for coils, discrete inputs, holding registers,
 * and input registers based on the configuration provided in `readConfig`.
 *
 * Sends the polled data to the corresponding actors specified in the `actors` parameter.
 * Logs errors if any occur during the polling process.
 *
 * @param {Object} actors - An object containing actor instances to which the polled data is sent.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if polling is successful,
 *                               or false if an error occurs.
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
 * Polls Modbus devices at a specified interval, managing connections and broadcasting status.
 *
 * @param {string} host - The host address of the Modbus server.
 * @param {number} port - The port number of the Modbus server.
 * @param {Array} actors - An array of Modbus actors to poll.
 * @param {Object} io - The socket.io instance for broadcasting connection status.
 * @param {number} interval - The interval ID to clear before setting a new one.
 * @returns {NodeJS.Timeout} - The new interval ID for the polling process.
 */
function pollModbus(host, port, actors, io, interval) {
  clearInterval(interval);

  initModbusConnections(host, port);

  let busy = false;

  const newInterval = setInterval(() => {
    if (!busy) {
      busy = true;
      pollAllSlaves(actors)
        .then((v) => {
          if (v) {
            broadcast_connection(io, true);
          } else {
            broadcast_connection(io, false);
            initModbusConnections(host, port);
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
 * Broadcasts a connection event to all connected clients.
 *
 * @param {Object} io - The socket.io server instance used for broadcasting.
 * @param {Object} connection - The connection object to be emitted.
 */
const broadcast_connection = (io, connection) => {
  io.emit('connection', connection);
};

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

module.exports = { pollModbus };
