import { geekblue } from '@ant-design/colors'
import { useState, createContext, useEffect } from 'react'
const DarkModeContext = createContext()

const DarkModeProvider = ({ children }) => {
  // modbus connection
  const [darkMode, setDarkMode] = useState(false)

  // Update body background color based on dark mode
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? geekblue[9] : geekblue[0]
  }, [darkMode])

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export { DarkModeContext, DarkModeProvider }
