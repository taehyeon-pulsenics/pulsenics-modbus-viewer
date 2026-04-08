import React, { useState } from 'react'
import { useModbusStore } from '../../store/modbusStore'
import { Button, Space } from 'antd'
import ACPlotView from '../subviews/ACPlotView'
import CMUACDataModal from '../modals/CMUACDataModal'
import NumberTable from '../tables/NumberTable'
import CollapsibleCard from '../cards/CollapsibleCard'
import CMUConnectionGridView from '../subviews/CMUConnectionGridView'
import CloudOff from '../icons/CloudOff'
import Search from '../icons/Search'

const ACDataView = () => {
  const acCurrentMagnitude = useModbusStore((s) => s.acCurrentMagnitude)
  const acCurrentPhase = useModbusStore((s) => s.acCurrentPhase)
  const freqs = useModbusStore((s) => s.freqs)
  const acProbeVoltageMagnitude = useModbusStore((s) => s.acProbeVoltageMagnitude)
  const acProbeVoltagePhase = useModbusStore((s) => s.acProbeVoltagePhase)
  const acCmuVoltages = useModbusStore((s) => s.acCmuVoltages)

  const [selectedCMU, setSelectedCMU] = useState(null)

  const showModal = (cmuNumber) => setSelectedCMU(cmuNumber)
  const handleCancel = () => setSelectedCMU(null)
  const isModalOpen = selectedCMU !== null
  const selectedCmuData = selectedCMU !== null ? acCmuVoltages[selectedCMU - 1] : null

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <CMUConnectionGridView
        title="View CMU Data"
        render={(value) =>
          !!value.connected ? (
            <Button type="primary" icon={<Search />} onClick={() => showModal(value.cmuNumber)} />
          ) : (
            <Button type="dashed" icon={<CloudOff />} onClick={() => showModal(value.cmuNumber)} />
          )
        }
      />
      <ACPlotView
        frequencies={freqs}
        currMags={acCurrentMagnitude}
        currPhases={acCurrentPhase}
        volMagsList={[acProbeVoltageMagnitude]}
        volPhasesList={[acProbeVoltagePhase]}
      />
      <CollapsibleCard size="small" title="Frequencies" initiallyCollapsed>
        <NumberTable numbers={freqs} />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Current Magnitude" initiallyCollapsed>
        <NumberTable numbers={acCurrentMagnitude} />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Current Phase" initiallyCollapsed>
        <NumberTable numbers={acCurrentPhase} />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Probe Voltage Magnitude" initiallyCollapsed>
        <NumberTable numbers={acProbeVoltageMagnitude} />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Probe Voltage Phase" initiallyCollapsed>
        <NumberTable numbers={acProbeVoltagePhase} />
      </CollapsibleCard>
      {freqs && (
        <CMUACDataModal
          title={`CMU ${selectedCMU} Voltage Reading`}
          frequencies={freqs}
          currentMags={acCurrentMagnitude}
          currentPhases={acCurrentPhase}
          voltageMags={selectedCmuData?.magnitude ?? null}
          voltagePhases={selectedCmuData?.phase ?? null}
          open={isModalOpen}
          onCancel={handleCancel}
        />
      )}
    </Space>
  )
}

export default ACDataView
