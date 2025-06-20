import { useContext } from 'react'
import { ModbusContext } from '../../contexts/ModbusContext'
import { CircleCheck, CircleX, Cloud, CloudOff } from 'lucide-react'
import { List, Space, Table, Typography } from 'antd'
import CollapsibleCard from '../cards/CollapsibleCard'
import { useSocket } from '../../contexts/SocketContext'
import CMUConnectionGridView from '../subviews/CMUConnectionGridView'
import BooleanList from '../lists/BooleanList'
import ProbeStatusSubview from '../subviews/ProbeStatusView'

const ProbeStatusView = () => {
  const {
    updateDCSamplingRateCoil,
    newDcSamplingRate,
    sampleModeCoil,
    startEISCoil,
    interruptCoil,
    sampleStarted,
    sampleCompleted,
    sampleReceived,
    sampleFailed,
    minFreq,
    maxFreq,
    amp,
    nTotalFreqs,
    nSimulFreqs,
    dutId,
    triggerId,
    experimentId,
    metadata
  } = useContext(ModbusContext)
  const { config } = useSocket()

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <CMUConnectionGridView
        render={(value) =>
          !!value.connected ? (
            <Cloud style={{ color: 'green', fontSize: '16px' }} />
          ) : (
            <CloudOff style={{ color: 'red', fontSize: '16px' }} />
          )
        }
      />
      <CollapsibleCard size="small" title="DC Coil">
        <BooleanList
          dataSource={[{ title: 'Update DC Sample Rate', data: updateDCSamplingRateCoil }]}
        />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="DC Sampling Rate">
        {newDcSamplingRate} /s
      </CollapsibleCard>
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
