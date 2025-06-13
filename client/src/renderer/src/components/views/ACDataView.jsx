import React, { useContext, useEffect, useState } from 'react'
import { ModbusContext } from '../../contexts/ModbusContext'
import { Button, Space } from 'antd'
import ACPlotView from '../subviews/ACPlotView'
import CMUACDataModal from '../modals/CMUACDataModal'
import { CloudOff, Search } from 'lucide-react'
import NumberTable from '../tables/NumberTable'
import CollapsibleCard from '../cards/CollapsibleCard'
import CMUConnectionGridView from '../subviews/CMUConnectionGridView'

const ACDataView = () => {
  const {
    freqs,
    currMag,
    currPha,
    probeVoltageMag,
    probeVoltagePha,
    cmu1VoltageMag,
    cmu1VoltagePha,
    cmu2VoltageMag,
    cmu2VoltagePha,
    cmu3VoltageMag,
    cmu3VoltagePha,
    cmu4VoltageMag,
    cmu4VoltagePha,
    connectedCmus
  } = useContext(ModbusContext)

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
        return cmu1VoltageMag
      case 2:
        return cmu2VoltageMag
      case 3:
        return cmu3VoltageMag
      case 4:
        return cmu4VoltageMag
    }

    return null
  }
  const getCorrectVoltagePha = (cmuNumber) => {
    switch (cmuNumber) {
      case 1:
        return cmu1VoltagePha
      case 2:
        return cmu2VoltagePha
      case 3:
        return cmu3VoltagePha
      case 4:
        return cmu4VoltagePha
    }

    return null
  }

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <CMUConnectionGridView
        title="View CMU Data"
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
      />
      <ACPlotView
        frequencies={freqs}
        currMags={currMag}
        currPhases={currPha}
        volMagsList={[probeVoltageMag]}
        volPhasesList={[probeVoltagePha]}
      />
      <CollapsibleCard size="small" title="Frequencies" initiallyCollapsed>
        <NumberTable numbers={freqs} />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Current Magnitude" initiallyCollapsed>
        <NumberTable numbers={currMag} />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Current Phase" initiallyCollapsed>
        <NumberTable numbers={currPha} />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Probe Voltage Magnitude" initiallyCollapsed>
        <NumberTable numbers={probeVoltageMag} />
      </CollapsibleCard>
      <CollapsibleCard size="small" title="Probe Voltage Phase" initiallyCollapsed>
        <NumberTable numbers={probeVoltagePha} />
      </CollapsibleCard>
      {freqs && (
        <CMUACDataModal
          title={`CMU ${selectedCMU} Voltage Reading`}
          frequencies={freqs}
          currentMags={currMag}
          currentPhases={currPha}
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
