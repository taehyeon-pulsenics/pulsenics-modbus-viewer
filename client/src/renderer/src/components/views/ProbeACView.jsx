import React, { useContext } from 'react'
import { ModbusContext } from '../../contexts/ModbusContext'
import { Space } from 'antd'
import NumberTable from '../tables/NumberTable'
import CollapsibleCard from '../cards/CollapsibleCard'
import BodePlots from '../charts/BodePlots'

const ProbeACView = () => {
  const { freqs, currMag, currPha, probeVoltageMag, probeVoltagePha } = useContext(ModbusContext)
  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <CollapsibleCard size="small" title="Bode Plots">
        <BodePlots
          frequencies={freqs.filter((v) => v !== 0.0)}
          currMags={currMag.filter((v) => v !== 0.0)}
          currPhases={currPha.filter((v) => v !== 0.0)}
          volMags={probeVoltageMag.filter((v) => v !== 0.0)}
          volPhases={probeVoltagePha.filter((v) => v !== 0.0)}
        />
      </CollapsibleCard>
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
