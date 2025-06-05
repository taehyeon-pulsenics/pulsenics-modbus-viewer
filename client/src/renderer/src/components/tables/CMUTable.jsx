import { Table } from 'antd'
import CollapsibleCard from '../cards/CollapsibleCard'

const CMUTable = ({ tableTitle = 'Connected CMUs', connectedCmus, render }) => {
  const connectedCMUColumns = connectedCmus.map((_, index) => ({
    title: `CMU ${index + 1}`, // Column header
    dataIndex: `col${index + 1}`, // Key to match data source
    key: `col${index + 1}`,
    render
  }))

  // Create a single row data source where each key corresponds to a column
  const connectedCMUDataSource = [
    connectedCmus.reduce((acc, cur, index) => {
      acc[`col${index + 1}`] = {
        cmuNumber: index + 1,
        connected: cur
      }
      return acc
    }, {})
  ]

  return (
    <CollapsibleCard size="small" title={tableTitle}>
      <Table
        columns={connectedCMUColumns}
        dataSource={connectedCMUDataSource}
        pagination={false} // No pagination needed for a single row
        bordered // Optional: adds borders to the table
      />
    </CollapsibleCard>
  )
}

export default CMUTable
