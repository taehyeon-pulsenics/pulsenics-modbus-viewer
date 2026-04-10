const ModbusRTU = require('modbus-serial');
const { MODBUS_STATE } = require('./modbus-state');
const {
  CHUNK_TIMEOUT_MS,
  SLAVE_TIMEOUT_MS,
  POLL_INTERVAL_MS,
} = require('./constants');

// Registers per CMU voltage block in AC input registers
const AC_REGS_PER_CMU = 11520;
// Offset where CMU voltage blocks start in AC input registers
const AC_CMU_BASE = 1204;
// CMUs assigned to each AC slave (0-indexed CMU numbers, 4 per slave)
const AC_SLAVE_CMU_SLOTS = {
  'AC 1': [0, 1, 2, 3],
  'AC 2': [4, 5, 6, 7],
  'AC 3': [8, 9, 10, 11],
  'AC 4': [12, 13, 14, 15],
};

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
    timeoutMs: SLAVE_TIMEOUT_MS.DC,
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
    timeoutMs: SLAVE_TIMEOUT_MS.AC,
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
    name: 'AC 2',
    unitId: 3,
    timeoutMs: SLAVE_TIMEOUT_MS.AC,
    readConfig: {
      coils: { start: 0, count: 0 },
      discrete: { start: 0, count: 0 },
      holdingRegs: { start: 0, count: 0 },
      inputRegs: {
        start: 0,
        count: 47284,
        actors: {
          [MODBUS_STATE.AC.CMU_5_VOLTAGE]: {
            address: [{ start: 1204 + 11520 * (1 - 1), end: 1204 + 11520 * 1 }],
          },
          [MODBUS_STATE.AC.CMU_6_VOLTAGE]: {
            address: [{ start: 1204 + 11520 * (2 - 1), end: 1204 + 11520 * 2 }],
          },
          [MODBUS_STATE.AC.CMU_7_VOLTAGE]: {
            address: [{ start: 1204 + 11520 * (3 - 1), end: 1204 + 11520 * 3 }],
          },
          [MODBUS_STATE.AC.CMU_8_VOLTAGE]: {
            address: [{ start: 1204 + 11520 * (4 - 1), end: 1204 + 11520 * 4 }],
          },
        },
      },
    },
  },
  {
    name: 'AC 3',
    unitId: 4,
    timeoutMs: SLAVE_TIMEOUT_MS.AC,
    readConfig: {
      coils: { start: 0, count: 0 },
      discrete: { start: 0, count: 0 },
      holdingRegs: { start: 0, count: 0 },
      inputRegs: {
        start: 0,
        count: 47284,
        actors: {
          [MODBUS_STATE.AC.CMU_9_VOLTAGE]: {
            address: [{ start: 1204 + 11520 * (1 - 1), end: 1204 + 11520 * 1 }],
          },
          [MODBUS_STATE.AC.CMU_10_VOLTAGE]: {
            address: [{ start: 1204 + 11520 * (2 - 1), end: 1204 + 11520 * 2 }],
          },
          [MODBUS_STATE.AC.CMU_11_VOLTAGE]: {
            address: [{ start: 1204 + 11520 * (3 - 1), end: 1204 + 11520 * 3 }],
          },
          [MODBUS_STATE.AC.CMU_12_VOLTAGE]: {
            address: [{ start: 1204 + 11520 * (4 - 1), end: 1204 + 11520 * 4 }],
          },
        },
      },
    },
  },
  {
    name: 'AC 4',
    unitId: 5,
    timeoutMs: SLAVE_TIMEOUT_MS.AC,
    readConfig: {
      coils: { start: 0, count: 0 },
      discrete: { start: 0, count: 0 },
      holdingRegs: { start: 0, count: 0 },
      inputRegs: {
        start: 0,
        count: 47284,
        actors: {
          [MODBUS_STATE.AC.CMU_13_VOLTAGE]: {
            address: [{ start: 1204 + 11520 * (1 - 1), end: 1204 + 11520 * 1 }],
          },
          [MODBUS_STATE.AC.CMU_14_VOLTAGE]: {
            address: [{ start: 1204 + 11520 * (2 - 1), end: 1204 + 11520 * 2 }],
          },
          [MODBUS_STATE.AC.CMU_15_VOLTAGE]: {
            address: [{ start: 1204 + 11520 * (3 - 1), end: 1204 + 11520 * 3 }],
          },
          [MODBUS_STATE.AC.CMU_16_VOLTAGE]: {
            address: [{ start: 1204 + 11520 * (4 - 1), end: 1204 + 11520 * 4 }],
          },
        },
      },
    },
  },
  {
    name: 'Miscellaneous',
    unitId: 6,
    timeoutMs: SLAVE_TIMEOUT_MS.MISC,
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
  let maxChunkMs = 0;
  let totalMs = 0;
  let chunkCount = 0;

  while (offset < count) {
    const thisCount = Math.min(chunkLimit, count - offset);
    const addr = start + offset;

    const t0 = Date.now();
    const resp = await withTimeout(readFn(addr, thisCount), CHUNK_TIMEOUT_MS);
    const elapsed = Date.now() - t0;

    if (elapsed > maxChunkMs) maxChunkMs = elapsed;
    totalMs += elapsed;
    chunkCount++;

    result.push(...resp.data);
    offset += thisCount;
  }

  if (chunkCount > 0) {
    console.debug(
      `[readInChunks] ${fnName} | chunks: ${chunkCount} | avg: ${Math.round(totalMs / chunkCount)}ms | max: ${maxChunkMs}ms | total: ${totalMs}ms`,
    );
  }

  return result;
}

