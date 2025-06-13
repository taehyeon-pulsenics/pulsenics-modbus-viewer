import { Space } from 'antd'
import CollapsibleCard from '../cards/CollapsibleCard'
import ACPlots from '../charts/ACPlots'

/**
 *
 * @param {{ frequencies: number[], currMags: number[], currPhases: number[], volMagsList: number[][], volPhasesList: number[][] }} props
 * @returns {import('react').JSX.Element}
 */
const ACPlotView = ({ frequencies, currMags, currPhases, volMagsList, volPhasesList }) => {
  const filteredFrequencies = frequencies.filter((v) => v !== 0.0)
  const filteredCurrentMags = currMags.filter((v) => v !== 0.0)
  const filteredCurrentPhases = currPhases.filter((v) => v !== 0.0)
  const filteredVoltageMagsList = volMagsList.map((vm) => vm.filter((v) => v !== 0.0))
  const filteredVoltagePhasesList = volPhasesList.map((vp) => vp.filter((v) => v !== 0.0))

  // 1) magnitude of Z = |V| / |I>
  // 2) phase of Z = ∠V − ∠I
  const impMagsList = volMagsList.map((vm) => vm.map((vMag, i) => vMag / currMags[i]))
  const impPhasesList = volPhasesList.map((vp) => vp.map((vPha, i) => vPha - currPhases[i]))

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <CollapsibleCard size="small" title="Bode Plots">
        <ACPlots
          frequencies={filteredFrequencies}
          currMags={filteredCurrentMags}
          currPhases={filteredCurrentPhases}
          volMagsList={filteredVoltageMagsList}
          volPhasesList={filteredVoltagePhasesList}
          impMagsList={impMagsList}
          impPhasesList={impPhasesList}
        />
      </CollapsibleCard>
    </Space>
  )
}

export default ACPlotView
