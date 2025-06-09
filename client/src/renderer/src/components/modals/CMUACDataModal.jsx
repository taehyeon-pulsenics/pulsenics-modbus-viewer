import { Checkbox, Col, Modal, Row } from 'antd'
import ACPlotView from '../views/subviews/ACPlotView'
import { useState } from 'react'

/**
 *
 * @param {{ open: boolean, onCancel: ((e: React.MouseEvent<HTMLButtonElement>) => void) | undefined, frequencies: number[], currentMags: number[], currentPhases: number[], voltageMags: number[][], voltagePhases: number[][], title: string }} props
 * @returns
 */
const CMUACDataModal = ({
  open,
  onCancel,
  frequencies,
  currentMags,
  currentPhases,
  voltageMags,
  voltagePhases,
  title = ''
}) => {
  const [selectedChannels, setSelectedChannels] = useState(Array(24).fill(false))

  return (
    <Modal width="80%" title={title} open={open} onCancel={onCancel} footer={null}>
      <>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {Array(24)
            .fill(null)
            .map((_, index) => (
              <Col className="gutter-row" span={4}>
                <Checkbox
                  onChange={(e) => {
                    const newSelectedChannels = [...selectedChannels]
                    newSelectedChannels[index] = e.target.checked
                    setSelectedChannels(newSelectedChannels)
                  }}
                >
                  Channel: {index + 1}
                </Checkbox>
              </Col>
            ))}
        </Row>
      </>
      {!!voltageMags && !!voltagePhases && (
        <ACPlotView
          frequencies={frequencies}
          currMags={currentMags}
          currPhases={currentPhases}
          volMagsList={voltageMags.filter((_, i) => selectedChannels[i])}
          volPhasesList={voltagePhases.filter((_, i) => selectedChannels[i])}
        />
      )}
    </Modal>
  )
}

export default CMUACDataModal
