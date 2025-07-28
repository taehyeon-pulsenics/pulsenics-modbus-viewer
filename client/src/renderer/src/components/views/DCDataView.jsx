import { useContext, useState } from 'react'
import { Button, Space } from 'antd'
import CollapsibleCard from '../cards/CollapsibleCard'
import { CloudOff, Search } from 'lucide-react'
import CMUDCDataModal from '../modals/CMUDCDataModal'
import CMUConnectionGridView from '../subviews/CMUConnectionGridView'
import { DcCmuVoltageContext, DcCurrentContext, DcProbeVoltageContext } from '../../contexts/modbus'

const DCDataView = () => {
  const { dcCurrent } = useContext(DcCurrentContext)
  const { dcProbeVoltage } = useContext(DcProbeVoltageContext)
  const {
    dcCmu1Voltage,
    dcCmu2Voltage,
    dcCmu3Voltage,
    dcCmu4Voltage,
    dcCmu5Voltage,
    dcCmu6Voltage,
    dcCmu7Voltage,
    dcCmu8Voltage,
    dcCmu9Voltage,
    dcCmu10Voltage,
    dcCmu11Voltage,
    dcCmu12Voltage,
    dcCmu13Voltage,
    dcCmu14Voltage,
    dcCmu15Voltage,
    dcCmu16Voltage
  } = useContext(DcCmuVoltageContext)
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
  const voltagesForModal = [
    dcCmu1Voltage,
    dcCmu2Voltage,
    dcCmu3Voltage,
    dcCmu4Voltage,
    dcCmu5Voltage,
    dcCmu6Voltage,
    dcCmu7Voltage,
    dcCmu8Voltage,
    dcCmu9Voltage,
    dcCmu10Voltage,
    dcCmu11Voltage,
    dcCmu12Voltage,
    dcCmu13Voltage,
    dcCmu14Voltage,
    dcCmu15Voltage,
    dcCmu16Voltage
  ][selectedCMU - 1]

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
      <CMUConnectionGridView
        render={(value) =>
          !!value.connected ? (
            <Button
              type="primary"
              icon={<Search style={{ fontSize: '16px' }} />}
              onClick={() => showModal(value.cmuNumber)}
            />
          ) : (
            <Button
              type="dashed"
              icon={<CloudOff style={{ color: 'red', fontSize: '16px' }} />}
              onClick={() => showModal(value.cmuNumber)}
            />
          )
        }
        title="View CMU Voltages"
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
