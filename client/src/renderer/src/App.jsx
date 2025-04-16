import { ModbusProvider } from '../src/contexts/ModbusContext'
import { SocketProvider } from './contexts/SocketContext'
import MainView from './components/views/MainView'

const App = () => {
  return (
    <ModbusProvider>
      <SocketProvider>
        <MainView />
      </SocketProvider>
    </ModbusProvider>
  )
}

export default App
