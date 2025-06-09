import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

/**
 * Chart component renders a d3 line chart for multiple measurement sets.
 * Props:
 * - frequencies: number[]           // x‐axis values, same for every set
 * - measurements: number[][]        // up to 24 arrays, each the same length as frequencies
 * - chartId: string                 // unique ID for the chart container
 * - chartTitle: string              // title above the chart
 * - yAxisLabel: string              // label for the y‐axis
 */
const BodePlot = ({ frequencies, measurements, chartId, chartTitle, yAxisLabel }) => {
  const chartRef = useRef(null)

  useEffect(() => {
    // clear out any existing chart
    d3.select(chartRef.current).select('svg').remove()

    // dimensions
    const container = chartRef.current
    const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect()
    const margin = { top: 20, right: 20, bottom: 50, left: 60 }
    const width = containerWidth - margin.left - margin.right
    const height = containerHeight - margin.top - margin.bottom

    // svg setup
    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // x‐scale (log)
    const [minF, maxF] = d3.extent(frequencies)
    const safeMinF = minF <= 0 ? 0.1 : minF
    const xScale = d3.scaleLog().domain([safeMinF, maxF]).range([0, width])

    // y‐scale (linear) over all sets
    const allYs = measurements.flat()
    const [minY, maxY] = d3.extent(allYs)
    const yScale = d3.scaleLinear().domain([minY, maxY]).nice().range([height, 0])

    // color scale for up to 24 sets
    const color = d3.scaleSequential(d3.interpolateRainbow).domain([0, 23])

    // const color = []
    // for (let i = 0; i < 24; i++) {
    //   color.push(colorScale(i))
    // }

    // line generator
    const lineGen = d3
      .line()
      .x((_, i) => xScale(frequencies[i]))
      .y((d) => yScale(d))
      .curve(d3.curveMonotoneX)

    // draw each measurement set
    measurements.forEach((set, idx) => {
      const c = color(idx)

      // line path
      svg
        .append('path')
        .datum(set)
        .attr('fill', 'none')
        .attr('stroke', c)
        .attr('stroke-width', 1.5)
        .attr('d', lineGen)

      // scatter points
      svg
        .selectAll(`.point-set-${idx}`)
        .data(set)
        .enter()
        .append('circle')
        .attr('class', `point-set-${idx}`)
        .attr('cx', (_, i) => xScale(frequencies[i]))
        .attr('cy', (d) => yScale(d))
        .attr('r', 2)
        .attr('fill', c)
    })

    // axes
    const xAxis = d3.axisBottom(xScale).ticks(10, '~s')
    const yAxis = d3.axisLeft(yScale)

    svg.append('g').attr('transform', `translate(0, ${height})`).call(xAxis)
    svg.append('g').call(yAxis)

    // axis labels
    svg
      .append('text')
      .attr('class', 'x-axis-label')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .text('Frequency (Hz)')

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
      <h4 style={{ textAlign: 'center', margin: '5px 0' }}>{chartTitle}</h4>
      <div ref={chartRef} id={chartId} style={{ width: '100%', height: 'calc(100% - 30px)' }} />
    </div>
  )
}

export default BodePlot
