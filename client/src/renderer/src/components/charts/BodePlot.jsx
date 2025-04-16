import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

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
    const margin = { top: 20, right: 20, bottom: 50, left: 50 }
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
      .attr('y', height + margin.bottom - 15)
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

export default BodePlot
