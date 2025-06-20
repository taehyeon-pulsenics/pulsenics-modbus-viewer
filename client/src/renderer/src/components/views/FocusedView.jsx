import { useContext } from 'react'
import { ModbusContext } from '../../contexts/ModbusContext'
import { useSocket } from '../../contexts/SocketContext'
import { Col, Row, Space, Typography } from 'antd'
import CollapsibleCard from '../cards/CollapsibleCard'
import FaultPanelView from '../subviews/FaultPanelView'
import { CircleCheck, CircleX, Cloud, CloudOff } from 'lucide-react'
import CMUConnectionGridView from '../subviews/CMUConnectionGridView'
import ProbeStatusView from '../subviews/ProbeStatusView'

const FocusedView = () => {
  const {
    sampleStarted,
    sampleCompleted,
    sampleReceived,
    sampleFailed,
    probeSn,
    modbusVersion,
    clientMsg
  } = useContext(ModbusContext)
  const { config } = useSocket()

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Row gutter={16}>
        <Col span={12}>
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            {!config.legacy && (
              <Typography.Title keyboard style={{ margin: 0 }}>
                Probe SN: {probeSn}
              </Typography.Title>
            )}
            {!config.legacy && (
              <Typography.Title level={3} keyboard style={{ margin: 0 }}>
                Modbus Server Version {modbusVersion}
              </Typography.Title>
            )}
            {!config.legacy && (
              <CollapsibleCard size="small" title="Latest Client Message">
                {clientMsg}
              </CollapsibleCard>
            )}

            <ProbeStatusView />
          </Space>
        </Col>
        <Col span={12}>
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <FaultPanelView />
          </Space>
        </Col>
      </Row>
    </Space>
  )
}

export default FocusedView
