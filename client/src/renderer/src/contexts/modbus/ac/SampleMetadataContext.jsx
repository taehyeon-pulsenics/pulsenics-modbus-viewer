import { useState, createContext } from 'react'
const SampleMetadataContext = createContext()

const SampleMetadataProvider = ({ children }) => {
  const [dutId, setDutId] = useState('')
  const [triggerId, setTriggerId] = useState('')
  const [experimentId, setExperimentId] = useState('')
  const [metadata, setMetadata] = useState('')

  return (
    <SampleMetadataContext.Provider
      value={{
        dutId,
        setDutId,
        triggerId,
        setTriggerId,
        experimentId,
        setExperimentId,
        metadata,
        setMetadata
      }}
    >
      {children}
    </SampleMetadataContext.Provider>
  )
}

export { SampleMetadataContext, SampleMetadataProvider }
