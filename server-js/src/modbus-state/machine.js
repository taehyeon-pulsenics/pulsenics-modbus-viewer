const { createMachine, assign } = require('xstate');

const createModbusMachine = (id, initialRegisters, broadcast) =>
  createMachine({
    id,
    context: {
      regs: initialRegisters,
    },
    on: {
      POLL: {
        actions: assign({
          regs: ({ context, event }) => {
            const newRegs = event.regs;
            const oldRegs = context.regs;

            for (let i = 0; i < newRegs.length; i++) {
              if (newRegs[i] !== oldRegs[i]) {
                broadcast && broadcast(newRegs);
                break;
              }
            }

            return newRegs;
          },
        }),
      },
    },
  });

module.exports = {
  createModbusMachine,
};
