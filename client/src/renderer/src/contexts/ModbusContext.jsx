import { useState, createContext } from 'react'
const ModbusContext = createContext()

const ModbusProvider = ({ children }) => {
  // dc store
  const [updateDCSamplingRateCoil, setUpdateDCSamplingRateCoil] = useState(false)
  const [newDcSamplingRate, setNewDCSamplingRate] = useState(0)
  const [dcSampleTime, setDcSampleTime] = useState(0)
  const [dcVoltage, setDcVoltage] = useState(0)
  const [dcCurrent, setDcCurrent] = useState(0)
  const [cmuVoltages, setCmuVoltages] = useState([])

  // ac store 1
  const [sampleModeCoil, setSampleModeCoil] = useState(false) // false for Potentiostatic true for Galvanostatic
  const [startEISCoil, setStartEISCoil] = useState(false)
  const [interruptCoil, setInterruptCoil] = useState(false)
  const [minFreq, setMinFreq] = useState(0)
  const [maxFreq, setMaxFreq] = useState(0)
  const [amp, setAmp] = useState(0)
  const [nTotalFreqs, setNTotalFreqs] = useState(0)
  const [nSimulFreqs, setNSimulFreqs] = useState(0)
  const [dutId, setDutId] = useState('')
  const [triggerId, setTriggerId] = useState('')
  const [experimentId, setExperimentId] = useState('')
  const [metadata, setMetadata] = useState('')
  const [sampleStarted, setSampleStarted] = useState(false)
  const [sampleCompleted, setSampleCompleted] = useState(false)
  const [connectedCmus, setConnectedCmus] = useState([])
  const [sampleReceived, setSampleReceived] = useState(false)
  const [sampleFailed, setSampleFailed] = useState(false)
  const [acSampleTime, setAcSampleTime] = useState(0)
  const [freqs, setFreqs] = useState([])
  const [currMag, setCurrMag] = useState([])
  const [currPha, setcurrPha] = useState([])
  const [probeVoltageMag, setProbeVoltageMag] = useState([])
  const [probeVoltagePha, setProbeVoltagePha] = useState([])

  // ac store 1
  const [cmu1VoltageMag, setCmu1VoltageMag] = useState([])
  const [cmu2VoltageMag, setCmu2VoltageMag] = useState([])
  const [cmu3VoltageMag, setCmu3VoltageMag] = useState([])
  const [cmu4VoltageMag, setCmu4VoltageMag] = useState([])

  return (
    <ModbusContext.Provider
      value={{
        updateDCSamplingRateCoil,
        setUpdateDCSamplingRateCoil,
        newDcSamplingRate,
        setNewDCSamplingRate,
        dcSampleTime,
        setDcSampleTime,
        dcVoltage,
        setDcVoltage,
        dcCurrent,
        setDcCurrent,
        cmuVoltages,
        setCmuVoltages,
        sampleModeCoil,
        setSampleModeCoil,
        startEISCoil,
        setStartEISCoil,
        interruptCoil,
        setInterruptCoil,
        minFreq,
        setMinFreq,
        maxFreq,
        setMaxFreq,
        amp,
        setAmp,
        nTotalFreqs,
        setNTotalFreqs,
        nSimulFreqs,
        setNSimulFreqs,
        dutId,
        setDutId,
        triggerId,
        experimentId,
        setExperimentId,
        metadata,
        setMetadata,
        setTriggerId,
        sampleStarted,
        setSampleStarted,
        sampleCompleted,
        setSampleCompleted,
        connectedCmus,
        setConnectedCmus,
        sampleReceived,
        setSampleReceived,
        sampleFailed,
        setSampleFailed,
        acSampleTime,
        setAcSampleTime,
        freqs,
        setFreqs,
        currMag,
        setCurrMag,
        currPha,
        setcurrPha,
        probeVoltageMag,
        setProbeVoltageMag,
        probeVoltagePha,
        setProbeVoltagePha,
        cmu1VoltageMag,
        setCmu1VoltageMag,
        cmu2VoltageMag,
        setCmu2VoltageMag,
        cmu3VoltageMag,
        setCmu3VoltageMag,
        cmu4VoltageMag,
        setCmu4VoltageMag
      }}
    >
      {children}
    </ModbusContext.Provider>
  )
}

export { ModbusContext, ModbusProvider }
