import { WidthProvider, Responsive } from 'react-grid-layout'
import React, { memo } from 'react'
import BodePlot from './BodePlot'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

// Wrap Responsive grid with WidthProvider to have width automatically computed.
const ReactGridLayout = WidthProvider(Responsive)

/**
 *
 * @param {{ frequencies: number[], currMags: number[], currPhases: number[], volMagsList: number[][], volPhasesList: number[][], impMagsList: number[][], impPhasesList: number[][] }} props
 * @returns {import('react').JSX.Element}
 */
const ACPlots = ({
  frequencies,
  currMags,
  currPhases,
  volMagsList,
  volPhasesList,
  impMagsList,
  impPhasesList
}) => {
  const lgLayout = [
    { i: 'currMags', x: 0, y: 0, w: 1, h: 1 },
    { i: 'currPhases', x: 0, y: 1, w: 1, h: 1 },
    { i: 'volMagsList', x: 1, y: 0, w: 1, h: 1 },
    { i: 'volPhasesList', x: 1, y: 1, w: 1, h: 1 },
    { i: 'impMagsList', x: 2, y: 0, w: 1, h: 1 },
    { i: 'impPhasesList,', x: 2, y: 1, w: 1, h: 1 }
  ]

  const smLayout = [
    { i: 'currMags', x: 0, y: 0, w: 1, h: 1 },
    { i: 'currPhases', x: 1, y: 0, w: 1, h: 1 },
    { i: 'volMagsList', x: 0, y: 1, w: 1, h: 1 },
    { i: 'volPhasesList', x: 1, y: 1, w: 1, h: 1 },
    { i: 'impMagsList', x: 0, y: 2, w: 1, h: 1 },
    { i: 'impPhasesList,', x: 1, y: 2, w: 1, h: 1 }
  ]

  const gridStyle = {
    width: '100%',
    height: '100%'
  }

  return (
    <div style={gridStyle}>
      <ReactGridLayout
        className="layout"
        layouts={{ lg: lgLayout, md: lgLayout, sm: smLayout, xs: smLayout, xxs: smLayout }}
        cols={{ lg: 3, md: 3, sm: 2, xs: 2, xxs: 2 }}
        rowHeight={400} // Each grid cell takes the entire container height.
        isDraggable={false}
        isResizable={false}
      >
        <div key="currMags">
          <BodePlot
            frequencies={frequencies}
            measurements={[currMags]}
            chartId="currMags"
            yAxisLabel="Current Magnitude (A)"
            chartTitle="Current Magnitude"
          />
        </div>
        <div key="currPhases">
          <BodePlot
            frequencies={frequencies}
            measurements={[currPhases]}
            chartId="currPhases"
            yAxisLabel="Current Phase (degree)"
            chartTitle="Current Phase"
          />
        </div>
        <div key="volMagsList">
          <BodePlot
            frequencies={frequencies}
            measurements={volMagsList}
            chartId="volMagsList"
            yAxisLabel="Voltage Magnitude (V)"
            chartTitle="Voltage Magnitude"
          />
        </div>
        <div key="volPhasesList">
          <BodePlot
            frequencies={frequencies}
            measurements={volPhasesList}
            chartId="volPhasesList"
            yAxisLabel="Voltage Phase (degree)"
            chartTitle="Voltage Phase"
          />
        </div>
        <div key="impMagsList">
          <BodePlot
            frequencies={frequencies}
            measurements={impMagsList}
            chartId="impMagsList"
            yAxisLabel="Impedance Magnitude (Ohms)"
            chartTitle="Impedance Magnitude"
          />
        </div>
        <div key="impPhasesList,">
          <BodePlot
            frequencies={frequencies}
            measurements={impPhasesList}
            chartId="impPhasesList,"
            yAxisLabel="Impedance Phase (degree)"
            chartTitle="Impedance Phase"
          />
        </div>
      </ReactGridLayout>
    </div>
  )
}

export default memo(ACPlots)
