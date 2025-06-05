import { useContext } from 'react'
import { ModbusContext } from '../../contexts/ModbusContext'
import { Space } from 'antd'
import NumberTable from '../tables/NumberTable'
import CollapsibleCard from '../cards/CollapsibleCard'

const DCDataView = () => {
  const { dcVoltage, dcCurrent, cmuVoltages } = useContext(ModbusContext)

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <CollapsibleCard
        size="small"
        title="DC Sampling Reading"
        styles={{
          body: {
            overflowX: 'auto'
          }
        }}
      >
        <p>Current: {dcCurrent}A</p>
        <p>Voltage: {dcVoltage}V</p>

        {/* <CmuTables cmuVoltages={cmuVoltages} /> */}
      </CollapsibleCard>
    </Space>
  )
}

const CmuTables = ({ cmuVoltages }) => {
  const tables = []
  for (let i = 0; i < 16; i++) {
    // each cmu has 24 channels
    const targetVoltages = cmuVoltages.slice(i * 24, i * 24 + 24)

    tables.push(
      <CollapsibleCard size="small" title={`CMU ${i + 1} Voltages`} initiallyCollapsed>
        <NumberTable numbers={targetVoltages} nColumns={8} />
      </CollapsibleCard>
    )
  }

  return tables
}

export default DCDataView
