import React, { createContext, useContext, useState, useEffect } from 'react'
import io from 'socket.io-client'
import { Buffer } from 'buffer'
import { ModbusContext } from './ModbusContext'
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

  // Use modbus context
  const {
    modbusConnected,
    setModbusConnected,
    setUpdateDCSamplingRateCoil,
    setNewDCSamplingRate,
    setDcSampleTime,
    setDcVoltage,
    setDcCurrent,
    setCmuVoltages,
    setSampleModeCoil,
    setStartEISCoil,
    setInterruptCoil,
    setMinFreq,
    setMaxFreq,
    setAmp,
    setNTotalFreqs,
    setNSimulFreqs,
    setDutId,
    setTriggerId,
    setExperimentId,
    setMetadata,
    setSampleStarted,
    setSampleCompleted,
    setConnectedCmus,
    setSampleReceived,
    setSampleFailed,
    setAcSampleTime,
    setFreqs,
    setCurrMag,
    setcurrPha,
    setProbeVoltageMag,
    setProbeVoltagePha,
    setCmu1VoltageMag,
    setCmu1VoltagePha,
    setCmu2VoltageMag,
    setCmu2VoltagePha,
    setCmu3VoltageMag,
    setCmu3VoltagePha,
    setCmu4VoltageMag,
    setCmu4VoltagePha,
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
    setPowerLimit,
    setCurrentLimit,
    setDutOvervoltageLimit,
    setDutUndervoltageLimit,
    setVoltageDeviationLimit,
    setProbeSn,
    setModbusVersion,
    setClientMsg
  } = useContext(ModbusContext)

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

    // socket message handler
    socketInstance.on('1_1', (data) => {
      if (data === 'null') {
        return
      }

      const registers = new Uint16Array(data)

      setUpdateDCSamplingRateCoil(!!registers[0])
    })

    socketInstance.on('1_3', (data) => {
      if (data === 'null') {
        return
      }

      const buffer = Buffer.from(data)

      setNewDCSamplingRate(buffer.readFloatBE(0))
    })

    socketInstance.on('1_4', (data) => {
      if (data === 'null') {
        return
      }

      const buffer = Buffer.from(data)

      setDcSampleTime(buffer.readDoubleBE(0))
      setDcVoltage(buffer.readFloatBE(8))
      setDcCurrent(buffer.readFloatBE(12))

      const cmuVoltages = []
      for (let i = 0; i < 96 * 4; i++) {
        cmuVoltages.push(buffer.readFloatBE(16 + i * 4))
      }

      setCmuVoltages(cmuVoltages)
    })

    socketInstance.on('2_1', (data) => {
      if (data === 'null') {
        return
      }

      const registers = new Uint16Array(data)

      setSampleModeCoil(!!registers[0])
      setStartEISCoil(!!registers[1])
      setInterruptCoil(!!registers[2])
    })

    socketInstance.on('2_2', (data) => {
      if (data === 'null') {
        return
      }

      const registers = new Uint16Array(data)

      setSampleStarted(!!registers[0])
      setSampleCompleted(!!registers[1])
      setSampleReceived(!!registers[18])
      if (!config.legacy) {
        setSampleFailed(!!registers[19])
      }

      setConnectedCmus(Array.from(registers.slice(2, 18), (v) => Boolean(v)))
    })

    socketInstance.on('2_3', (data) => {
      if (data === 'null') {
        return
      }

      const buffer = Buffer.from(data)

      setMinFreq(buffer.readFloatBE(0))
      setMaxFreq(buffer.readFloatBE(4))
      setAmp(buffer.readFloatBE(8))
      setNTotalFreqs(buffer.readFloatBE(12))
      setNSimulFreqs(buffer.readFloatBE(16))

      if (!config.legacy) {
        const dutIdLen = buffer.readUInt16BE(200)
        if (dutIdLen > 0) {
          setDutId(buffer.subarray(202, 264).toString('utf-8').substring(0, dutIdLen))
        }

        const triggerIdLen = buffer.readUInt16BE(266)
        if (triggerIdLen > 0) {
          setTriggerId(buffer.subarray(268, 330).toString('utf-8').substring(0, triggerIdLen))
        }

        const experimentIdLen = buffer.readUInt16BE(332)
        if (experimentIdLen > 0) {
          setExperimentId(buffer.subarray(334, 396).toString('utf-8').substring(0, experimentIdLen))
        }

        const metadataLen = buffer.readUInt16BE(398)
        if (metadataLen > 0) {
          setMetadata(buffer.subarray(400, 462).toString('utf-8').substring(0, metadataLen))
        }
      }
    })

    socketInstance.on('2_4', (data) => {
      if (data === 'null') {
        return
      }

      const buffer = Buffer.from(data)

      setAcSampleTime(buffer.readDoubleBE(0))

      const freqs = []
      for (let i = 0; i < 120; i++) {
        freqs.push(buffer.readFloatBE(8 + i * 4))
      }
      setFreqs(freqs)

      const currentMags = []
      for (let i = 0; i < 120; i++) {
        currentMags.push(buffer.readFloatBE(8 + 480 + i * 4))
      }
      setCurrMag(currentMags)

      const currentPhases = []
      for (let i = 0; i < 120; i++) {
        currentPhases.push(buffer.readFloatBE(8 + 480 * 2 + i * 4))
      }
      setcurrPha(currentPhases)

      const probeVoltageMags = []
      for (let i = 0; i < 120; i++) {
        probeVoltageMags.push(buffer.readFloatBE(8 + 480 * 3 + i * 4))
      }
      setProbeVoltageMag(probeVoltageMags)

      const probeVoltagePhases = []
      for (let i = 0; i < 120; i++) {
        probeVoltagePhases.push(buffer.readFloatBE(8 + 480 * 4 + i * 4))
      }
      setProbeVoltagePha(probeVoltagePhases)

      // set cmu 1-4 data
      const cmu1VoltageMags = []
      const cmu1VoltagePhases = []
      for (let i = 0; i < 24; i++) {
        const channelVoltageMags = []
        const channelVoltagePhases = []

        for (let j = 0; j < 120; j++) {
          channelVoltageMags.push(buffer.readFloatBE(2408 + 480 * i * 2 + j * 4))
          channelVoltagePhases.push(buffer.readFloatBE(2888 + 480 * i * 2 + j * 4))
        }

        cmu1VoltageMags.push(channelVoltageMags)
        cmu1VoltagePhases.push(channelVoltagePhases)
      }
      setCmu1VoltageMag(cmu1VoltageMags)
      setCmu1VoltagePha(cmu1VoltagePhases)

      const cmu2VoltageMags = []
      const cmu2VoltagePhases = []
      for (let i = 0; i < 24; i++) {
        const channelVoltageMags = []
        const channelVoltagePhases = []

        for (let j = 0; j < 120; j++) {
          channelVoltageMags.push(buffer.readFloatBE(25448 + 480 * i * 2 + j * 4))
          channelVoltagePhases.push(buffer.readFloatBE(25928 + 480 * i * 2 + j * 4))
        }

        cmu2VoltageMags.push(channelVoltageMags)
        cmu2VoltagePhases.push(channelVoltagePhases)
      }
      setCmu2VoltageMag(cmu2VoltageMags)
      setCmu2VoltagePha(cmu2VoltagePhases)

      const cmu3VoltageMags = []
      const cmu3VoltagePhases = []
      for (let i = 0; i < 24; i++) {
        const channelVoltageMags = []
        const channelVoltagePhases = []

        for (let j = 0; j < 120; j++) {
          channelVoltageMags.push(buffer.readFloatBE(48488 + 480 * i * 2 + j * 4))
          channelVoltagePhases.push(buffer.readFloatBE(48968 + 480 * i * 2 + j * 4))
        }

        cmu3VoltageMags.push(channelVoltageMags)
        cmu3VoltagePhases.push(channelVoltagePhases)
      }
      setCmu3VoltageMag(cmu3VoltageMags)
      setCmu3VoltagePha(cmu3VoltagePhases)

      const cmu4VoltageMags = []
      const cmu4VoltagePhases = []
      for (let i = 0; i < 24; i++) {
        const channelVoltageMags = []
        const channelVoltagePhases = []

        for (let j = 0; j < 120; j++) {
          channelVoltageMags.push(buffer.readFloatBE(71528 + 480 * i * 2 + j * 4))
          channelVoltagePhases.push(buffer.readFloatBE(72008 + 480 * i * 2 + j * 4))
        }

        cmu4VoltageMags.push(channelVoltageMags)
        cmu4VoltagePhases.push(channelVoltagePhases)
      }
      setCmu4VoltageMag(cmu4VoltageMags)
      setCmu4VoltagePha(cmu4VoltagePhases)
    })

    socketInstance.on('6_2', (data) => {
      if (data === 'null') {
        return
      }

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
    })

    socketInstance.on('6_4', (data) => {
      if (data === 'null') {
        return
      }

      const buffer = Buffer.from(data)

      setPowerLimit(buffer.readFloatBE(0))
      setCurrentLimit(buffer.readFloatBE(4))
      setDutOvervoltageLimit(buffer.readFloatBE(8))
      setDutUndervoltageLimit(buffer.readFloatBE(12))
      setVoltageDeviationLimit(buffer.readFloatBE(16))

      if (!config.legacy) {
        const probeSnLen = buffer.readUInt16BE(200)
        if (probeSnLen > 0) {
          setProbeSn(buffer.subarray(202, 232).toString('utf-8').substring(0, probeSnLen))
        }

        const modbusVersionLen = buffer.readUInt16BE(234)
        if (modbusVersionLen > 0) {
          setModbusVersion(
            buffer.subarray(236, 266).toString('utf-8').substring(0, modbusVersionLen)
          )
        }

        const clientMsgLen = buffer.readUInt16BE(400)
        if (clientMsgLen > 0) {
          setClientMsg(buffer.subarray(402, 648).toString('utf-8').substring(0, clientMsgLen))
        }
      }
    })

    // Cleanup listeners when the component unmounts
    return () => {
      socketInstance.off('1_1')
      socketInstance.off('1_3')
      socketInstance.off('1_4')
      socketInstance.off('2_1')
      socketInstance.off('2_2')
      socketInstance.off('2_3')
      socketInstance.off('2_4')
      socketInstance.off('6_2')
      socketInstance.off('6_4')
      socketInstance.off('connect')
      socketInstance.disconnect()
    }
  }, [config])

  const changeConfig = (config) => {
    setConfig(config)

    axios.post('http://localhost:3000/config', config)
  }

  // Provide both the socket instance and the latest received data
  return (
    <SocketContext.Provider
      value={{
        socket,
        config,
        changeConfig
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
