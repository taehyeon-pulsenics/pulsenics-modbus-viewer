import { useContext } from 'react'
import { ModbusContext } from '../../contexts/ModbusContext'
import { useSocket } from '../../contexts/SocketContext'
import { Col, Row, Space, Typography } from 'antd'
import CollapsibleCard from '../cards/CollapsibleCard'
import FaultPanelView from '../subviews/FaultPanelView'
import { CircleCheck, CircleX, Cloud, CloudOff } from 'lucide-react'
import CMUConnectionGridView from '../subviews/CMUConnectionGridView'

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
      {!config.legacy && <Typography.Title keyboard>{probeSn}</Typography.Title>}
      <Row gutter={16}>
        <Col span={12}>
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            {!config.legacy && (
              <CollapsibleCard size="small" title="Latest Client Message">
                {clientMsg}
              </CollapsibleCard>
            )}

            <CollapsibleCard size="small" title="Probe Status">
              <p>
                Sample Started:{' '}
                {sampleStarted ? <CircleCheck color="green" /> : <CircleX color="red" />}
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
                  Sample Failed:{' '}
                  {sampleFailed ? <CircleCheck color="green" /> : <CircleX color="red" />}
                </p>
              )}
            </CollapsibleCard>
            <CMUConnectionGridView
              render={(value) =>
                !!value.connected ? (
                  <Cloud style={{ color: 'green', fontSize: '16px' }} />
                ) : (
                  <CloudOff style={{ color: 'red', fontSize: '16px' }} />
                )
              }
            />
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
