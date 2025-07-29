import { useState, createContext } from 'react'
const ProbeInformationContext = createContext()

const ProbeInformationProvider = ({ children }) => {
  const [probeSn, setProbeSn] = useState('')
  const [modbusVersion, setModbusVersion] = useState('')

  return (
    <ProbeInformationContext.Provider
      value={{
        probeSn,
        setProbeSn,
        modbusVersion,
        setModbusVersion
      }}
    >
      {children}
    </ProbeInformationContext.Provider>
  )
}

export { ProbeInformationContext, ProbeInformationProvider }
