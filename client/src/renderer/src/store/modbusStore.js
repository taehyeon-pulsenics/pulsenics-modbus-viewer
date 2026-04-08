import { create } from 'zustand'

export const useModbusStore = create((set) => ({
  // connection
  modbusConnected: false,
  setModbusConnected: (v) => set({ modbusConnected: v }),

  // dc
  dcCurrent: 0,
  setDcCurrent: (v) => set({ dcCurrent: v }),
  dcProbeVoltage: 0,
  setDcProbeVoltage: (v) => set({ dcProbeVoltage: v }),
  dcCmuVoltages: Array(16).fill([]), // index 0 = CMU 1
  setDcCmuVoltage: (index, v) =>
    set((s) => {
      const next = [...s.dcCmuVoltages]
      next[index] = v
      return { dcCmuVoltages: next }
    }),

  // ac - sample control/status
  sampleModeCoil: false,
  setSampleModeCoil: (v) => set({ sampleModeCoil: v }),
  startEISCoil: false,
  setStartEISCoil: (v) => set({ startEISCoil: v }),
  interruptCoil: false,
  setInterruptCoil: (v) => set({ interruptCoil: v }),

  sampleStarted: false,
  setSampleStarted: (v) => set({ sampleStarted: v }),
  sampleCompleted: false,
  setSampleCompleted: (v) => set({ sampleCompleted: v }),
  sampleReceived: false,
  setSampleReceived: (v) => set({ sampleReceived: v }),
  sampleFailed: false,
  setSampleFailed: (v) => set({ sampleFailed: v }),

  connectedCmus: Array(16).fill(false),
  setConnectedCmus: (v) => set({ connectedCmus: v }),

  minFreq: 0,
  setMinFreq: (v) => set({ minFreq: v }),
  maxFreq: 0,
  setMaxFreq: (v) => set({ maxFreq: v }),
  amp: 0,
  setAmp: (v) => set({ amp: v }),
  nTotalFreqs: 0,
  setNTotalFreqs: (v) => set({ nTotalFreqs: v }),
  nSimulFreqs: 0,
  setNSimulFreqs: (v) => set({ nSimulFreqs: v }),

  dutId: '',
  setDutId: (v) => set({ dutId: v }),
  triggerId: '',
  setTriggerId: (v) => set({ triggerId: v }),
  experimentId: '',
  setExperimentId: (v) => set({ experimentId: v }),
  metadata: '',
  setMetadata: (v) => set({ metadata: v }),

  // ac - signal data
  freqs: [],
  setFreqs: (v) => set({ freqs: v }),
  acCurrentMagnitude: [],
  setAcCurrentMagnitude: (v) => set({ acCurrentMagnitude: v }),
  acCurrentPhase: [],
  setAcCurrentPhase: (v) => set({ acCurrentPhase: v }),
  acProbeVoltageMagnitude: [],
  setAcProbeVoltageMagnitude: (v) => set({ acProbeVoltageMagnitude: v }),
  acProbeVoltagePhase: [],
  setAcProbeVoltagePhase: (v) => set({ acProbeVoltagePhase: v }),

  // ac cmu voltages: array of 4, each { magnitude: [][], phase: [][] }
  acCmuVoltages: Array(4).fill({ magnitude: [], phase: [] }),
  setAcCmuVoltage: (index, magnitude, phase) =>
    set((s) => {
      const next = [...s.acCmuVoltages]
      next[index] = { magnitude, phase }
      return { acCmuVoltages: next }
    }),

  // misc
  faults: {
    criticalFault: false,
    generalFault: false,
    dutOvervoltageFault: false,
    dutUndervoltageFault: false,
    transientDetected: false,
    overTemperatureDetected: false,
    gridConnectionFault: false,
    openCircultDetected: false,
    overPowerLimitDetected: false,
    overCurrentLimitDetected: false,
    eisControlError: false,
    eStopPreventingSample: false,
    dutForcedDisconnectModePreventingSample: false,
    fullDisconnectModePreventingSample: false,
    lowerPowerModePreventingSample: false,
    eisEnableSwitchOffPreventingSample: false,
    reversePolarityDetected: false,
    inputOverloadDetected: false
  },
  setFaults: (v) => set({ faults: v }),

  probeSn: '',
  setProbeSn: (v) => set({ probeSn: v }),
  modbusVersion: '',
  setModbusVersion: (v) => set({ modbusVersion: v }),
  clientMsg: '',
  setClientMsg: (v) => set({ clientMsg: v })
}))
