import { useState, createContext } from 'react'
const ProbeVoltageContext = createContext()

const ProbeVoltageProvider = ({ children }) => {
  const [acProbeVoltageMagnitude, setAcProbeVoltageMagnitude] = useState([])
  const [acProbeVoltagePhase, setAcProbeVoltagePhase] = useState([])

  return (
    <ProbeVoltageContext.Provider
      value={{
        acProbeVoltageMagnitude,
        setAcProbeVoltageMagnitude,
        acProbeVoltagePhase,
        setAcProbeVoltagePhase
      }}
    >
      {children}
    </ProbeVoltageContext.Provider>
  )
}

export { ProbeVoltageContext, ProbeVoltageProvider }
