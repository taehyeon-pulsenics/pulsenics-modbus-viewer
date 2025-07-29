import { Checkbox, Col, Flex, Modal, Row, Switch } from 'antd'
import ACPlotView from '../subviews/ACPlotView'
import React, { useReducer, useState } from 'react'
import CollapsibleCard from '../cards/CollapsibleCard'
import NumberTable from '../tables/NumberTable'

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
  const [graphView, setGraphView] = useState(false)

  const [selectedChannels, dispatch] = useReducer((state, action) => {
    const newSelectedChannels = [...state]
    newSelectedChannels[action.index] = action.checked
    return newSelectedChannels
  }, Array(24).fill(false))

  const handleCheckboxChange = (index, checked) => {
    dispatch({ index, checked })
  }

  return (
    <Modal width="80%" title={title} open={open} onCancel={onCancel} footer={null}>
      <Flex gap={10}>
        Graph View?
        <Switch value={graphView} onChange={(e) => setGraphView(e)} />
      </Flex>

      {graphView ? (
        <>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {Array(24)
              .fill(null)
              .map((_, index) => (
                <Col key={`ac_graph_view_${index}`} className="gutter-row" span={4}>
                  <Checkbox onChange={(e) => handleCheckboxChange(index, e.target.checked)}>
                    Channel: {index + 1}
                  </Checkbox>
                </Col>
              ))}
          </Row>
          {!!voltageMags && !!voltagePhases && (
            <ACPlotView
              frequencies={frequencies}
              currMags={currentMags}
              currPhases={currentPhases}
              volMagsList={voltageMags.filter((_, i) => selectedChannels[i])}
              volPhasesList={voltagePhases.filter((_, i) => selectedChannels[i])}
            />
          )}
        </>
      ) : (
        <>
          {!!voltageMags &&
            !!voltagePhases &&
            Array(24)
              .fill(null)
              .map((_, index) => (
                <CollapsibleCard
                  key={`ac_table_view_${index}`}
                  title={`Channel ${index + 1}`}
                  initiallyCollapsed
                >
                  <CollapsibleCard title="Voltage Mag" initiallyCollapsed>
                    <NumberTable numbers={voltageMags[index]} />
                  </CollapsibleCard>
                  <CollapsibleCard title="Voltage Phase" initiallyCollapsed>
                    <NumberTable numbers={voltagePhases[index]} />
                  </CollapsibleCard>
                </CollapsibleCard>
              ))}
        </>
      )}
    </Modal>
  )
}

export default React.memo(CMUACDataModal)
