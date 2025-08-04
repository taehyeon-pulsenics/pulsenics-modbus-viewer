import React, { useEffect, useRef, memo, useState } from 'react'
import Plot from 'react-plotly.js'

/**
 * Chart component renders a plotly plot for multiple measurement sets.
 * Props:
 * - frequencies: number[]           // x‐axis values, same for every set
 * - measurements: number[][]        // up to 24 arrays, each the same length as frequencies
 * - chartId: string                 // unique ID for the chart container
 * - chartTitle: string              // title above the chart
 * - yAxisLabel: string              // label for the y‐axis
 */
const BodePlot = ({ frequencies, measurements, chartId, chartTitle, yAxisLabel }) => {
  const chartRef = useRef(null)
  const [layout, setLayout] = useState({
    title: chartTitle,
    xaxis: {
      title: 'Frequency (Hz}',
      type: 'log',
      autorange: true
    },
    yaxis: {
      title: yAxisLabel
    }
  })

  useEffect(() => {
    // dimensions
    const container = chartRef.current
    if (!!container) {
      const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect()
      const margin = { top: 0, right: 0, bottom: 0, left: 0 }
      const width = containerWidth - margin.left - margin.right
      const height = containerHeight - margin.top - margin.bottom

      setLayout((l) => ({
        ...l,
        width,
        height
      }))
    }
  }, [])

  return (
    <div
      key={chartId}
      className="BodePlot"
      style={{ width: '100%', height: '100%' }}
      ref={chartRef}
    >
      <h4 style={{ textAlign: 'center' }}>{chartTitle}</h4>
      <Plot
        data={measurements.map((m) => ({
          x: frequencies,
          y: m,
          type: 'scatter',
          mode: 'lines+markers'
        }))}
        layout={layout}
      />
    </div>
  )
}

export default memo(BodePlot)
