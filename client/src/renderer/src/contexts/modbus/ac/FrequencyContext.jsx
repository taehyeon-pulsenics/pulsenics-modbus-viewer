import { useState, createContext } from 'react'
const FrequencyContext = createContext()

const FrequencyProvider = ({ children }) => {
  const [freqs, setFreqs] = useState([])

  return (
    <FrequencyContext.Provider
      value={{
        freqs,
        setFreqs
      }}
    >
      {children}
    </FrequencyContext.Provider>
  )
}

export { FrequencyContext, FrequencyProvider }
