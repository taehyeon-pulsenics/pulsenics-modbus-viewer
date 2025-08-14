import React, { useContext, useEffect, useState } from 'react'
import {
  AcCurrentContext,
  AcFrequencyContext,
  AcProbeVoltageContext,
  AcCmuVoltageContext
} from '../../contexts/modbus'
import { Button, Space } from 'antd'
import ACPlotView from '../subviews/ACPlotView'
import CMUACDataModal from '../modals/CMUACDataModal'
import NumberTable from '../tables/NumberTable'
import CollapsibleCard from '../cards/CollapsibleCard'
import CMUConnectionGridView from '../subviews/CMUConnectionGridView'
import CloudOff from '../icons/CloudOff'
import Search from '../icons/Search'

const ACDataView = () => {
  const { acCurrentMagnitude, acCurrentPhase } = useContext(AcCurrentContext)
  const { freqs } = useContext(AcFrequencyContext)
  const { acProbeVoltageMagnitude, acProbeVoltagePhase } = useContext(AcProbeVoltageContext)
  const {
    acCmu1VoltageMagnitude,
    acCmu1VoltagePhase,
    acCmu2VoltageMagnitude,
    acCmu2VoltagePhase,
    acCmu3VoltageMagnitude,
    acCmu3VoltagePhase,
    acCmu4VoltageMagnitude,
    acCmu4VoltagePhase
  } = useContext(AcCmuVoltageContext)

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
  const getCorrectVoltageMag = (cmuNumber) => {
    switch (cmuNumber) {
      case 1:
        return acCmu1VoltageMagnitude
      case 2:
        return acCmu2VoltageMagnitude
      case 3:
        return acCmu3VoltageMagnitude
      case 4:
        return acCmu4VoltageMagnitude
    }

    return null
  }
  const getCorrectVoltagePha = (cmuNumber) => {
    switch (cmuNumber) {
      case 1:
        return acCmu1VoltagePhase
      case 2:
        return acCmu2VoltagePhase
      case 3:
        return acCmu3VoltagePhase
      case 4:
        return acCmu4VoltagePhase
    }

    return null
  }

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
          voltageMags={getCorrectVoltageMag(selectedCMU)}
          voltagePhases={getCorrectVoltagePha(selectedCMU)}
          open={isModalOpen}
          onCancel={handleCancel}
        />
      )}
    </Space>
  )
}

export default ACDataView
