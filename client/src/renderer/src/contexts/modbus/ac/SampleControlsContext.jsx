import { useState, createContext } from 'react'
const SampleControlsContext = createContext()

const SampleControlsProvider = ({ children }) => {
  const [minFreq, setMinFreq] = useState(0)
  const [maxFreq, setMaxFreq] = useState(0)
  const [amp, setAmp] = useState(0)
  const [nTotalFreqs, setNTotalFreqs] = useState(0)
  const [nSimulFreqs, setNSimulFreqs] = useState(0)

  return (
    <SampleControlsContext.Provider
      value={{
        minFreq,
        setMinFreq,
        maxFreq,
        setMaxFreq,
        amp,
        setAmp,
        nTotalFreqs,
        setNTotalFreqs,
        nSimulFreqs,
        setNSimulFreqs
      }}
    >
      {children}
    </SampleControlsContext.Provider>
  )
}

export { SampleControlsContext, SampleControlsProvider }
