import { Modal } from 'antd'
import NumberTable from '../tables/NumberTable'

const CMUDCDataModal = ({ open, onCancel, voltages, title = '' }) => {
  return (
    <Modal title={title} open={open} onCancel={onCancel} footer={null}>
      <NumberTable numbers={voltages} nColumns={8} />
    </Modal>
  )
}

export default CMUDCDataModal
