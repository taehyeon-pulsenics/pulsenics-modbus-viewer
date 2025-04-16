import React, { useContext } from 'react'
import { ModbusContext } from '../../contexts/ModbusContext'
import { Card, Space } from 'antd'
import NumberTable from '../tables/NumberTable'

const ProbeACView = () => {
  const { freqs, currMag, currPha, probeVoltageMag, probeVoltagePha } = useContext(ModbusContext)
  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Card size="small" title="Freqs">
        <NumberTable numbers={freqs} />
      </Card>
      <Card size="small" title="Current Magnitude">
        <NumberTable numbers={currMag} />
      </Card>
      <Card size="small" title="Current Phase">
        <NumberTable numbers={currPha} />
      </Card>
      <Card size="small" title="Probe Voltage Magnitude">
        <NumberTable numbers={probeVoltageMag} />
      </Card>
      <Card size="small" title="Probe Voltage Phase">
        <NumberTable numbers={probeVoltagePha} />
      </Card>
    </Space>
  )
}

export default ProbeACView
