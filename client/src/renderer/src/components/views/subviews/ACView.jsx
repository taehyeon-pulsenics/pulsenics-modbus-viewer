import { Space } from 'antd'
import NumberTable from '../../tables/NumberTable'
import CollapsibleCard from '../../cards/CollapsibleCard'
import ACPlots from '../../charts/ACPlots'

const ACView = ({ frequencies, currMags, currPhases, volMags, volPhases }) => {
  const filteredFrequencies = frequencies.filter((v) => v !== 0.0)
  const filteredCurrentMags = currMags.filter((v) => v !== 0.0)
  const filteredCurrentPhases = currPhases.filter((v) => v !== 0.0)
  const filteredVoltageMags = volMags.filter((v) => v !== 0.0)
  const filteredVoltagePhases = volPhases.filter((v) => v !== 0.0)

  // 1) magnitude of Z = |V| / |I>
  // 2) phase of Z = ∠V − ∠I
  const impMags = volMags.map((vMag, i) => vMag / currMags[i])
  const impPhases = volPhases.map((vPha, i) => vPha - currPhases[i])

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <CollapsibleCard size="small" title="Bode Plots">
        <ACPlots
          frequencies={filteredFrequencies}
          currMags={filteredCurrentMags}
          currPhases={filteredCurrentPhases}
          volMags={filteredVoltageMags}
          volPhases={filteredVoltagePhases}
          impMags={impMags}
          impPhases={impPhases}
        />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Frequencies" initiallyCollapsed>
        <NumberTable numbers={frequencies} />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Current Magnitude" initiallyCollapsed>
        <NumberTable numbers={currMags} />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Current Phase" initiallyCollapsed>
        <NumberTable numbers={currPhases} />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Probe Voltage Magnitude" initiallyCollapsed>
        <NumberTable numbers={volMags} />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Probe Voltage Phase" initiallyCollapsed>
        <NumberTable numbers={volPhases} />
      </CollapsibleCard>
    </Space>
  )
}

export default ACView
