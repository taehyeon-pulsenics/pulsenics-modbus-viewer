/**
 * Timing constants for Modbus polling.
 *
 * Basis (local LAN, Modbus TCP device):
 *   - Network RTT is negligible (<1ms), but device processing time per chunk
 *     can vary. Using 1000ms per chunk as a safe ceiling.
 *   - Per-slave timeouts: chunks × 1000ms with a safety margin.
 *   - Poll intervals sit above slave timeouts so the busy-flag never permanently blocks.
 */

/** Maximum time (ms) to wait for a single chunked register read */
const CHUNK_TIMEOUT_MS = 1000;

/**
 * Per-slave poll timeouts (ms).
 * Dictates how long do you want the program to spend (worst case) to poll from a store.
 *   DC:   ceil(776/125)=7 input chunks  → ~7s worst case  → 7000ms
 *   AC:   ceil(47284/125)=379 chunks    → hard abort at    → 45000ms
 *   MISC: ~5 chunks total               → ~5s worst case  →  5000ms
 */
const SLAVE_TIMEOUT_MS = {
  DC: 7000, // optimized with realtime data
  AC: 45000, // optimized with realtime data
  MISC: 5000, // optimized with realtime data
};

/**
 * Per-group poll intervals (ms).
 * Dictates how long do you want the program to spend (optimal) to poll from a store.
 * AC: data changes slowly, 10s cadence is sufficient.
 */
const POLL_INTERVAL_MS = {
  DC: 2000, // on average, without timeouts, it takes about 1500ms (varies widely)
  AC: 10000, // AC data changes slowly; busy-flag handles overlap if poll takes longer
  MISC: 1000, // on average, without timeouts, it takes about 500ms (varies widely)
};

module.exports = { CHUNK_TIMEOUT_MS, SLAVE_TIMEOUT_MS, POLL_INTERVAL_MS };
