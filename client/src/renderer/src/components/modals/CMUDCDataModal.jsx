import { Modal } from 'antd'
import NumberTable from '../tables/NumberTable'
import { geekblue } from '@ant-design/colors'
import { useContext } from 'react'
import { DarkModeContext } from '../../contexts/DarkModeContext'

const CMUDCDataModal = ({ open, onCancel, voltages, title = '' }) => {
  const { darkMode } = useContext(DarkModeContext)
  return (
    <Modal
      width="80%"
      title={title}
      open={open}
      onCancel={onCancel}
      footer={null}
      styles={{
        header: { backgroundColor: darkMode ? geekblue[9] : geekblue[0] },
        content: { backgroundColor: darkMode ? geekblue[9] : geekblue[0] }
      }}
    >
      <NumberTable numbers={voltages} nColumns={8} />
    </Modal>
  )
}

export default CMUDCDataModal
