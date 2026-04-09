const schema = {
  DC: {
    CURRENT: null,
    PROBE_VOLTAGE: null,
    CMU_1_VOLTAGE: null,
    CMU_2_VOLTAGE: null,
    CMU_3_VOLTAGE: null,
    CMU_4_VOLTAGE: null,
    CMU_5_VOLTAGE: null,
    CMU_6_VOLTAGE: null,
    CMU_7_VOLTAGE: null,
    CMU_8_VOLTAGE: null,
    CMU_9_VOLTAGE: null,
    CMU_10_VOLTAGE: null,
    CMU_11_VOLTAGE: null,
    CMU_12_VOLTAGE: null,
    CMU_13_VOLTAGE: null,
    CMU_14_VOLTAGE: null,
    CMU_15_VOLTAGE: null,
    CMU_16_VOLTAGE: null
  },
  AC: {
    SAMPLE_COILS: null,
    SAMPLE_CONTROLS: null,
    SAMPLE_METADATA: null,
    SAMPLE_STATUS: null,
    CONNECTED_CMUS: null,
    FREQUENCIES: null,
    CURRENT: null,
    PROBE_VOLTAGE: null,
    CURRENT: null,
    PROBE_VOLTAGE: null,
    CMU_1_VOLTAGE: null,
    CMU_2_VOLTAGE: null,
    CMU_3_VOLTAGE: null,
    CMU_4_VOLTAGE: null,
    CMU_5_VOLTAGE: null,
    CMU_6_VOLTAGE: null,
    CMU_7_VOLTAGE: null,
    CMU_8_VOLTAGE: null,
    CMU_9_VOLTAGE: null,
    CMU_10_VOLTAGE: null,
    CMU_11_VOLTAGE: null,
    CMU_12_VOLTAGE: null,
    CMU_13_VOLTAGE: null,
    CMU_14_VOLTAGE: null,
    CMU_15_VOLTAGE: null,
    CMU_16_VOLTAGE: null
  },
  MISC: {
    FAULTS: null,
    COILS: null,
    NEW_LIMITS: null,
    LIMITS: null,
    PROBE_SERIAL_NUMBER: null,
    MODBUS_VERSION_NUMBER: null,
    CLIENT_MESSAGE: null
  }
}

/**
 * Mutates `schema` in place, replacing null leaves with their path.
 *
 * @param {object} schema      - The schema to mutate.
 * @param {string} [prefix=""] - Internal: accumulated parent path.
 * @param {string} [delim="/"] - Delimiter between segments.
 */
function mutateSchema(schema, prefix = '', delim = '/') {
  for (const key in schema) {
    const val = schema[key]
    const path = prefix ? `${prefix}${delim}${key}` : key

    if (val !== null && typeof val === 'object') {
      // Recurse into nested object
      mutateSchema(val, path, delim)
    } else {
      // Leaf node: overwrite null with its path
      schema[key] = path
    }
  }
}

mutateSchema(schema)

export { schema as MODBUS_STATE }
