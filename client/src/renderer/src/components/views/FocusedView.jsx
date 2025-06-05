import { useContext } from 'react'
import { ModbusContext } from '../../contexts/ModbusContext'
import { useSocket } from '../../contexts/SocketContext'
import { Space } from 'antd'
import CollapsibleCard from '../cards/CollapsibleCard'
import CMUTable from '../tables/CMUTable'
import { CircleCheck, CircleX, Cloud, CloudOff } from 'lucide-react'

const FocusedView = () => {
  const {
    connectedCmus,
    sampleStarted,
    sampleCompleted,
    sampleReceived,
    sampleFailed,
    probeSn,
    clientMsg
  } = useContext(ModbusContext)
  const { config } = useSocket()

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      {!config.legacy && <p>Probe Serial Number: {probeSn}</p>}
      {!config.legacy && (
        <CollapsibleCard size="small" title="Latest Client Message">
          {clientMsg}
        </CollapsibleCard>
      )}
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
    </Space>
  )
}

export default FocusedView