/**
 * Dispatches polled register data to the relevant actors.
 *
 * @param {any[]} data - The raw register array returned from a read operation.
 * @param {Object} actorsConfig - The actors config block for this register type.
 * @param {Object} actors - The global actors map.
 */
function dispatchToActors(data, actorsConfig, actors) {
  for (const actorKey of Object.keys(actorsConfig)) {
    const { address } = actorsConfig[actorKey];
    let regs = [];
    for (const { start, end } of address) {
      regs = regs.concat(data.slice(start, end));
    }
    actors[actorKey].send({ type: 'POLL', regs });
  }
}

/**
 * Returns a Set of 0-indexed CMU slot numbers that are currently connected,
 * derived from the CONNECTED_CMUS actor state (16 boolean registers).
 *
 * @param {Object} actors
 * @returns {Set<number>}
 */
function getConnectedCmuSlots(actors) {
  const actor = actors[MODBUS_STATE.AC.CONNECTED_CMUS];
  if (!actor)
    return new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  const regs = actor.getSnapshot().context.regs;
  const connected = new Set();
  for (let i = 0; i < regs.length; i++) {
    if (regs[i]) connected.add(i);
  }
  // If we have no data yet (all zeros on first boot), treat all as connected
  return connected.size > 0
    ? connected
    : new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
}

/**
 * Builds a minimal list of {start, count} read ranges covering only the
 * connected CMU slots assigned to this AC slave. Non-contiguous connected
 * CMUs are merged into a single span to minimise round-trips.
 *
 * @param {string} slaveName - e.g. 'AC 1'
 * @param {Set<number>} connectedSlots - global 0-indexed CMU slot numbers
 * @returns {{ start: number, count: number, actorKey: string }[]}
 */
function buildAcCmuRanges(slaveName, connectedSlots) {
  const slaveSlots = AC_SLAVE_CMU_SLOTS[slaveName];
  if (!slaveSlots) return [];

  const ranges = [];
  for (let i = 0; i < slaveSlots.length; i++) {
    const globalSlot = slaveSlots[i];
    if (!connectedSlots.has(globalSlot)) continue;

    // Local slot index within this slave (0–3)
    const localSlot = i;
    const start = AC_CMU_BASE + localSlot * AC_REGS_PER_CMU;
    ranges.push({
      start,
      count: AC_REGS_PER_CMU,
      actorKey: MODBUS_STATE.AC[`CMU_${globalSlot + 1}_VOLTAGE`],
    });
  }
  return ranges;
}

