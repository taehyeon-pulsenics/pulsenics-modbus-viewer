import { useState, createContext } from 'react'
const ClientMessageContext = createContext()

const ClientMessageProvider = ({ children }) => {
  const [clientMsg, setClientMsg] = useState('')

  return (
    <ClientMessageContext.Provider value={{ clientMsg, setClientMsg }}>
      {children}
    </ClientMessageContext.Provider>
  )
}

export { ClientMessageContext, ClientMessageProvider }
