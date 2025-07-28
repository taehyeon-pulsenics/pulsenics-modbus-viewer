import { useState, createContext } from 'react'
const SampleStatusContext = createContext()

const SampleStatusProvider = ({ children }) => {
  const [sampleStarted, setSampleStarted] = useState(false)
  const [sampleCompleted, setSampleCompleted] = useState(false)
  const [sampleReceived, setSampleReceived] = useState(false)
  const [sampleFailed, setSampleFailed] = useState(false)

  return (
    <SampleStatusContext.Provider
      value={{
        sampleStarted,
        setSampleStarted,
        sampleCompleted,
        setSampleCompleted,
        sampleReceived,
        setSampleReceived,
        sampleFailed,
        setSampleFailed
      }}
    >
      {children}
    </SampleStatusContext.Provider>
  )
}

export { SampleStatusContext, SampleStatusProvider }
