import { useState, createContext } from 'react'
const CurrentContext = createContext()

const CurrentProvider = ({ children }) => {
  const [dcCurrent, setDcCurrent] = useState(0)

  return (
    <CurrentContext.Provider value={{ dcCurrent, setDcCurrent }}>
      {children}
    </CurrentContext.Provider>
  )
}

export { CurrentContext, CurrentProvider }
