import { Table } from 'antd'
import { memo, useMemo } from 'react'

const NumberTable = ({ numbers, nColumns = 8, showHeader = false, columnPrefix = 'Column' }) => {
  const dataSource = useMemo(() => {
    const rows = []
    for (let i = 0; i < numbers.length; i += nColumns) {
      rows.push(
        numbers
          .slice(i, i + nColumns)
          .map((num) => (typeof num === 'number' ? parseFloat(num.toFixed(6)) : num))
      )
    }
    return rows.map((row, rowIndex) => {
      const rowData = { key: rowIndex }
      for (let colIndex = 0; colIndex < nColumns; colIndex++) {
        rowData[`col${colIndex}`] = row[colIndex] !== undefined ? row[colIndex] : ''
      }
      return rowData
    })
  }, [numbers, nColumns])

  const columns = useMemo(
    () =>
      Array.from({ length: nColumns }, (_, index) => ({
        title: `${columnPrefix} ${index + 1}`,
        dataIndex: `col${index}`,
        key: `col${index}`
      })),
    [nColumns, columnPrefix]
  )

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

export default memo(NumberTable)
