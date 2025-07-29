import { useContext } from 'react'
import { useSocket } from '../../contexts/SocketContext'
import { Col, Row, Space, Typography } from 'antd'
import CollapsibleCard from '../cards/CollapsibleCard'
import FaultPanelView from '../subviews/FaultPanelView'
import ProbeStatusView from '../subviews/ProbeStatusView'
import { ClientMessageContext, ProbeInformationContext } from '../../contexts/modbus'

const FocusedView = () => {
  const { probeSn, modbusVersion } = useContext(ProbeInformationContext)
  const { clientMsg } = useContext(ClientMessageContext)
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
