import { useContext } from 'react'
import { Space } from 'antd'
import { useSocket } from '../../contexts/SocketContext'
import FaultPanelView from '../subviews/FaultPanelView'
import BooleanList from '../lists/BooleanList'
import { SampleStatusContext } from '../../contexts/modbus'

const ErrorSignalsView = () => {
  const { sampleFailed } = useContext(SampleStatusContext)
  const { config } = useSocket()

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      {!config.legacy && (
        <BooleanList dataSource={[{ title: 'Sample Failed', data: sampleFailed }]} />
      )}

      <FaultPanelView />
    </Space>
  )
}

export default ErrorSignalsView
