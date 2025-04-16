import React, { createContext, useContext, useState, useEffect } from 'react'
import io from 'socket.io-client'
import { Buffer } from 'buffer'
import { ModbusContext } from './ModbusContext'

// Create a context
const SocketContext = createContext()

// Provider component that manages the socket connection and state
export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)

  // Use modbus context
  const {
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
  } = useContext(ModbusContext)

  useEffect(() => {
    // Create socket connection once on mount
    const socketInstance = io('http://localhost:3000')
    setSocket(socketInstance)

    // Log when connected
    socketInstance.on('connect', () => {
      console.log('Connected to backend WebSocket server')
    })

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
      setSampleFailed(!!registers[19])

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
    })

    // Cleanup listeners when the component unmounts
    return () => {
      socketInstance.off('1_1')
      socketInstance.off('1_3')
      socketInstance.off('1_4')
      socketInstance.off('2_1')
      socketInstance.off('2_2')
      socketInstance.off('2_3')
      socketInstance.off('connect')
      socketInstance.disconnect()
    }
  }, [])

  // Provide both the socket instance and the latest received data
  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}

// Custom hook for easy context usage
export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
