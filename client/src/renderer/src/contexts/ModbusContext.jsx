import { useState, createContext } from 'react'
const ModbusContext = createContext()

const ModbusProvider = ({ children }) => {
  // modbus connection
  const [modbusConnected, setModbusConnected] = useState(false)

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
  const [connectedCmus, setConnectedCmus] = useState(Array(16).fill(false))
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
  const [cmu1VoltagePha, setCmu1VoltagePha] = useState([])
  const [cmu2VoltageMag, setCmu2VoltageMag] = useState([])
  const [cmu2VoltagePha, setCmu2VoltagePha] = useState([])
  const [cmu3VoltageMag, setCmu3VoltageMag] = useState([])
  const [cmu3VoltagePha, setCmu3VoltagePha] = useState([])
  const [cmu4VoltageMag, setCmu4VoltageMag] = useState([])
  const [cmu4VoltagePha, setCmu4VoltagePha] = useState([])

  // error signals
  const [criticalFault, setCriticalFault] = useState(false)
  const [generalFault, setGeneralFault] = useState(false)
  const [dutOvervoltageFault, setDutOvervoltageFault] = useState(false)
  const [dutUndervoltageFault, setDutUndervoltageFault] = useState(false)
  const [transientDetected, setTransientDetected] = useState(false)
  const [overTemperatureDetected, setOverTemperatureDetected] = useState(false)
  const [gridConnectionFault, setGridConnectionFault] = useState(false)
  const [openCircultDetected, setOpenCircultDetected] = useState(false)
  const [overPowerLimitDetected, setOverPowerLimitDetected] = useState(false)
  const [overCurrentLimitDetected, setOverCurrentLimitDetected] = useState(false)
  const [eisControlError, setEisControlError] = useState(false)
  const [eStopPreventingSample, setEStopPreventingSample] = useState(false)
  const [dutForcedDisconnectModePreventingSample, setDutForcedDisconnectModePreventingSample] =
    useState(false)
  const [fullDisconnectModePreventingSample, setFullDisconnectModePreventingSample] =
    useState(false)
  const [lowerPowerModePreventingSample, setLowerPowerModePreventingSample] = useState(false)

  // misc (non-sampling store)
  const [powerLimit, setPowerLimit] = useState(0)
  const [currentLimit, setCurrentLimit] = useState(0)
  const [dutOvervoltageLimit, setDutOvervoltageLimit] = useState(0)
  const [dutUndervoltageLimit, setDutUndervoltageLimit] = useState(0)
  const [voltageDeviationLimit, setVoltageDeviationLimit] = useState(0)
  const [probeSn, setProbeSn] = useState('')
  const [clientMsg, setClientMsg] = useState('')

  return (
    <ModbusContext.Provider
      value={{
        modbusConnected,
        setModbusConnected,
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
        cmu1VoltagePha,
        setCmu1VoltagePha,
        cmu2VoltageMag,
        setCmu2VoltageMag,
        cmu2VoltagePha,
        setCmu2VoltagePha,
        cmu3VoltageMag,
        setCmu3VoltageMag,
        cmu3VoltagePha,
        setCmu3VoltagePha,
        cmu4VoltageMag,
        setCmu4VoltageMag,
        cmu4VoltagePha,
        setCmu4VoltagePha,
        criticalFault,
        setCriticalFault,
        generalFault,
        setGeneralFault,
        dutOvervoltageFault,
        setDutOvervoltageFault,
        dutUndervoltageFault,
        setDutUndervoltageFault,
        transientDetected,
        setTransientDetected,
        overTemperatureDetected,
        setOverTemperatureDetected,
        gridConnectionFault,
        setGridConnectionFault,
        openCircultDetected,
        setOpenCircultDetected,
        overPowerLimitDetected,
        setOverPowerLimitDetected,
        overCurrentLimitDetected,
        setOverCurrentLimitDetected,
        eisControlError,
        setEisControlError,
        eStopPreventingSample,
        setEStopPreventingSample,
        dutForcedDisconnectModePreventingSample,
        setDutForcedDisconnectModePreventingSample,
        fullDisconnectModePreventingSample,
        setFullDisconnectModePreventingSample,
        lowerPowerModePreventingSample,
        setLowerPowerModePreventingSample,
        powerLimit,
        setPowerLimit,
        currentLimit,
        setCurrentLimit,
        dutOvervoltageLimit,
        setDutOvervoltageLimit,
        dutUndervoltageLimit,
        setDutUndervoltageLimit,
        voltageDeviationLimit,
        setVoltageDeviationLimit,
        probeSn,
        setProbeSn,
        clientMsg,
        setClientMsg
      }}
    >
      {children}
    </ModbusContext.Provider>
  )
}

export { ModbusContext, ModbusProvider }
