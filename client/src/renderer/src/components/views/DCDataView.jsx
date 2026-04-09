import { useState, useCallback } from 'react'
import { Button, Space } from 'antd'
import CollapsibleCard from '../cards/CollapsibleCard'
import CMUDCDataModal from '../modals/CMUDCDataModal'
import CMUConnectionGridView from '../subviews/CMUConnectionGridView'
import { useModbusStore } from '../../store/modbusStore'
import CloudOff from '../icons/CloudOff'
import Search from '../icons/Search'

const DCDataView = () => {
  const dcCurrent = useModbusStore((s) => s.dcCurrent)
  const dcProbeVoltage = useModbusStore((s) => s.dcProbeVoltage)
  const dcCmuVoltages = useModbusStore((s) => s.dcCmuVoltages)
  const [selectedCMU, setSelectedCMU] = useState(null)

  const showModal = useCallback((cmuNumber) => {
    setSelectedCMU(cmuNumber)
  }, [])
  const handleCancel = useCallback(() => {
    setSelectedCMU(null)
  }, [])

  const renderCMUConnection = useCallback(
    (value) =>
      !!value.connected ? (
        <Button type="primary" icon={<Search />} onClick={() => showModal(value.cmuNumber)} />
      ) : (
        <Button type="dashed" icon={<CloudOff />} onClick={() => showModal(value.cmuNumber)} />
      ),
    [showModal]
  )
  const isModalOpen = selectedCMU !== null
  const voltagesForModal = selectedCMU !== null ? dcCmuVoltages[selectedCMU - 1] : undefined

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
        <p>Voltage: {dcProbeVoltage}V</p>
      </CollapsibleCard>
      <CMUConnectionGridView render={renderCMUConnection} title="View CMU Voltages" />
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