/**
 * Polls a single Modbus slave sequentially across all register types.
 * For AC slaves, only reads CMU voltage blocks for connected CMUs.
 * Register types within a slave must remain sequential since they share one TCP client.
 *
 * @param {Object} slave
 * @param {Object} actors
 * @param {Set<number>|null} connectedCmuSlots - pass for AC slaves, null otherwise
 * @returns {Promise<boolean>}
 */
async function pollSlave(slave, actors, connectedCmuSlots = null) {
  const { name, client, readConfig } = slave;

  if (!client || !client.isOpen) {
    console.error(`Modbus client not open for slave: ${name}`);
    return false;
  }

  const t0 = Date.now();

  try {
    if (readConfig.coils.count > 0) {
      const coils = await readInChunks(
        client,
        'readCoils',
        readConfig.coils.start,
        readConfig.coils.count,
        LIMITS.coils,
      );
      if (readConfig.coils.actors)
        dispatchToActors(coils, readConfig.coils.actors, actors);
    }
  } catch (err) {
    console.error(`Error polling coils of ${name}:`, err.message);
    return false;
  }

  try {
    if (readConfig.discrete.count > 0) {
      const discrete = await readInChunks(
        client,
        'readDiscreteInputs',
        readConfig.discrete.start,
        readConfig.discrete.count,
        LIMITS.discrete,
      );
      if (readConfig.discrete.actors)
        dispatchToActors(discrete, readConfig.discrete.actors, actors);
    }
  } catch (err) {
    console.error(`Error polling discrete inputs of ${name}:`, err.message);
    return false;
  }

  try {
    if (readConfig.holdingRegs.count > 0) {
      const holding = await readInChunks(
        client,
        'readHoldingRegisters',
        readConfig.holdingRegs.start,
        readConfig.holdingRegs.count,
        LIMITS.holdingRegs,
      );
      if (readConfig.holdingRegs.actors)
        dispatchToActors(holding, readConfig.holdingRegs.actors, actors);
    }
  } catch (err) {
    console.error(`Error polling holding registers of ${name}:`, err.message);
    return false;
  }

  // For AC slaves with connected-CMU awareness, replace the monolithic input
  // register read with targeted per-CMU reads.
  if (connectedCmuSlots !== null && AC_SLAVE_CMU_SLOTS[name]) {
    const cmuRanges = buildAcCmuRanges(name, connectedCmuSlots);

    if (cmuRanges.length === 0) {
      console.debug(
        `[pollSlave] ${name} — no connected CMUs, skipping input registers`,
      );
    }

    // Read non-CMU input registers first (frequencies, current, probe voltage on AC 1)
    const nonCmuActors = {};
    if (readConfig.inputRegs.actors) {
      for (const [key, val] of Object.entries(readConfig.inputRegs.actors)) {
        if (!key.includes('CMU')) nonCmuActors[key] = val;
      }
    }

    if (Object.keys(nonCmuActors).length > 0) {
      // Non-CMU data lives at the start of the input register space (0..1204)
      try {
        const nonCmuData = await readInChunks(
          client,
          'readInputRegisters',
          readConfig.inputRegs.start,
          AC_CMU_BASE,
          LIMITS.inputRegs,
        );
        dispatchToActors(nonCmuData, nonCmuActors, actors);
      } catch (err) {
        console.error(
          `Error polling non-CMU input registers of ${name}:`,
          err.message,
        );
        return false;
      }
    }

    // Read each connected CMU's block individually
    for (const { start, count, actorKey } of cmuRanges) {
      try {
        const data = await readInChunks(
          client,
          'readInputRegisters',
          start,
          count,
          LIMITS.inputRegs,
        );
        actors[actorKey].send({ type: 'POLL', regs: data });
      } catch (err) {
        console.error(`Error polling ${actorKey} of ${name}:`, err.message);
        return false;
      }
    }
  } else {
    try {
      if (readConfig.inputRegs.count > 0) {
        const inputs = await readInChunks(
          client,
          'readInputRegisters',
          readConfig.inputRegs.start,
          readConfig.inputRegs.count,
          LIMITS.inputRegs,
        );
        if (readConfig.inputRegs.actors)
          dispatchToActors(inputs, readConfig.inputRegs.actors, actors);
      }
    } catch (err) {
      console.error(`Error polling input registers of ${name}:`, err.message);
      return false;
    }
  }

  console.debug(`[pollSlave] ${name} completed in ${Date.now() - t0}ms`);
  return true;
}

