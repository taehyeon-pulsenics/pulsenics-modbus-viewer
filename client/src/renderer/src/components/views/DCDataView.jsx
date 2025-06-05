import { useContext, useState } from 'react'
import { ModbusContext } from '../../contexts/ModbusContext'
import { Button, Space } from 'antd'
import CollapsibleCard from '../cards/CollapsibleCard'
import { CloudOff, Search } from 'lucide-react'
import CMUTable from '../tables/CMUTable'
import CMUDCDataModal from '../modals/CMUDCDataModal'

const DCDataView = () => {
  const { dcVoltage, dcCurrent, cmuVoltages, connectedCmus } = useContext(ModbusContext)
  const [selectedCMU, setSelectedCMU] = useState(null)

  /**
   * Modal Control Functions
   */
  const showModal = (cmuNumber) => {
    setSelectedCMU(cmuNumber)
  }
  const handleCancel = () => {
    setSelectedCMU(null)
  }
  const isModalOpen = selectedCMU !== null
  const voltagesForModal =
    selectedCMU != null
      ? cmuVoltages.slice((selectedCMU - 1) * 24, (selectedCMU - 1) * 24 + 24)
      : []

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
      </CollapsibleCard>
      <CMUTable
        connectedCmus={connectedCmus}
        render={(value) =>
          !!value.connected ? (
            <Button
              type="primary"
              icon={<Search style={{ fontSize: '16px' }} />}
              onClick={() => showModal(value.cmuNumber)}
            />
          ) : (
            <CloudOff style={{ color: 'red', fontSize: '16px' }} />
          )
        }
        tableTitle="View CMU Voltages"
      />
      <CMUDCDataModal
        title={`CMU ${selectedCMU} Voltage Reading`}
        voltages={voltagesForModal}
        open={isModalOpen}
        onCancel={handleCancel}
      />
    </Space>
  )
}

export default DCDataView
