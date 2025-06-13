import { useContext } from 'react'
import { ModbusContext } from '../../contexts/ModbusContext'
import { Space } from 'antd'
import { CircleCheck, CircleX } from 'lucide-react'
import { useSocket } from '../../contexts/SocketContext'
import FaultPanelView from '../subviews/FaultPanelView'

const ErrorSignalsView = () => {
  const { sampleFailed } = useContext(ModbusContext)
  const { config } = useSocket()

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      {!config.legacy && (
        <p>
          Sample Failed: {sampleFailed ? <CircleCheck color="green" /> : <CircleX color="red" />}
        </p>
      )}

      <FaultPanelView />
    </Space>
  )
}

export default ErrorSignalsView