const SLAVE_GROUPS = {
  DC: SLAVES.filter((s) => s.name === 'DC'),
  AC: SLAVES.filter((s) => s.name.startsWith('AC')),
  MISC: SLAVES.filter((s) => s.name === 'Miscellaneous'),
};

/**
 * Polls a group of slaves in parallel.
 * For AC slaves, reads connected-CMU state first and passes it down so each
 * slave only fetches voltage blocks for its connected CMUs.
 *
 * @param {Object[]} slaves
 * @param {Object} actors
 * @param {boolean} isAcGroup
 * @returns {Promise<boolean>}
 */
async function pollSlaveGroup(slaves, actors, isAcGroup = false) {
  const connectedCmuSlots = isAcGroup ? getConnectedCmuSlots(actors) : null;

  if (isAcGroup) {
    console.debug(
      `[pollSlaveGroup] AC connected CMU slots: [${[...connectedCmuSlots].join(', ')}]`,
    );
  }

  const results = await Promise.all(
    slaves.map((slave) =>
      withTimeout(
        pollSlave(slave, actors, connectedCmuSlots),
        slave.timeoutMs,
      ).catch((e) => {
        console.error(`Slave ${slave.name} timed out or failed:`, e.message);
        return false;
      }),
    ),
  );
  return results.every(Boolean);
}

/**
 * Creates a self-gating poll loop for a slave group.
 * A busy-flag prevents overlapping cycles if a poll takes longer than the interval.
 *
 * @param {Object[]} slaves
 * @param {Object} actors
 * @param {Object} io
 * @param {string} host
 * @param {number} port
 * @param {number} intervalMs
 * @param {boolean} isAcGroup
 * @returns {NodeJS.Timeout}
 */
function startGroupInterval(
  slaves,
  actors,
  io,
  host,
  port,
  intervalMs,
  isAcGroup = false,
) {
  let busy = false;
  return setInterval(() => {
    if (!busy) {
      busy = true;
      pollSlaveGroup(slaves, actors, isAcGroup)
        .then((ok) => {
          broadcast_connection(io, ok);
          if (!ok) initModbusConnections(host, port);
        })
        .catch((e) => console.error(e))
        .finally(() => {
          busy = false;
        });
    }
  }, intervalMs);
}

/**
 * Starts per-group Modbus poll loops and returns their interval IDs.
 * Pass the previous intervals to clear them before starting fresh (e.g. on IP change).
 *
 * @param {string} host
 * @param {number} port
 * @param {Object} actors
 * @param {Object} io
 * @param {{ dc?: NodeJS.Timeout, ac?: NodeJS.Timeout, misc?: NodeJS.Timeout }} [prevIntervals]
 * @returns {{ dc: NodeJS.Timeout, ac: NodeJS.Timeout, misc: NodeJS.Timeout }}
 */
function pollModbus(host, port, actors, io, prevIntervals = {}) {
  clearInterval(prevIntervals.dc);
  clearInterval(prevIntervals.ac);
  clearInterval(prevIntervals.misc);

  initModbusConnections(host, port);

  return {
    dc: startGroupInterval(
      SLAVE_GROUPS.DC,
      actors,
      io,
      host,
      port,
      POLL_INTERVAL_MS.DC,
    ),
    ac: startGroupInterval(
      SLAVE_GROUPS.AC,
      actors,
      io,
      host,
      port,
      POLL_INTERVAL_MS.AC,
      true, // isAcGroup — enables connected-CMU-aware polling
    ),
    misc: startGroupInterval(
      SLAVE_GROUPS.MISC,
      actors,
      io,
      host,
      port,
      POLL_INTERVAL_MS.MISC,
    ),
  };
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
      setTimeout(() => reject(new Error('Timeout')), ms),
    ),
  ]);
}

module.exports = { pollModbus };
