import { useState } from 'react'
import { Space } from 'antd'
import CollapsibleCard from '../cards/CollapsibleCard'
import { useSocket } from '../../contexts/SocketContext'
import CMUConnectionGridView from '../subviews/CMUConnectionGridView'
import BooleanList from '../lists/BooleanList'
import ProbeStatusSubview from '../subviews/ProbeStatusView'
import { useModbusStore } from '../../store/modbusStore'
import CloudOff from '../icons/CloudOff'
import Cloud from '../icons/Cloud'

const ProbeStatusView = () => {
  const sampleModeCoil = useModbusStore((s) => s.sampleModeCoil)
  const startEISCoil = useModbusStore((s) => s.startEISCoil)
  const interruptCoil = useModbusStore((s) => s.interruptCoil)
  const minFreq = useModbusStore((s) => s.minFreq)
  const maxFreq = useModbusStore((s) => s.maxFreq)
  const amp = useModbusStore((s) => s.amp)
  const nTotalFreqs = useModbusStore((s) => s.nTotalFreqs)
  const nSimulFreqs = useModbusStore((s) => s.nSimulFreqs)
  const dutId = useModbusStore((s) => s.dutId)
  const triggerId = useModbusStore((s) => s.triggerId)
  const experimentId = useModbusStore((s) => s.experimentId)
  const metadata = useModbusStore((s) => s.metadata)
  const { config } = useSocket()

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <CMUConnectionGridView render={(value) => (!!value.connected ? <Cloud /> : <CloudOff />)} />
      <CollapsibleCard size="small" title="AC Coil">
        <BooleanList
          dataSource={[
            { title: 'Start EIS', data: startEISCoil },
            { title: 'Interrupt EIS', data: interruptCoil }
          ]}
        />
      </CollapsibleCard>

      <ProbeStatusSubview />
      <CollapsibleCard size="small" title="Sampling Control">
        <p>Sample Mode: {sampleModeCoil ? 'Galvanostatic' : 'Potentiostatic'}</p>
        <p>Minimum Frequency: {minFreq} Hz</p>
        <p>Maximum Frequency: {maxFreq} Hz</p>
        <p>Amplitude: {amp} A</p>
        <p>Total Number of Frequencies: {nTotalFreqs}</p>
        <p>Number of Simultaneous Frequencies: {nSimulFreqs}</p>
      </CollapsibleCard>
      {!config.legacy && (
        <CollapsibleCard size="small" title="Metadata">
          <p>DUT ID: {dutId}</p>
          <p>Trigger ID: {triggerId}</p>
          <p>Experiment ID: {experimentId}</p>
          <p>Tag: {metadata}</p>
        </CollapsibleCard>
      )}
    </Space>
  )
}

export default ProbeStatusView
