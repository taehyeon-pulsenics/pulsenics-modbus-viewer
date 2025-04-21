import { Server } from 'socket.io';
import { ADDRESS_TYPE, readRegisters } from './modbus.js';
import CONFIG from './config.cjs';

/**
 * TBD
 *
 * @param {Server} io - Socket IO Server instance
 */
export const pollModbus = async (io) => {
  const nRegistersMap = {
    1: {
      [ADDRESS_TYPE.COIL]: 1,
      [ADDRESS_TYPE.HOLDING_REGISTER]: 2,
      [ADDRESS_TYPE.INPUT_REGISTER]: 776,
    },
    2: {
      [ADDRESS_TYPE.COIL]: 3,
      [ADDRESS_TYPE.DISCRETE_INPUT]: CONFIG.legacy ? 19 : 20,
      [ADDRESS_TYPE.HOLDING_REGISTER]: CONFIG.legacy ? 10 : 232,
      [ADDRESS_TYPE.INPUT_REGISTER]: 47284,
    },
    // 3: {
    //   [ADDRESS_TYPE.INPUT_REGISTER]: 47284,
    // },
    // 4: {
    //   [ADDRESS_TYPE.INPUT_REGISTER]: 47284,
    // },
    // 5: {
    //   [ADDRESS_TYPE.INPUT_REGISTER]: 47284,
    // },
    6: {
      [ADDRESS_TYPE.COIL]: 14,
      [ADDRESS_TYPE.DISCRETE_INPUT]: 15,
      [ADDRESS_TYPE.HOLDING_REGISTER]: 10,
      [ADDRESS_TYPE.INPUT_REGISTER]: CONFIG.legacy ? 10 : 325,
    },
  };

  for (const unitId of Object.keys(nRegistersMap)) {
    for (const addressType of Object.getOwnPropertySymbols(
      nRegistersMap[unitId]
    )) {
      const key = `${unitId}_${addressType.description}`;

      const registers = await readRegisters(
        unitId,
        addressType,
        nRegistersMap[unitId][addressType]
      );

      if (!registers) {
        io.emit(key, 'null');
        continue;
      }

      const buffer = Buffer.alloc(registers.length * 2);

      registers.forEach((value, index) => {
        buffer.writeUInt16BE(value, index * 2);
      });

      io.emit(key, buffer);
    }
  }
};
