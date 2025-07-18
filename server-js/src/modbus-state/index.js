const { createActor } = require('xstate');
const { Server } = require('socket.io');
const { createModbusMachine } = require('./machine');
const { convertRegistersToBuffer } = require('../utils');

const MODBUS_STATE = {
  DC: {
    CURRENT: 'DC/CURRENT',
  },
  AC_1: {
    FREQUENCIES: 'AC_1/FREQUENCIES',
  },
  MISC: {
    FAULTS: 'MISC/FAULTS',
  },
};

/**
 *
 * @param {Server} io
 * @returns
 */
const initModbusStates = (io) => {
  const frequenciesMachine = createModbusMachine(
    MODBUS_STATE.AC_1.FREQUENCIES,
    Array(240).fill(0),
    (registers) => {
      console.log(registers);
      io.emit(
        MODBUS_STATE.AC_1.FREQUENCIES,
        convertRegistersToBuffer(registers)
      );
    }
  );

  const frequenciesActor = createActor(frequenciesMachine);

  const states = {
    frequenciesMachine,
  };

  const actors = {
    frequenciesActor,
  };

  for (const actor of Object.values(actors)) {
    actor.start();
  }

  return {
    states,
    actors,
  };
};

module.exports = {
  initModbusStates,
};
