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
import { ConfigProvider, theme } from 'antd'
import { geekblue } from '@ant-design/colors'

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
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: geekblue[4],
              borderRadius: 2,

              colorBgContainer: geekblue[0]
            }
          }}
        >
          <MainView />
        </ConfigProvider>
      </SocketProvider>
    </MultiContextProvider>
  )
}

export default App
