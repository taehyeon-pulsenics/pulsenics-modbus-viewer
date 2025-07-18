const { createActor } = require('xstate');
const { Server } = require('socket.io');
const { createModbusMachine } = require('./machine');

// constants
const N_REGISTERS_PER_FLOAT_32 = 2;
const N_REGISTERS_PER_UTF_8 = 0.5;
const N_CMUS = 16;
const N_CHANNELS_PER_CMU = 24;
const N_MAX_FREQUENCIES = 120;

const N_SAMPLE_COILS = 3;
const N_SAMPLE_CONTROLS = 5;
const N_METADATA = 4;
const METADATA_LENGTH = 64;
const N_SAMPLE_STATUS = 4;

const N_MISC_COILS = 14;
const N_FAULTS = 18;
const N_LIMITS = 5;
const PROBE_SERIAL_NUM_LENGTH = 32;
const MODBUS_VERSION_NUM_LENGTH = 32;
const CLIENT_MESSAGE_LENGTH = 248;

const schema = {
  DC: [
    { name: 'CURRENT', nRegisters: N_REGISTERS_PER_FLOAT_32 },
    { name: 'PROBE_VOLTAGE', nRegisters: N_REGISTERS_PER_FLOAT_32 },
    {
      name: 'CMU_1_VOLTAGE',
      nRegisters: N_CHANNELS_PER_CMU * N_REGISTERS_PER_FLOAT_32,
    },
    {
      name: 'CMU_2_VOLTAGE',
      nRegisters: N_CHANNELS_PER_CMU * N_REGISTERS_PER_FLOAT_32,
    },
    {
      name: 'CMU_3_VOLTAGE',
      nRegisters: N_CHANNELS_PER_CMU * N_REGISTERS_PER_FLOAT_32,
    },
    {
      name: 'CMU_4_VOLTAGE',
      nRegisters: N_CHANNELS_PER_CMU * N_REGISTERS_PER_FLOAT_32,
    },
    {
      name: 'CMU_5_VOLTAGE',
      nRegisters: N_CHANNELS_PER_CMU * N_REGISTERS_PER_FLOAT_32,
    },
    {
      name: 'CMU_6_VOLTAGE',
      nRegisters: N_CHANNELS_PER_CMU * N_REGISTERS_PER_FLOAT_32,
    },
    {
      name: 'CMU_7_VOLTAGE',
      nRegisters: N_CHANNELS_PER_CMU * N_REGISTERS_PER_FLOAT_32,
    },
    {
      name: 'CMU_8_VOLTAGE',
      nRegisters: N_CHANNELS_PER_CMU * N_REGISTERS_PER_FLOAT_32,
    },
    {
      name: 'CMU_9_VOLTAGE',
      nRegisters: N_CHANNELS_PER_CMU * N_REGISTERS_PER_FLOAT_32,
    },
    {
      name: 'CMU_10_VOLTAGE',
      nRegisters: N_CHANNELS_PER_CMU * N_REGISTERS_PER_FLOAT_32,
    },
    {
      name: 'CMU_11_VOLTAGE',
      nRegisters: N_CHANNELS_PER_CMU * N_REGISTERS_PER_FLOAT_32,
    },
    {
      name: 'CMU_12_VOLTAGE',
      nRegisters: N_CHANNELS_PER_CMU * N_REGISTERS_PER_FLOAT_32,
    },
    {
      name: 'CMU_13_VOLTAGE',
      nRegisters: N_CHANNELS_PER_CMU * N_REGISTERS_PER_FLOAT_32,
    },
    {
      name: 'CMU_14_VOLTAGE',
      nRegisters: N_CHANNELS_PER_CMU * N_REGISTERS_PER_FLOAT_32,
    },
    {
      name: 'CMU_15_VOLTAGE',
      nRegisters: N_CHANNELS_PER_CMU * N_REGISTERS_PER_FLOAT_32,
    },
    {
      name: 'CMU_16_VOLTAGE',
      nRegisters: N_CHANNELS_PER_CMU * N_REGISTERS_PER_FLOAT_32,
    },
  ],
  AC_1: [
    { name: 'SAMPLE_COILS', nRegisters: N_SAMPLE_COILS },
    {
      name: 'SAMPLE_CONTROLS',
      nRegisters: N_SAMPLE_CONTROLS * N_REGISTERS_PER_FLOAT_32,
    },
    {
      name: 'SAMPLE_METADATA',
      nRegisters: (1 + METADATA_LENGTH * N_REGISTERS_PER_UTF_8) * N_METADATA,
    },
    { name: 'SAMPLE_STATUS', nRegisters: N_SAMPLE_STATUS },
    { name: 'CONNECTED_CMUS', nRegisters: N_CMUS },
    {
      name: 'FREQUENCIES',
      nRegisters: N_MAX_FREQUENCIES * N_REGISTERS_PER_FLOAT_32,
    },
    {
      name: 'CURRENT',
      nRegisters: N_MAX_FREQUENCIES * N_REGISTERS_PER_FLOAT_32 * 2,
    },
    {
      name: 'PROBE_VOLTAGE',
      nRegisters: N_MAX_FREQUENCIES * N_REGISTERS_PER_FLOAT_32 * 2,
    },
    // cmus
    {
      name: 'CMU_1_VOLTAGE',
      nRegisters:
        N_MAX_FREQUENCIES * N_REGISTERS_PER_FLOAT_32 * 2 * N_CHANNELS_PER_CMU,
    },
    {
      name: 'CMU_2_VOLTAGE',
      nRegisters:
        N_MAX_FREQUENCIES * N_REGISTERS_PER_FLOAT_32 * 2 * N_CHANNELS_PER_CMU,
    },
    {
      name: 'CMU_3_VOLTAGE',
      nRegisters:
        N_MAX_FREQUENCIES * N_REGISTERS_PER_FLOAT_32 * 2 * N_CHANNELS_PER_CMU,
    },
    {
      name: 'CMU_4_VOLTAGE',
      nRegisters:
        N_MAX_FREQUENCIES * N_REGISTERS_PER_FLOAT_32 * 2 * N_CHANNELS_PER_CMU,
    },
  ],
  MISC: [
    { name: 'FAULTS', nRegisters: N_FAULTS },
    {
      name: 'COILS',
      nRegisters: N_MISC_COILS,
    },
    {
      name: 'NEW_LIMITS',
      nRegisters: N_LIMITS * N_REGISTERS_PER_FLOAT_32,
    },
    {
      name: 'LIMITS',
      nRegisters: N_LIMITS * N_REGISTERS_PER_FLOAT_32,
    },
    {
      name: 'PROBE_SERIAL_NUMBER',
      nRegisters: 1 + PROBE_SERIAL_NUM_LENGTH * N_REGISTERS_PER_UTF_8,
    },
    {
      name: 'MODBUS_VERSION_NUMBER',
      nRegisters: 1 + MODBUS_VERSION_NUM_LENGTH * N_REGISTERS_PER_UTF_8,
    },
    {
      name: 'CLIENT_MESSAGE',
      nRegisters: 1 + CLIENT_MESSAGE_LENGTH * N_REGISTERS_PER_UTF_8,
    },
  ],
};

const MODBUS_SCHEMA = Object.fromEntries(
  Object.entries(schema).map(([section, schemas]) => [
    section,
    Object.fromEntries(
      schemas.map((schema) => [
        schema.name,
        { name: `${section}/${schema.name}`, nRegisters: schema.nRegisters },
      ])
    ),
  ])
);

const MODBUS_STATE = Object.fromEntries(
  Object.entries(schema).map(([section, schemas]) => [
    section,
    Object.fromEntries(
      schemas.map((schema) => [schema.name, `${section}/${schema.name}`])
    ),
  ])
);

/**
 *
 * @param {Server} io
 * @returns
 */
const initModbusStates = (io) => {
  // iterate over modbus schema
  const states = Object.values(MODBUS_SCHEMA).reduce((acc, section) => {
    Object.values(section).forEach(({ name, nRegisters }) => {
      acc[name] = createModbusMachine(name, nRegisters, io);
    });
    return acc;
  }, {});

  const actors = Object.keys(states).reduce((acc, key) => {
    const actor = createActor(states[key]);

    actor.start();

    acc[key] = actor;

    return acc;
  }, {});

  return {
    states,
    actors,
  };
};

module.exports = {
  MODBUS_STATE,
  initModbusStates,
};
