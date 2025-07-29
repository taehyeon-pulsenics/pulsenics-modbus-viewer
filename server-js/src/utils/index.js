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

/**
 * Count the number of 1‑bits in `x`.
 */
function popcount(x) {
  // Brian Kernighan’s algorithm
  let c = 0;
  while (x) {
    x &= x - 1;
    c++;
  }
  return c;
}

/**
 * Compute the Hamming distance (bit‑diff count) between two equal‑length Buffers.
 */
function hammingDistance(A, B) {
  if (A.length !== B.length)
    throw new Error('Buffers must have the same length');
  let dist = 0;
  for (let i = 0; i < A.length; i++) {
    dist += popcount(A[i] ^ B[i]);
  }
  return dist;
}

/**
 * Are A and B “almost” the same up to maxBitDiff bit flips?
 *
 * @param {Buffer} A
 * @param {Buffer} B
 * @param {number} maxBitDiff
 */
function buffersAlmostEqualByBits(A, B, maxBitDiff = 1) {
  return hammingDistance(A, B) <= maxBitDiff;
}

module.exports = {
  convertRegistersToBuffer,
  buffersAlmostEqualByBits,
};
