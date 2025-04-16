import React, { useContext } from 'react'
import { ModbusContext } from '../../contexts/ModbusContext'
import { Space } from 'antd'
import NumberTable from '../tables/NumberTable'
import CollapsibleCard from '../cards/CollapsibleCard'

const ProbeACView = () => {
  const { freqs, currMag, currPha, probeVoltageMag, probeVoltagePha } = useContext(ModbusContext)
  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <CollapsibleCard size="small" title="Freqs">
        <NumberTable numbers={freqs} />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Current Magnitude">
        <NumberTable numbers={currMag} />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Current Phase">
        <NumberTable numbers={currPha} />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Probe Voltage Magnitude">
        <NumberTable numbers={probeVoltageMag} />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Probe Voltage Phase">
        <NumberTable numbers={probeVoltagePha} />
      </CollapsibleCard>
    </Space>
  )
}

export default ProbeACView
