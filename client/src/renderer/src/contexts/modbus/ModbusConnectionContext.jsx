import { useState, createContext } from 'react'
const ModbusConnectionContext = createContext()

const ModbusConnectionProvider = ({ children }) => {
  // modbus connection
  const [modbusConnected, setModbusConnected] = useState(false)

  return (
    <ModbusConnectionContext.Provider value={{ modbusConnected, setModbusConnected }}>
      {children}
    </ModbusConnectionContext.Provider>
  )
}

export { ModbusConnectionContext, ModbusConnectionProvider }
