import React, { useContext } from 'react'
import { ModbusContext } from '../../contexts/ModbusContext'
import { Space } from 'antd'
import NumberTable from '../tables/NumberTable'
import CollapsibleCard from '../cards/CollapsibleCard'
import ACPlots from '../charts/ACPlots'

const ProbeACView = () => {
  const { freqs, currMag, currPha, probeVoltageMag, probeVoltagePha } = useContext(ModbusContext)

  const frequencies = freqs.filter((v) => v !== 0.0)
  const currMags = currMag.filter((v) => v !== 0.0)
  const currPhases = currPha.filter((v) => v !== 0.0)
  const volMags = probeVoltageMag.filter((v) => v !== 0.0)
  const volPhases = probeVoltagePha.filter((v) => v !== 0.0)

  // 1) magnitude of Z = |V| / |I>
  // 2) phase of Z = ∠V − ∠I
  const impMags = volMags.map((vMag, i) => vMag / currMags[i])
  const impPhases = volPhases.map((vPha, i) => vPha - currPhases[i])

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <CollapsibleCard size="small" title="Bode Plots">
        <ACPlots
          frequencies={frequencies}
          currMags={currMags}
          currPhases={currPhases}
          volMags={volMags}
          volPhases={volPhases}
          impMags={impMags}
          impPhases={impPhases}
        />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Frequencies" initiallyCollapsed>
        <NumberTable numbers={freqs} />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Current Magnitude" initiallyCollapsed>
        <NumberTable numbers={currMag} />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Current Phase" initiallyCollapsed>
        <NumberTable numbers={currPha} />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Probe Voltage Magnitude" initiallyCollapsed>
        <NumberTable numbers={probeVoltageMag} />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Probe Voltage Phase" initiallyCollapsed>
        <NumberTable numbers={probeVoltagePha} />
      </CollapsibleCard>
    </Space>
  )
}

export default ProbeACView
