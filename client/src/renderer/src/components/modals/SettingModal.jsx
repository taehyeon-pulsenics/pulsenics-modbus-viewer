import { useState } from 'react'
import { Button, Flex, Input, Modal } from 'antd'

const SettingModal = ({ open, onCancel, ipAddress, onIpChange, onIpFieldChange }) => {
  const [ipAddressField, setIpAddressField] = useState(ipAddress)

  return (
    <Modal title="Settings" open={open} onCancel={onCancel} footer={null}>
      <Flex gap="large">
        <Input
          placeholder="Probe IP (ex. 127.0.0.1)"
          value={ipAddressField}
          onChange={(e) => setIpAddressField(e.target.value)}
        />
        <Button type="primary" onClick={() => onIpChange(ipAddressField)}>
          Change IP
        </Button>
      </Flex>
    </Modal>
  )
}

export default SettingModal
