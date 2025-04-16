import { Server } from 'socket.io';
import { ADDRESS_TYPE, readRegisters } from './modbus.js';

let previousSnapShot = {
  dc_store_co: null,
  dc_store_ir: null,
  dc_store_hr: null,

  ac_store_1_co: null,
  ac_store_1_di: null,
  ac_store_1_ir: null,
  ac_store_1_hr: null,

  ac_store_2_ir: null,

  ac_store_3_ir: null,

  ac_store_4_ir: null,

  non_sampling_store_co: null,
  non_sampling_store_di: null,
  non_sampling_store_ir: null,
  non_sampling_store_hr: null,
};

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
      [ADDRESS_TYPE.DISCRETE_INPUT]: 20,
      [ADDRESS_TYPE.HOLDING_REGISTER]: 168,
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
    // 6: {
    //   [ADDRESS_TYPE.COIL]: 14,
    //   [ADDRESS_TYPE.DISCRETE_INPUT]: 15,
    //   [ADDRESS_TYPE.HOLDING_REGISTER]: 10,
    //   [ADDRESS_TYPE.INPUT_REGISTER]: 325,
    // },
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
