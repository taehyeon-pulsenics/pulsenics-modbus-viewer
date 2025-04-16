import { useContext } from 'react'
import { ModbusContext } from '../../contexts/ModbusContext'
import { CircleCheck, CircleX } from 'lucide-react'
import { Card, Space } from 'antd'
import NumberTable from '../tables/NumberTable'

const DCView = () => {
  const { updateDCSamplingRateCoil, newDcSamplingRate, dcVoltage, dcCurrent, cmuVoltages } =
    useContext(ModbusContext)

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Card size="small" title="Update DC Sampling Rate?">
        {updateDCSamplingRateCoil ? <CircleCheck color="green" /> : <CircleX color="red" />}
      </Card>
      <Card size="small" title="DC Sampling Rate">
        {newDcSamplingRate} /s
      </Card>
      <Card
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

        <CmuTables cmuVoltages={cmuVoltages} />
      </Card>
    </Space>
  )
}

const CmuTables = ({ cmuVoltages }) => {
  const tables = []
  for (let i = 0; i < 16; i++) {
    // each cmu has 24 channels
    const targetVoltages = cmuVoltages.slice(i * 24, i * 24 + 24)

    tables.push(
      <Card size="small" title={`CMU ${i + 1} Voltages`}>
        <NumberTable numbers={targetVoltages} nColumns={8} />
      </Card>
    )
  }

  return tables
}

export default DCView
