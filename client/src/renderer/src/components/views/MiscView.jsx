import { useContext } from 'react'
import { ModbusContext } from '../../contexts/ModbusContext'
import { CircleCheck, CircleX, Cloud, CloudOff } from 'lucide-react'
import { Space, Table } from 'antd'
import CollapsibleCard from '../cards/CollapsibleCard'

const MiscView = () => {
  const {
    powerLimit,
    currentLimit,
    dutOvervoltageLimit,
    dutUndervoltageLimit,
    voltageDeviationLimit,
    probeSn,
    clientMsg
  } = useContext(ModbusContext)
  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <p>Probe Serial Number: {probeSn}</p>
      <CollapsibleCard size="small" title="Latest Client Message">
        {clientMsg}
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Configured Limits">
        <p>Power Limit: {powerLimit}</p>
        <p>Current Limit: {currentLimit}</p>
        <p>DUT Overvoltage Limit: {dutOvervoltageLimit}</p>
        <p>DUT Undervoltage Limit: {dutUndervoltageLimit}</p>
        <p>Voltage Deviation Limit: {voltageDeviationLimit}</p>
      </CollapsibleCard>
    </Space>
  )
}

export default MiscView
