import { useState, createContext } from 'react'
const CurrentContext = createContext()

const CurrentProvider = ({ children }) => {
  const [acCurrentMagnitude, setAcCurrentMagnitude] = useState([])
  const [acCurrentPhase, setAcCurrentPhase] = useState([])

  return (
    <CurrentContext.Provider
      value={{ acCurrentMagnitude, setAcCurrentMagnitude, acCurrentPhase, setAcCurrentPhase }}
    >
      {children}
    </CurrentContext.Provider>
  )
}

export { CurrentContext, CurrentProvider }
