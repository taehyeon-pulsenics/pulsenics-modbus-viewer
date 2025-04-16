import { Table } from 'antd'

const NumberTable = ({ numbers, nColumns = 8, showHeader = false, columnPrefix = 'Column' }) => {
  // Split numbers into rows with nColumns numbers per row.
  const rows = []
  for (let i = 0; i < numbers.length; i += nColumns) {
    rows.push(numbers.slice(i, i + nColumns))
  }

  // Prepare the data source for the table.
  const dataSource = rows.map((row, rowIndex) => {
    // Create an object for each row.
    const rowData = { key: rowIndex }
    // Map each of the nColumns columns.
    for (let colIndex = 0; colIndex < nColumns; colIndex++) {
      // If a value does not exist for the column, use an empty string.
      rowData[`col${colIndex}`] = row[colIndex] !== undefined ? row[colIndex] : ''
    }
    return rowData
  })

  // Define the nColumns column definitions for the table.
  const columns = Array.from({ length: nColumns }, (_, index) => ({
    title: `${columnPrefix} ${index + 1}`,
    dataIndex: `col${index}`,
    key: `col${index}`
  }))

  return (
    <Table
      style={{ width: '100%' }}
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      showHeader={showHeader}
      bordered
    />
  )
}

export default NumberTable
