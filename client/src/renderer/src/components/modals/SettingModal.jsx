import { Button, Form, Input, Modal, Switch } from 'antd'
import { useSocket } from '../../contexts/SocketContext'

const SettingModal = ({ open, onCancel, onSubmit }) => {
  const { config, changeConfig } = useSocket()
  const [form] = Form.useForm()

  /**
   * Form functions
   */
  const handleFinish = (values) => {
    changeConfig({ ...values, legacy: false })
    onSubmit && onSubmit()
  }

  return (
    <Modal className="setting-modal" title="Settings" open={open} onCancel={onCancel} footer={null}>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        initialValues={config}
        style={{ maxWidth: '100%' }}
        onFinish={handleFinish}
      >
        <Form.Item name="probeIp" label="IP Address">
          <Input />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default SettingModal
