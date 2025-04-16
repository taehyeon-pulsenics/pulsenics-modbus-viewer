import { useContext } from 'react'
import { ModbusContext } from '../../contexts/ModbusContext'
import { CircleCheck, CircleX, Cloud, CloudOff } from 'lucide-react'
import { Card, Space, Table } from 'antd'

const ProbeStatusView = () => {
  const {
    sampleModeCoil,
    startEISCoil,
    interruptCoil,
    sampleStarted,
    sampleCompleted,
    connectedCmus,
    sampleReceived,
    sampleFailed,
    minFreq,
    maxFreq,
    amp,
    nTotalFreqs,
    nSimulFreqs,
    dutId,
    triggerId
  } = useContext(ModbusContext)

  const connectedCMUColumns = connectedCmus.map((_, index) => ({
    title: `CMU ${index + 1}`, // Column header
    dataIndex: `col${index + 1}`, // Key to match data source
    key: `col${index + 1}`,
    render: (value) =>
      !!value ? (
        <Cloud style={{ color: 'green', fontSize: '16px' }} />
      ) : (
        <CloudOff style={{ color: 'red', fontSize: '16px' }} />
      ) // Render icon based on boolean
  }))

  // Create a single row data source where each key corresponds to a column
  const connectedCMUDataSource = [
    connectedCmus.reduce(
      (acc, cur, index) => {
        acc[`col${index + 1}`] = cur
        return acc
      },
      { key: 'row1' }
    )
  ]

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Card size="small" title="Connected CMUs">
        <Table
          columns={connectedCMUColumns}
          dataSource={connectedCMUDataSource}
          pagination={false} // No pagination needed for a single row
          bordered // Optional: adds borders to the table
        />
      </Card>
      <Card size="small" title="AC Coil">
        <p>Sample Mode: {sampleModeCoil ? 'Galvanostatic' : 'Potentiostatic'}</p>
        <p>Start EIS: {startEISCoil ? <CircleCheck color="green" /> : <CircleX color="red" />}</p>
        <p>
          Interrupt EIS: {interruptCoil ? <CircleCheck color="green" /> : <CircleX color="red" />}
        </p>
      </Card>

      <Card size="small" title="Probe Status">
        <p>
          Sample Started: {sampleStarted ? <CircleCheck color="green" /> : <CircleX color="red" />}
        </p>
        <p>
          Sample Completed:{' '}
          {sampleCompleted ? <CircleCheck color="green" /> : <CircleX color="red" />}
        </p>
        <p>
          Sample Received:{' '}
          {sampleReceived ? <CircleCheck color="green" /> : <CircleX color="red" />}
        </p>
        <p>
          Sample Failed: {sampleFailed ? <CircleCheck color="green" /> : <CircleX color="red" />}
        </p>
      </Card>
      <Card size="small" title="Sampling Control">
        <p>Minimum Frequency: {minFreq} Hz</p>
        <p>Maximum Frequency: {maxFreq} Hz</p>
        <p>Amplitude: {amp} A</p>
        <p>Total Number of Frequencies: {nTotalFreqs}</p>
        <p>Number of Simultaneous Frequencies: {nSimulFreqs}</p>
      </Card>
      <Card size="small" title="Metadata">
        <p>DUT ID: {dutId}</p>
        <p>Trigger ID: {triggerId}</p>
      </Card>
    </Space>
  )
}

export default ProbeStatusView
