import { useState, createContext } from 'react'
const SampleCoilsContext = createContext()

const SampleCoilsProvider = ({ children }) => {
  const [sampleModeCoil, setSampleModeCoil] = useState(false) // false for Potentiostatic true for Galvanostatic
  const [startEISCoil, setStartEISCoil] = useState(false)
  const [interruptCoil, setInterruptCoil] = useState(false)

  return (
    <SampleCoilsContext.Provider
      value={{
        sampleModeCoil,
        setSampleModeCoil,
        startEISCoil,
        setStartEISCoil,
        interruptCoil,
        setInterruptCoil
      }}
    >
      {children}
    </SampleCoilsContext.Provider>
  )
}

export { SampleCoilsContext, SampleCoilsProvider }
