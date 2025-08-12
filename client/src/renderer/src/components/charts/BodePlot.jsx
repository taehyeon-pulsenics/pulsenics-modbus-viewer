import React, { useEffect, useRef, memo, useState, useContext } from 'react'
import Plot from 'react-plotly.js'
import { DarkModeContext } from '../../contexts/DarkModeContext'
import { geekblue, gray } from '@ant-design/colors'

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
  const { darkMode } = useContext(DarkModeContext)
  const [layout, setLayout] = useState({})

  const updateLayoutDimensions = () => {
    const container = chartRef.current
    if (container) {
      const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect()
      setLayout((prevLayout) => ({
        ...prevLayout,
        width: containerWidth,
        height: containerHeight
      }))
    }
  }

  useEffect(() => {
    updateLayoutDimensions()
    window.addEventListener('resize', updateLayoutDimensions)
    return () => window.removeEventListener('resize', updateLayoutDimensions)
  }, [])

  useEffect(() => {
    updateLayoutDimensions()

    setLayout((prevLayout) => ({
      ...prevLayout,
      paper_bgcolor: darkMode ? geekblue[9] : geekblue[0],
      plot_bgcolor: darkMode ? geekblue[9] : geekblue[0],
      title: {
        text: chartTitle,
        font: { size: 16, color: darkMode ? gray[0] : gray[5] }
      },
      xaxis: {
        title: { text: 'Frequency (Hz)', font: { size: 16, color: darkMode ? gray[0] : gray[5] } },
        type: 'log',
        autorange: true,
        showline: true,
        linecolor: darkMode ? gray[0] : gray[5],
        linewidth: 2,
        tickfont: { color: darkMode ? gray[0] : gray[5] },
        gridcolor: darkMode ? gray[0] : gray[5],
        zerolinecolor: darkMode ? gray[0] : gray[5]
      },
      yaxis: {
        title: { text: yAxisLabel, font: { size: 16, color: darkMode ? gray[0] : gray[5] } },
        showline: true,
        linecolor: darkMode ? gray[0] : gray[5],
        linewidth: 2,
        tickfont: { color: darkMode ? gray[0] : gray[5] },
        gridcolor: darkMode ? gray[0] : gray[5],
        zerolinecolor: darkMode ? gray[0] : gray[5]
      }
    }))
  }, [darkMode, chartTitle, yAxisLabel])

  return (
    <div
      key={chartId}
      className="BodePlot"
      style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}
      ref={chartRef}
    >
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
