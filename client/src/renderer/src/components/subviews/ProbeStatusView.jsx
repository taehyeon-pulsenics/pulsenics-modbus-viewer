import { useModbusStore } from '../../store/modbusStore'
import { useSocket } from '../../contexts/SocketContext'
import CollapsibleCard from '../cards/CollapsibleCard'
import BooleanList from '../lists/BooleanList'

const ProbeStatusView = () => {
  const sampleStarted = useModbusStore((s) => s.sampleStarted)
  const sampleCompleted = useModbusStore((s) => s.sampleCompleted)
  const sampleReceived = useModbusStore((s) => s.sampleReceived)
  const sampleFailed = useModbusStore((s) => s.sampleFailed)
  const { config } = useSocket()

  return (
    <CollapsibleCard size="small" title="Probe Status">
      <BooleanList
        dataSource={[
          { title: 'Sample Started', data: sampleStarted },
          { title: 'Sample Completed', data: sampleCompleted },
          { title: 'Sample Received', data: sampleReceived }
        ]}
      />
      {!config.legacy && (
        <BooleanList dataSource={[{ title: 'Sample Failed', data: sampleFailed }]} />
      )}
    </CollapsibleCard>
  )
}

export default ProbeStatusView
