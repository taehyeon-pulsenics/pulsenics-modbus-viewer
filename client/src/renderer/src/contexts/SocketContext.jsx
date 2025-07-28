import React, { createContext, useContext, useState, useEffect } from 'react'
import io from 'socket.io-client'
import { Buffer } from 'buffer'
import {
  ConnectedCmusContext,
  FaultsContext,
  AcCurrentContext,
  DcCurrentContext,
  SampleCoilsContext,
  AcFrequencyContext,
  AcCmuVoltageContext,
  DcCmuVoltageContext,
  SampleStatusContext,
  ClientMessageContext,
  SampleControlsContext,
  AcProbeVoltageContext,
  DcProbeVoltageContext,
  SampleMetadataContext,
  ModbusConnectionContext,
  ProbeInformationContext
} from './modbus'
import { MODBUS_STATE } from '../constants/modbus'
import axios from 'axios'

// Create a context
const SocketContext = createContext()

// Provider component that manages the socket connection and state
export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [config, setConfig] = useState({
    probeIp: '192.168.0.1',
    legacy: false
  })

  // dc
  const { setDcCurrent } = useContext(DcCurrentContext)
  const { setDcProbeVoltage } = useContext(DcProbeVoltageContext)
  const {
    setDcCmu1Voltage,
    setDcCmu2Voltage,
    setDcCmu3Voltage,
    setDcCmu4Voltage,
    setDcCmu5Voltage,
    setDcCmu6Voltage,
    setDcCmu7Voltage,
    setDcCmu8Voltage,
    setDcCmu9Voltage,
    setDcCmu10Voltage,
    setDcCmu11Voltage,
    setDcCmu12Voltage,
    setDcCmu13Voltage,
    setDcCmu14Voltage,
    setDcCmu15Voltage,
    setDcCmu16Voltage
  } = useContext(DcCmuVoltageContext)

  // ac
  const { setFreqs } = useContext(AcFrequencyContext)
  const { setAcCurrentMagnitude, setAcCurrentPhase } = useContext(AcCurrentContext)
  const { setAcProbeVoltageMagnitude, setAcProbeVoltagePhase } = useContext(AcProbeVoltageContext)
  const {
    setAcCmu1VoltageMagnitude,
    setAcCmu1VoltagePhase,
    setAcCmu2VoltageMagnitude,
    setAcCmu2VoltagePhase,
    setAcCmu3VoltageMagnitude,
    setAcCmu3VoltagePhase,
    setAcCmu4VoltageMagnitude,
    setAcCmu4VoltagePhase
  } = useContext(AcCmuVoltageContext)
  const { setSampleModeCoil, setStartEISCoil, setInterruptCoil } = useContext(SampleCoilsContext)
  const { setMinFreq, setMaxFreq, setAmp, setNTotalFreqs, setNSimulFreqs } =
    useContext(SampleControlsContext)
  const { setDutId, setTriggerId, setExperimentId, setMetadata } = useContext(SampleMetadataContext)
  const { setSampleStarted, setSampleCompleted, setSampleReceived, setSampleFailed } =
    useContext(SampleStatusContext)
  const { setConnectedCmus } = useContext(ConnectedCmusContext)

  // misc
  const { setClientMsg } = useContext(ClientMessageContext)
  const {
    setCriticalFault,
    setGeneralFault,
    setDutOvervoltageFault,
    setDutUndervoltageFault,
    setTransientDetected,
    setOverTemperatureDetected,
    setGridConnectionFault,
    setOpenCircultDetected,
    setOverPowerLimitDetected,
    setOverCurrentLimitDetected,
    setEisControlError,
    setEStopPreventingSample,
    setDutForcedDisconnectModePreventingSample,
    setFullDisconnectModePreventingSample,
    setLowerPowerModePreventingSample,
    setEisEnableSwitchOffPreventingSample,
    setReversePolarityDetected,
    setInputOverloadDetected
  } = useContext(FaultsContext)
  const { setProbeSn, setModbusVersion } = useContext(ProbeInformationContext)
  const { setModbusConnected } = useContext(ModbusConnectionContext)

  /**
   * Helper function to fetch config from server
   */
  const fetchConfig = async () => {
    const { data } = await axios.get('http://localhost:3000/config')

    if (data) {
      setConfig(data)
    }
  }

  useEffect(() => {
    // fetch config
    fetchConfig()
  }, [])

  useEffect(() => {
    // Create socket connection once on mount
    const socketInstance = io('http://localhost:3000')
    setSocket(socketInstance)

    // Log when connected
    socketInstance.on('connect', () => {
      console.log('Connected to backend WebSocket server')
    })

    socketInstance.on('connection', (data) => {
      // only update state when the current state differs from received state
      setModbusConnected((v) => (v === data ? v : !v))
    })

    socketInstance.on(MODBUS_STATE.DC.CURRENT, (data) => {
      const buffer = Buffer.from(data)

      setDcCurrent(buffer.readFloatBE(0))
    })

    socketInstance.on(MODBUS_STATE.DC.PROBE_VOLTAGE, (data) => {
      const buffer = Buffer.from(data)

      setDcProbeVoltage(buffer.readFloatBE(0))
    })

    socketInstance.on(MODBUS_STATE.DC.CMU_1_VOLTAGE, (data) => {
      updateDcCmuVoltage(Buffer.from(data), setDcCmu1Voltage)
    })
    socketInstance.on(MODBUS_STATE.DC.CMU_2_VOLTAGE, (data) => {
      updateDcCmuVoltage(Buffer.from(data), setDcCmu2Voltage)
    })
    socketInstance.on(MODBUS_STATE.DC.CMU_3_VOLTAGE, (data) => {
      updateDcCmuVoltage(Buffer.from(data), setDcCmu3Voltage)
    })
    socketInstance.on(MODBUS_STATE.DC.CMU_4_VOLTAGE, (data) => {
      updateDcCmuVoltage(Buffer.from(data), setDcCmu4Voltage)
    })
    socketInstance.on(MODBUS_STATE.DC.CMU_5_VOLTAGE, (data) => {
      updateDcCmuVoltage(Buffer.from(data), setDcCmu5Voltage)
    })
    socketInstance.on(MODBUS_STATE.DC.CMU_6_VOLTAGE, (data) => {
      updateDcCmuVoltage(Buffer.from(data), setDcCmu6Voltage)
    })
    socketInstance.on(MODBUS_STATE.DC.CMU_7_VOLTAGE, (data) => {
      updateDcCmuVoltage(Buffer.from(data), setDcCmu7Voltage)
    })
    socketInstance.on(MODBUS_STATE.DC.CMU_8_VOLTAGE, (data) => {
      updateDcCmuVoltage(Buffer.from(data), setDcCmu8Voltage)
    })
    socketInstance.on(MODBUS_STATE.DC.CMU_9_VOLTAGE, (data) => {
      updateDcCmuVoltage(Buffer.from(data), setDcCmu9Voltage)
    })
    socketInstance.on(MODBUS_STATE.DC.CMU_10_VOLTAGE, (data) => {
      updateDcCmuVoltage(Buffer.from(data), setDcCmu10Voltage)
    })
    socketInstance.on(MODBUS_STATE.DC.CMU_11_VOLTAGE, (data) => {
      updateDcCmuVoltage(Buffer.from(data), setDcCmu11Voltage)
    })
    socketInstance.on(MODBUS_STATE.DC.CMU_12_VOLTAGE, (data) => {
      updateDcCmuVoltage(Buffer.from(data), setDcCmu12Voltage)
    })
    socketInstance.on(MODBUS_STATE.DC.CMU_13_VOLTAGE, (data) => {
      updateDcCmuVoltage(Buffer.from(data), setDcCmu13Voltage)
    })
    socketInstance.on(MODBUS_STATE.DC.CMU_14_VOLTAGE, (data) => {
      updateDcCmuVoltage(Buffer.from(data), setDcCmu14Voltage)
    })
    socketInstance.on(MODBUS_STATE.DC.CMU_15_VOLTAGE, (data) => {
      updateDcCmuVoltage(Buffer.from(data), setDcCmu15Voltage)
    })
    socketInstance.on(MODBUS_STATE.DC.CMU_16_VOLTAGE, (data) => {
      updateDcCmuVoltage(Buffer.from(data), setDcCmu16Voltage)
    })

    socketInstance.on(MODBUS_STATE.AC.SAMPLE_COILS, (data) => {
      const registers = new Uint16Array(data)

      setSampleModeCoil(!!registers[0])
      setStartEISCoil(!!registers[1])
      setInterruptCoil(!!registers[2])
    })

    socketInstance.on(MODBUS_STATE.AC.SAMPLE_STATUS, (data) => {
      const registers = new Uint16Array(data)

      setSampleStarted(!!registers[0])
      setSampleCompleted(!!registers[1])
      setSampleReceived(!!registers[2])
      if (!config.legacy) {
        setSampleFailed(!!registers[3])
      }
    })

    socketInstance.on(MODBUS_STATE.AC.CONNECTED_CMUS, (data) => {
      const registers = new Uint16Array(data)

      setConnectedCmus(Array.from(registers, (v) => Boolean(v)))
    })

    socketInstance.on(MODBUS_STATE.AC.SAMPLE_CONTROLS, (data) => {
      const buffer = Buffer.from(data)

      setMinFreq(buffer.readFloatBE(0))
      setMaxFreq(buffer.readFloatBE(4))
      setAmp(buffer.readFloatBE(8))
      setNTotalFreqs(buffer.readFloatBE(12))
      setNSimulFreqs(buffer.readFloatBE(16))
    })

    socketInstance.on(MODBUS_STATE.AC.SAMPLE_METADATA, (data) => {
      const buffer = Buffer.from(data)

      if (!config.legacy) {
        const dutIdLen = buffer.readUInt16BE(0)
        if (dutIdLen > 0) {
          setDutId(buffer.subarray(2, 66).toString('utf-8').substring(0, dutIdLen))
        } else {
          setDutId('')
        }

        const triggerIdLen = buffer.readUInt16BE(66)
        if (triggerIdLen > 0) {
          setTriggerId(buffer.subarray(68, 132).toString('utf-8').substring(0, triggerIdLen))
        }

        const experimentIdLen = buffer.readUInt16BE(132)
        if (experimentIdLen > 0) {
          setExperimentId(buffer.subarray(134, 198).toString('utf-8').substring(0, experimentIdLen))
        }

        const metadataLen = buffer.readUInt16BE(198)
        if (metadataLen > 0) {
          setMetadata(buffer.subarray(200, 264).toString('utf-8').substring(0, metadataLen))
        }
      }
    })

    socketInstance.on(MODBUS_STATE.AC.FREQUENCIES, (data) => {
      const buffer = Buffer.from(data)

      const freqs = []
      for (let i = 0; i < 120; i++) {
        freqs.push(buffer.readFloatBE(i * 4))
      }
      setFreqs(freqs)
    })

    socketInstance.on(MODBUS_STATE.AC.CURRENT, (data) => {
      updateAcProbeMagnitudesAndPhases(Buffer.from(data), setAcCurrentMagnitude, setAcCurrentPhase)
    })

    socketInstance.on(MODBUS_STATE.AC.PROBE_VOLTAGE, (data) => {
      updateAcProbeMagnitudesAndPhases(
        Buffer.from(data),
        setAcProbeVoltageMagnitude,
        setAcProbeVoltagePhase
      )
    })

    socketInstance.on(MODBUS_STATE.AC.CMU_1_VOLTAGE, (data) => {
      updateAcCmuMagnitudesAndPhases(
        Buffer.from(data),
        setAcCmu1VoltageMagnitude,
        setAcCmu1VoltagePhase
      )
    })

    socketInstance.on(MODBUS_STATE.AC.CMU_2_VOLTAGE, (data) => {
      updateAcCmuMagnitudesAndPhases(
        Buffer.from(data),
        setAcCmu2VoltageMagnitude,
        setAcCmu2VoltagePhase
      )
    })

    socketInstance.on(MODBUS_STATE.AC.CMU_3_VOLTAGE, (data) => {
      updateAcCmuMagnitudesAndPhases(
        Buffer.from(data),
        setAcCmu3VoltageMagnitude,
        setAcCmu3VoltagePhase
      )
    })

    socketInstance.on(MODBUS_STATE.AC.CMU_4_VOLTAGE, (data) => {
      updateAcCmuMagnitudesAndPhases(
        Buffer.from(data),
        setAcCmu4VoltageMagnitude,
        setAcCmu4VoltagePhase
      )
    })

    socketInstance.on(MODBUS_STATE.MISC.FAULTS, (data) => {
      const registers = new Uint16Array(data)

      setCriticalFault(!!registers[0])
      setGeneralFault(!!registers[1])
      setDutOvervoltageFault(!!registers[2])
      setDutUndervoltageFault(!!registers[3])
      setTransientDetected(!!registers[4])
      setOverTemperatureDetected(!!registers[5])
      setGridConnectionFault(!!registers[6])
      setOpenCircultDetected(!!registers[7])
      setOverPowerLimitDetected(!!registers[8])
      setOverCurrentLimitDetected(!!registers[9])
      setEisControlError(!!registers[10])
      setEStopPreventingSample(!!registers[11])
      setDutForcedDisconnectModePreventingSample(!!registers[12])
      setFullDisconnectModePreventingSample(!!registers[13])
      setLowerPowerModePreventingSample(!!registers[14])
      setEisEnableSwitchOffPreventingSample(!!registers[15])
      setReversePolarityDetected(!!registers[16])
      setInputOverloadDetected(!!registers[17])
    })

    socketInstance.on(MODBUS_STATE.MISC.PROBE_SERIAL_NUMBER, (data) => {
      const buffer = Buffer.from(data)

      if (!config.legacy) {
        const probeSnLen = buffer.readUInt16BE(0)
        if (probeSnLen > 0) {
          setProbeSn(buffer.subarray(2, 34).toString('utf-8').substring(0, probeSnLen))
        }
      }
    })

    socketInstance.on(MODBUS_STATE.MISC.MODBUS_VERSION_NUMBER, (data) => {
      const buffer = Buffer.from(data)

      if (!config.legacy) {
        const modbusVersionLen = buffer.readUInt16BE(0)
        if (modbusVersionLen > 0) {
          setModbusVersion(buffer.subarray(2, 34).toString('utf-8').substring(0, modbusVersionLen))
        }
      }
    })

    socketInstance.on(MODBUS_STATE.MISC.CLIENT_MESSAGE, (data) => {
      const buffer = Buffer.from(data)

      if (!config.legacy) {
        const clientMsgLen = buffer.readUInt16BE(0)
        if (clientMsgLen > 0) {
          setClientMsg(buffer.subarray(2, 250).toString('utf-8').substring(0, clientMsgLen))
        }
      }
    })

    // Cleanup listeners when the component unmounts
    return () => {
      socketInstance.off(MODBUS_STATE.DC.CURRENT)
      socketInstance.off(MODBUS_STATE.DC.PROBE_VOLTAGE)
      socketInstance.off(MODBUS_STATE.DC.CMU_1_VOLTAGE)
      socketInstance.off(MODBUS_STATE.DC.CMU_2_VOLTAGE)
      socketInstance.off(MODBUS_STATE.DC.CMU_3_VOLTAGE)
      socketInstance.off(MODBUS_STATE.DC.CMU_4_VOLTAGE)
      socketInstance.off(MODBUS_STATE.DC.CMU_5_VOLTAGE)
      socketInstance.off(MODBUS_STATE.DC.CMU_6_VOLTAGE)
      socketInstance.off(MODBUS_STATE.DC.CMU_7_VOLTAGE)
      socketInstance.off(MODBUS_STATE.DC.CMU_8_VOLTAGE)
      socketInstance.off(MODBUS_STATE.DC.CMU_9_VOLTAGE)
      socketInstance.off(MODBUS_STATE.DC.CMU_10_VOLTAGE)
      socketInstance.off(MODBUS_STATE.DC.CMU_11_VOLTAGE)
      socketInstance.off(MODBUS_STATE.DC.CMU_12_VOLTAGE)
      socketInstance.off(MODBUS_STATE.DC.CMU_13_VOLTAGE)
      socketInstance.off(MODBUS_STATE.DC.CMU_14_VOLTAGE)
      socketInstance.off(MODBUS_STATE.DC.CMU_15_VOLTAGE)
      socketInstance.off(MODBUS_STATE.DC.CMU_16_VOLTAGE)

      socketInstance.off(MODBUS_STATE.AC.SAMPLE_COILS)
      socketInstance.off(MODBUS_STATE.AC.SAMPLE_CONTROLS)
      socketInstance.off(MODBUS_STATE.AC.SAMPLE_METADATA)
      socketInstance.off(MODBUS_STATE.AC.SAMPLE_STATUS)
      socketInstance.off(MODBUS_STATE.AC.CONNECTED_CMUS)
      socketInstance.off(MODBUS_STATE.AC.FREQUENCIES)
      socketInstance.off(MODBUS_STATE.AC.CURRENT)
      socketInstance.off(MODBUS_STATE.AC.PROBE_VOLTAGE)
      socketInstance.off(MODBUS_STATE.AC.CMU_1_VOLTAGE)
      socketInstance.off(MODBUS_STATE.AC.CMU_2_VOLTAGE)
      socketInstance.off(MODBUS_STATE.AC.CMU_3_VOLTAGE)
      socketInstance.off(MODBUS_STATE.AC.CMU_4_VOLTAGE)

      socketInstance.off(MODBUS_STATE.MISC.FAULTS)
      socketInstance.off(MODBUS_STATE.MISC.PROBE_SERIAL_NUMBER)
      socketInstance.off(MODBUS_STATE.MISC.MODBUS_VERSION_NUMBER)
      socketInstance.off(MODBUS_STATE.MISC.CLIENT_MESSAGE)
      socketInstance.off('connect')
      socketInstance.disconnect()
    }
  }, [config])

  const changeConfig = (config) => {
    setConfig(config)

    axios.post('http://localhost:3000/config', config)
  }

  const triggerDataBroadcast = () => {
    axios.post('http://localhost:3000/modbus-data')
  }

  // Provide both the socket instance and the latest received data
  return (
    <SocketContext.Provider
      value={{
        socket,
        config,
        changeConfig,
        triggerDataBroadcast
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

// Custom hook for easy context usage
export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

/**
 *
 * @param {Buffer} buffer
 * @param {React.Dispatch<React.SetStateAction<number[]>>} dispatch
 */
function updateDcCmuVoltage(buffer, dispatch) {
  const cmuVoltages = []
  for (let i = 0; i < 24; i++) {
    cmuVoltages.push(buffer.readFloatBE(i * 4))
  }
  dispatch(cmuVoltages)
}

/**
 *
 * @param {Buffer} buffer
 * @param {React.Dispatch<React.SetStateAction<number[]>>} dispatchSetMagnitudes
 * @param {React.Dispatch<React.SetStateAction<number[]>>} dispatchSetPhases
 */
function updateAcProbeMagnitudesAndPhases(buffer, dispatchSetMagnitudes, dispatchSetPhases) {
  const mags = []
  for (let i = 0; i < 120; i++) {
    mags.push(buffer.readFloatBE(i * 4))
  }
  dispatchSetMagnitudes(mags)

  const phases = []
  for (let i = 0; i < 120; i++) {
    phases.push(buffer.readFloatBE(120 * 4 + i * 4))
  }
  dispatchSetPhases(phases)
}

/**
 *
 * @param {Buffer} buffer
 * @param {React.Dispatch<React.SetStateAction<number[]>>} dispatchSetMagnitudes
 * @param {React.Dispatch<React.SetStateAction<number[]>>} dispatchSetPhases
 */
function updateAcCmuMagnitudesAndPhases(buffer, dispatchSetMagnitudes, dispatchSetPhases) {
  const mags = []
  const phases = []

  for (let i = 0; i < 24; i++) {
    const channelMags = []
    const channelPhases = []

    for (let j = 0; j < 120; j++) {
      channelMags.push(buffer.readFloatBE(480 * i * 2 + j * 4))
      channelPhases.push(buffer.readFloatBE(480 * (i * 2 + 1) + j * 4))
    }

    mags.push(channelMags)
    phases.push(channelPhases)
  }

  dispatchSetMagnitudes(mags)
  dispatchSetPhases(phases)
}
