import { SocketProvider } from './contexts/SocketContext'
import { MultiContextProvider } from './contexts/MultiContext'
import {
  FaultsProvider,
  ProbeInformationProvider,
  AcCurrentProvider,
  DcCurrentProvider,
  AcFrequencyProvider,
  SampleCoilsProvider,
  AcCmuVoltageProvider,
  DcCmuVoltageProvider,
  SampleStatusProvider,
  ClientMessageProvider,
  ConnectedCmusProvider,
  AcProbeVoltageProvider,
  DcProbeVoltageProvider,
  SampleControlsProvider,
  SampleMetadataProvider,
  ModbusConnectionProvider
} from './contexts/modbus'
import MainView from './components/views/MainView'

const App = () => {
  return (
    <MultiContextProvider
      providersList={[
        FaultsProvider,
        ProbeInformationProvider,
        AcCurrentProvider,
        DcCurrentProvider,
        AcFrequencyProvider,
        SampleCoilsProvider,
        AcCmuVoltageProvider,
        DcCmuVoltageProvider,
        SampleStatusProvider,
        ClientMessageProvider,
        ConnectedCmusProvider,
        AcProbeVoltageProvider,
        DcProbeVoltageProvider,
        SampleControlsProvider,
        SampleMetadataProvider,
        ModbusConnectionProvider
      ]}
    >
      <SocketProvider>
        <MainView />
      </SocketProvider>
    </MultiContextProvider>
  )
}

export default App
