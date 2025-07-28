import { useState, createContext } from 'react'
const ProbeVoltageContext = createContext()

const ProbeVoltageProvider = ({ children }) => {
  const [dcProbeVoltage, setDcProbeVoltage] = useState(0)

  return (
    <ProbeVoltageContext.Provider value={{ dcProbeVoltage, setDcProbeVoltage }}>
      {children}
    </ProbeVoltageContext.Provider>
  )
}

export { ProbeVoltageContext, ProbeVoltageProvider }
