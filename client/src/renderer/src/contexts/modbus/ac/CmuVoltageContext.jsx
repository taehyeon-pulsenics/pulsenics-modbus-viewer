import { useState, createContext } from 'react'
const CmuVoltageContext = createContext()

const CmuVoltageProvider = ({ children }) => {
  const [acCmu1VoltageMagnitude, setAcCmu1VoltageMagnitude] = useState([])
  const [acCmu1VoltagePhase, setAcCmu1VoltagePhase] = useState([])
  const [acCmu2VoltageMagnitude, setAcCmu2VoltageMagnitude] = useState([])
  const [acCmu2VoltagePhase, setAcCmu2VoltagePhase] = useState([])
  const [acCmu3VoltageMagnitude, setAcCmu3VoltageMagnitude] = useState([])
  const [acCmu3VoltagePhase, setAcCmu3VoltagePhase] = useState([])
  const [acCmu4VoltageMagnitude, setAcCmu4VoltageMagnitude] = useState([])
  const [acCmu4VoltagePhase, setAcCmu4VoltagePhase] = useState([])

  return (
    <CmuVoltageContext.Provider
      value={{
        acCmu1VoltageMagnitude,
        setAcCmu1VoltageMagnitude,
        acCmu1VoltagePhase,
        setAcCmu1VoltagePhase,
        acCmu2VoltageMagnitude,
        setAcCmu2VoltageMagnitude,
        acCmu2VoltagePhase,
        setAcCmu2VoltagePhase,
        acCmu3VoltageMagnitude,
        setAcCmu3VoltageMagnitude,
        acCmu3VoltagePhase,
        setAcCmu3VoltagePhase,
        acCmu4VoltageMagnitude,
        setAcCmu4VoltageMagnitude,
        acCmu4VoltagePhase,
        setAcCmu4VoltagePhase
      }}
    >
      {children}
    </CmuVoltageContext.Provider>
  )
}

export { CmuVoltageContext, CmuVoltageProvider }
