import { Result } from 'antd'

const ModbusConErrorView = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px'
      }}
    >
      <Result
        status="error"
        title="Unable to Connect to Modbus Server"
        subTitle="We're experiencing difficulties connecting to your Modbus Server. Please ensure your Modbus server is running and the configured IP address is correct."
      />
    </div>
  )
}

export default ModbusConErrorView
