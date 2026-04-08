const { createMachine, assign } = require('xstate');
const { convertRegistersToBuffer } = require('../utils');

const createModbusMachine = (id, nRegisters, io) =>
  createMachine({
    id,
    context: {
      regs: Array(nRegisters).fill(0),
    },
    on: {
      POLL: {
        actions: assign({
          regs: ({ context, event }) => {
            const newRegs = event.regs;
            const oldRegs = context.regs;

            if (newRegs.length < nRegisters) {
              throw new Error(
                'Given number of registers are less than specified nRegisters'
              );
            }

            for (let i = 0; i < newRegs.length; i++) {
              if (newRegs[i] !== oldRegs[i]) {
                io && io.emit(id, convertRegistersToBuffer(newRegs));
                break;
              }
            }

            return newRegs;
          },
        }),
      },
      RETRIEVE: {
        actions: ({ context }) => {
          io && io.emit(id, convertRegistersToBuffer(context.regs));
        },
      },
    },
  });

module.exports = {
  createModbusMachine,
};
