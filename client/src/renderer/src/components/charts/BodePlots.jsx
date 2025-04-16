import React, { useEffect, useRef } from 'react'
import { WidthProvider, Responsive } from 'react-grid-layout'
import * as d3 from 'd3'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

// Wrap Responsive grid with WidthProvider to have width automatically computed.
const ReactGridLayout = WidthProvider(Responsive)

/**
 * Chart component renders a simple d3 line chart.
 * It expects:
 * - frequencies: Array of numbers for the x-axis.
 * - measurements: Array of numbers for the y-axis.
 * - chartId: Unique ID for the chart container.
 * - chartTitle: Title displayed above the chart.
 * - yAxisLabel: Label displayed for the y-axis (customizable per chart).
 */
const BodePlot = ({ frequencies, measurements, chartId, chartTitle, yAxisLabel }) => {
  const chartRef = useRef(null)

  useEffect(() => {
    // Remove any existing SVG before rendering a new one (for updates)
    d3.select(chartRef.current).select('svg').remove()

    // Get container dimensions
    const container = chartRef.current
    const containerRect = container.getBoundingClientRect()
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height

    // Define margins and inner dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 50 }
    const width = containerWidth - margin.left - margin.right
    const height = containerHeight - margin.top - margin.bottom

    // Append SVG element with proper width/height and group element with margin transform
    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Obtain the extent of frequencies and avoid zero (required for log scale)
    const [minFreq, maxFreq] = d3.extent(frequencies)
    const safeMinFreq = minFreq <= 0 ? 0.1 : minFreq

    // Define x-scale (using the frequencies array)
    const xScale = d3.scaleLog().domain([safeMinFreq, maxFreq]).range([0, width])

    // Define y-scale (using the voltages array)
    const yScale = d3.scaleLinear().domain(d3.extent(measurements)).range([height, 0])

    // Create scatter points: for each voltage value, plot a circle.
    svg
      .selectAll('circle')
      .data(measurements)
      .enter()
      .append('circle')
      .attr('cx', (d, i) => xScale(frequencies[i]))
      .attr('cy', (d) => yScale(d))
      .attr('r', 3)
      .attr('fill', 'steelblue')

    // Append x-axis and y-axis
    const xAxis = d3.axisBottom(xScale).ticks(10, '~s')
    const yAxis = d3.axisLeft(yScale)

    svg.append('g').attr('transform', `translate(0, ${height})`).call(xAxis)

    svg.append('g').call(yAxis)

    // Add x-axis title ("Frequency (Hz)")
    svg
      .append('text')
      .attr('class', 'x-axis-label')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 5)
      .attr('text-anchor', 'middle')
      .text('Frequency (Hz)')

    // Add y-axis title (customizable via yAxisLabel prop)
    svg
      .append('text')
      .attr('class', 'y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .text(yAxisLabel)
  }, [frequencies, measurements, yAxisLabel])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Chart title */}
      <h4 style={{ textAlign: 'center', margin: '5px 0' }}>{chartTitle}</h4>
      {/* Chart container for d3; subtract height for title if needed */}
      <div ref={chartRef} id={chartId} style={{ width: '100%', height: 'calc(100% - 30px)' }}></div>
    </div>
  )
}

/**
 * ChartGrid component:
 * - Accepts 5 parallel arrays: frequencies, currMags, currPhases, volMags, and volPhases.
 * - Uses react-grid-layout to create a 1-row x 4-column grid.
 * - Each grid cell holds a Chart component.
 */
const BodePlots = ({ frequencies, currMags, currPhases, volMags, volPhases }) => {
  // Define a layout with 4 grid items arranged in 1 row
  const layout = [
    { i: 'chart1', x: 0, y: 0, w: 1, h: 1 },
    { i: 'chart2', x: 1, y: 0, w: 1, h: 1 },
    { i: 'chart3', x: 2, y: 0, w: 1, h: 1 },
    { i: 'chart4', x: 3, y: 0, w: 1, h: 1 }
  ]

  // Define grid properties: 100% width of the parent, fixed overall height.
  const gridStyle = {
    width: '100%',
    height: '400px' // Fixed height for the entire grid container
  }

  return (
    <div style={gridStyle}>
      <ReactGridLayout
        className="layout"
        layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
        cols={{ lg: 4, md: 4, sm: 4, xs: 4, xxs: 4 }}
        rowHeight={400} // Each grid cell takes the entire container height.
        isDraggable={false}
        isResizable={false}
      >
        <div key="chart1">
          <BodePlot
            frequencies={frequencies}
            measurements={currMags}
            chartId="chart1"
            yAxisLabel="Current Magnitude (A)"
            chartTitle="Current Magnitude"
          />
        </div>
        <div key="chart2">
          <BodePlot
            frequencies={frequencies}
            measurements={currPhases}
            chartId="chart2"
            yAxisLabel="Current Phase (degree)"
            chartTitle="Current Phase"
          />
        </div>
        <div key="chart3">
          <BodePlot
            frequencies={frequencies}
            measurements={volMags}
            chartId="chart3"
            yAxisLabel="Voltage Magnitude (V)"
            chartTitle="Voltage Magnitude"
          />
        </div>
        <div key="chart4">
          <BodePlot
            frequencies={frequencies}
            measurements={volPhases}
            chartId="chart4"
            yAxisLabel="Voltage Phase (degree)"
            chartTitle="Voltage Phase"
          />
        </div>
      </ReactGridLayout>
    </div>
  )
}

export default BodePlots
