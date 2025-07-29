import { Card, Col, Row, Space } from 'antd'
import React, { useContext } from 'react'
import CollapsibleCard from '../cards/CollapsibleCard'
import { ConnectedCmusContext } from '../../contexts/modbus'

const CMUConnectionGridView = ({ title = 'CMU Connections', render }) => {
  const { connectedCmus } = useContext(ConnectedCmusContext)

  const connectedCmuObjs = connectedCmus.map((connected, index) => {
    return {
      cmuNumber: index + 1,
      connected,
      key: `CMUConnectionGridView_${index + 1}`
    }
  })

  return (
    <CollapsibleCard size="small" title={title}>
      <Row gutter={[16, 16]} wrap justify="start" align="top">
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <Col key={`CMUConnectionGridView_${index}`} xs={24} md={12} lg={6}>
              <Card size="small" title={`Port ${index + 1}`}>
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                  <Row gutter={[16, 16]} wrap justify="start" align="top">
                    <Col flex="none">
                      <Card size="small" title={`CMU ${index * 4 + 1}`}>
                        {render && render(connectedCmuObjs[index * 4 + 0])}
                      </Card>
                    </Col>
                    <Col flex="none">
                      <Card size="small" title={`CMU ${index * 4 + 2}`}>
                        {render && render(connectedCmuObjs[index * 4 + 1])}
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]} wrap justify="start" align="top">
                    <Col flex="none">
                      <Card size="small" title={`CMU ${index * 4 + 3}`}>
                        {render && render(connectedCmuObjs[index * 4 + 2])}
                      </Card>
                    </Col>
                    <Col flex="none">
                      <Card size="small" title={`CMU ${index * 4 + 4}`}>
                        {render && render(connectedCmuObjs[index * 4 + 3])}
                      </Card>
                    </Col>
                  </Row>
                </Space>
              </Card>
            </Col>
          ))}
      </Row>
    </CollapsibleCard>
  )
}

export default CMUConnectionGridView
