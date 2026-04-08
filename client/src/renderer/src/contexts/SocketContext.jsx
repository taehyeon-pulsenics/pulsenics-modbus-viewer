import React, { createContext, useContext, useState, useEffect } from 'react'
import io from 'socket.io-client'
import { Buffer } from 'buffer'
import { MODBUS_STATE } from '../constants/modbus'
import { useModbusStore } from '../store/modbusStore'
import axios from 'axios'

const SocketContext = createContext()

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [config, setConfig] = useState({ probeIp: '192.168.0.1', legacy: false })

  const {
    setModbusConnected,
    setDcCurrent,
    setDcProbeVoltage,
    setDcCmuVoltage,
    setSampleModeCoil,
    setStartEISCoil,
    setInterruptCoil,
    setSampleStarted,
    setSampleCompleted,
    setSampleReceived,
    setSampleFailed,
    setConnectedCmus,
    setMinFreq,
    setMaxFreq,
    setAmp,
    setNTotalFreqs,
    setNSimulFreqs,
    setDutId,
    setTriggerId,
    setExperimentId,
    setMetadata,
    setFreqs,
    setAcCurrentMagnitude,
    setAcCurrentPhase,
    setAcProbeVoltageMagnitude,
    setAcProbeVoltagePhase,
    setAcCmuVoltage,
    setFaults,
    setProbeSn,
    setModbusVersion,
    setClientMsg
  } = useModbusStore()

  const fetchConfig = async () => {
    const { data } = await axios.get('http://localhost:3000/config')
    if (data) setConfig(data)
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  useEffect(() => {
    const s = io('http://localhost:3000')
    setSocket(s)

    s.on('connect', () => console.log('Connected to backend WebSocket server'))

    s.on('connection', (data) => setModbusConnected(data))

    s.on(MODBUS_STATE.DC.CURRENT, (data) => {
      setDcCurrent(Buffer.from(data).readFloatBE(0))
    })

    s.on(MODBUS_STATE.DC.PROBE_VOLTAGE, (data) => {
      setDcProbeVoltage(Buffer.from(data).readFloatBE(0))
    })

    // DC CMU voltages — one handler per CMU, writes into array by index
    for (let i = 0; i < 16; i++) {
      const idx = i
      const key = MODBUS_STATE.DC[`CMU_${idx + 1}_VOLTAGE`]
      s.on(key, (data) => setDcCmuVoltage(idx, parseDcCmuVoltage(Buffer.from(data))))
    }

    s.on(MODBUS_STATE.AC.SAMPLE_COILS, (data) => {
      const r = new Uint16Array(data)
      setSampleModeCoil(!!r[0])
      setStartEISCoil(!!r[1])
      setInterruptCoil(!!r[2])
    })

    s.on(MODBUS_STATE.AC.SAMPLE_STATUS, (data) => {
      const r = new Uint16Array(data)
      setSampleStarted(!!r[0])
      setSampleCompleted(!!r[1])
      setSampleReceived(!!r[2])
      if (!config.legacy) setSampleFailed(!!r[3])
    })

    s.on(MODBUS_STATE.AC.CONNECTED_CMUS, (data) => {
      setConnectedCmus(Array.from(new Uint16Array(data), (v) => Boolean(v)))
    })

    s.on(MODBUS_STATE.AC.SAMPLE_CONTROLS, (data) => {
      const buf = Buffer.from(data)
      setMinFreq(buf.readFloatBE(0))
      setMaxFreq(buf.readFloatBE(4))
      setAmp(buf.readFloatBE(8))
      setNTotalFreqs(buf.readFloatBE(12))
      setNSimulFreqs(buf.readFloatBE(16))
    })

    s.on(MODBUS_STATE.AC.SAMPLE_METADATA, (data) => {
      if (config.legacy) return
      const buf = Buffer.from(data)
      const dutIdLen = buf.readUInt16BE(0)
      setDutId(dutIdLen > 0 ? buf.subarray(2, 66).toString('utf-8').substring(0, dutIdLen) : '')
      const triggerIdLen = buf.readUInt16BE(66)
      if (triggerIdLen > 0)
        setTriggerId(buf.subarray(68, 132).toString('utf-8').substring(0, triggerIdLen))
      const experimentIdLen = buf.readUInt16BE(132)
      if (experimentIdLen > 0)
        setExperimentId(buf.subarray(134, 198).toString('utf-8').substring(0, experimentIdLen))
      const metadataLen = buf.readUInt16BE(198)
      if (metadataLen > 0)
        setMetadata(buf.subarray(200, 264).toString('utf-8').substring(0, metadataLen))
    })

    s.on(MODBUS_STATE.AC.FREQUENCIES, (data) => {
      const buf = Buffer.from(data)
      const freqs = []
      for (let i = 0; i < 120; i++) freqs.push(buf.readFloatBE(i * 4))
      setFreqs(freqs)
    })

    s.on(MODBUS_STATE.AC.CURRENT, (data) => {
      const [mags, phases] = parseAcProbe(Buffer.from(data))
      setAcCurrentMagnitude(mags)
      setAcCurrentPhase(phases)
    })

    s.on(MODBUS_STATE.AC.PROBE_VOLTAGE, (data) => {
      const [mags, phases] = parseAcProbe(Buffer.from(data))
      setAcProbeVoltageMagnitude(mags)
      setAcProbeVoltagePhase(phases)
    })

    // AC CMU voltages — CMU 1-4
    for (let i = 0; i < 4; i++) {
      const idx = i
      const key = MODBUS_STATE.AC[`CMU_${idx + 1}_VOLTAGE`]
      s.on(key, (data) => {
        const [mags, phases] = parseAcCmu(Buffer.from(data))
        setAcCmuVoltage(idx, mags, phases)
      })
    }

    s.on(MODBUS_STATE.MISC.FAULTS, (data) => {
      const r = new Uint16Array(data)
      setFaults({
        criticalFault: !!r[0],
        generalFault: !!r[1],
        dutOvervoltageFault: !!r[2],
        dutUndervoltageFault: !!r[3],
        transientDetected: !!r[4],
        overTemperatureDetected: !!r[5],
        gridConnectionFault: !!r[6],
        openCircultDetected: !!r[7],
        overPowerLimitDetected: !!r[8],
        overCurrentLimitDetected: !!r[9],
        eisControlError: !!r[10],
        eStopPreventingSample: !!r[11],
        dutForcedDisconnectModePreventingSample: !!r[12],
        fullDisconnectModePreventingSample: !!r[13],
        lowerPowerModePreventingSample: !!r[14],
        eisEnableSwitchOffPreventingSample: !!r[15],
        reversePolarityDetected: !!r[16],
        inputOverloadDetected: !!r[17]
      })
    })

    s.on(MODBUS_STATE.MISC.PROBE_SERIAL_NUMBER, (data) => {
      if (config.legacy) return
      const buf = Buffer.from(data)
      const len = buf.readUInt16BE(0)
      if (len > 0) setProbeSn(buf.subarray(2, 34).toString('utf-8').substring(0, len))
    })

    s.on(MODBUS_STATE.MISC.MODBUS_VERSION_NUMBER, (data) => {
      if (config.legacy) return
      const buf = Buffer.from(data)
      const len = buf.readUInt16BE(0)
      if (len > 0) setModbusVersion(buf.subarray(2, 34).toString('utf-8').substring(0, len))
    })

    s.on(MODBUS_STATE.MISC.CLIENT_MESSAGE, (data) => {
      if (config.legacy) return
      const buf = Buffer.from(data)
      const len = buf.readUInt16BE(0)
      if (len > 0) setClientMsg(buf.subarray(2, 250).toString('utf-8').substring(0, len))
    })

    return () => {
      s.removeAllListeners()
      s.disconnect()
    }
  }, [config])

  const changeConfig = (cfg) => {
    setConfig(cfg)
    axios.post('http://localhost:3000/config', cfg)
  }

  const triggerDataBroadcast = () => {
    axios.post('http://localhost:3000/modbus-data')
  }

  return (
    <SocketContext.Provider value={{ socket, config, changeConfig, triggerDataBroadcast }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) throw new Error('useSocket must be used within a SocketProvider')
  return context
}

// --- parse helpers ---

function parseDcCmuVoltage(buffer) {
  const voltages = []
  for (let i = 0; i < 24; i++) voltages.push(buffer.readFloatBE(i * 4))
  return voltages
}

function parseAcProbe(buffer) {
  const mags = [],
    phases = []
  for (let i = 0; i < 120; i++) mags.push(buffer.readFloatBE(i * 4))
  for (let i = 0; i < 120; i++) phases.push(buffer.readFloatBE(120 * 4 + i * 4))
  return [mags, phases]
}

function parseAcCmu(buffer) {
  const mags = [],
    phases = []
  for (let i = 0; i < 24; i++) {
    const channelMags = [],
      channelPhases = []
    for (let j = 0; j < 120; j++) {
      channelMags.push(buffer.readFloatBE(480 * i * 2 + j * 4))
      channelPhases.push(buffer.readFloatBE(480 * (i * 2 + 1) + j * 4))
    }
    mags.push(channelMags)
    phases.push(channelPhases)
  }
  return [mags, phases]
}
