import { useState, createContext } from 'react'
const CmuVoltageContext = createContext()

const CmuVoltageProvider = ({ children }) => {
  const [dcCmu1Voltage, setDcCmu1Voltage] = useState([])
  const [dcCmu2Voltage, setDcCmu2Voltage] = useState([])
  const [dcCmu3Voltage, setDcCmu3Voltage] = useState([])
  const [dcCmu4Voltage, setDcCmu4Voltage] = useState([])
  const [dcCmu5Voltage, setDcCmu5Voltage] = useState([])
  const [dcCmu6Voltage, setDcCmu6Voltage] = useState([])
  const [dcCmu7Voltage, setDcCmu7Voltage] = useState([])
  const [dcCmu8Voltage, setDcCmu8Voltage] = useState([])
  const [dcCmu9Voltage, setDcCmu9Voltage] = useState([])
  const [dcCmu10Voltage, setDcCmu10Voltage] = useState([])
  const [dcCmu11Voltage, setDcCmu11Voltage] = useState([])
  const [dcCmu12Voltage, setDcCmu12Voltage] = useState([])
  const [dcCmu13Voltage, setDcCmu13Voltage] = useState([])
  const [dcCmu14Voltage, setDcCmu14Voltage] = useState([])
  const [dcCmu15Voltage, setDcCmu15Voltage] = useState([])
  const [dcCmu16Voltage, setDcCmu16Voltage] = useState([])

  return (
    <CmuVoltageContext.Provider
      value={{
        dcCmu1Voltage,
        setDcCmu1Voltage,
        dcCmu2Voltage,
        setDcCmu2Voltage,
        dcCmu3Voltage,
        setDcCmu3Voltage,
        dcCmu4Voltage,
        setDcCmu4Voltage,
        dcCmu5Voltage,
        setDcCmu5Voltage,
        dcCmu6Voltage,
        setDcCmu6Voltage,
        dcCmu7Voltage,
        setDcCmu7Voltage,
        dcCmu8Voltage,
        setDcCmu8Voltage,
        dcCmu9Voltage,
        setDcCmu9Voltage,
        dcCmu10Voltage,
        setDcCmu10Voltage,
        dcCmu11Voltage,
        setDcCmu11Voltage,
        dcCmu12Voltage,
        setDcCmu12Voltage,
        dcCmu13Voltage,
        setDcCmu13Voltage,
        dcCmu14Voltage,
        setDcCmu14Voltage,
        dcCmu15Voltage,
        setDcCmu15Voltage,
        dcCmu16Voltage,
        setDcCmu16Voltage
      }}
    >
      {children}
    </CmuVoltageContext.Provider>
  )
}

export { CmuVoltageContext, CmuVoltageProvider }
