import { useContext } from 'react'
import { ModbusContext } from '../../contexts/ModbusContext'
import { CircleCheck, CircleX, Cloud, CloudOff } from 'lucide-react'
import { Space, Table } from 'antd'
import CollapsibleCard from '../cards/CollapsibleCard'
import { useSocket } from '../../contexts/SocketContext'
import CMUTable from '../tables/CMUTable'

const ProbeStatusView = () => {
  const {
    updateDCSamplingRateCoil,
    newDcSamplingRate,
    sampleModeCoil,
    startEISCoil,
    interruptCoil,
    sampleStarted,
    sampleCompleted,
    connectedCmus,
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
      <CMUTable
        connectedCmus={connectedCmus}
        render={(value) =>
          !!value.connected ? (
            <Cloud style={{ color: 'green', fontSize: '16px' }} />
          ) : (
            <CloudOff style={{ color: 'red', fontSize: '16px' }} />
          )
        }
      />
      <CollapsibleCard size="small" title="DC Coil">
        <p>
          Update DC Sample Rate:{' '}
          {updateDCSamplingRateCoil ? <CircleCheck color="green" /> : <CircleX color="red" />}
        </p>
      </CollapsibleCard>
      <CollapsibleCard size="small" title="DC Sampling Rate">
        {newDcSamplingRate} /s
      </CollapsibleCard>
      <CollapsibleCard size="small" title="AC Coil">
        <p>Sample Mode: {sampleModeCoil ? 'Galvanostatic' : 'Potentiostatic'}</p>
        <p>Start EIS: {startEISCoil ? <CircleCheck color="green" /> : <CircleX color="red" />}</p>
        <p>
          Interrupt EIS: {interruptCoil ? <CircleCheck color="green" /> : <CircleX color="red" />}
        </p>
      </CollapsibleCard>

      <CollapsibleCard size="small" title="Probe Status">
        <p>
          Sample Started: {sampleStarted ? <CircleCheck color="green" /> : <CircleX color="red" />}
        </p>
        <p>
          Sample Completed:{' '}
          {sampleCompleted ? <CircleCheck color="green" /> : <CircleX color="red" />}
        </p>
        <p>
          Sample Received:{' '}
          {sampleReceived ? <CircleCheck color="green" /> : <CircleX color="red" />}
        </p>
        {!config.legacy && (
          <p>
            Sample Failed: {sampleFailed ? <CircleCheck color="green" /> : <CircleX color="red" />}
          </p>
        )}
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Sampling Control">
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
