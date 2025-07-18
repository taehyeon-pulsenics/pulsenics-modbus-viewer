/**
 * Convert list of registers to Buffer for websocket comm
 * @param {number[]} registers
 * @returns {Buffer}
 */
const convertRegistersToBuffer = (registers) => {
  const buffer = Buffer.alloc(registers.length * 2);

  registers.forEach((value, index) => {
    buffer.writeUInt16BE(value, index * 2);
  });

  return buffer;
};

module.exports = {
  convertRegistersToBuffer,
};
