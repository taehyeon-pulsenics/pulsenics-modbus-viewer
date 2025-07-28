import { useState, createContext } from 'react'
const ConnectedCmusContext = createContext()

const ConnectedCmusProvider = ({ children }) => {
  const [connectedCmus, setConnectedCmus] = useState(Array(16).fill(false))

  return (
    <ConnectedCmusContext.Provider
      value={{
        connectedCmus,
        setConnectedCmus
      }}
    >
      {children}
    </ConnectedCmusContext.Provider>
  )
}

export { ConnectedCmusContext, ConnectedCmusProvider }
