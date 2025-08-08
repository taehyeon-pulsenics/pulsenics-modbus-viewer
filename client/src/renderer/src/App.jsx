import { SocketProvider } from './contexts/SocketContext'
import { MultiContextProvider } from './contexts/MultiContext'
import { DarkModeContext, DarkModeProvider } from './contexts/DarkModeContext'
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
    <DarkModeProvider>
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
          <DarkModeContext.Consumer>
            {({ darkMode }) => (
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: darkMode ? geekblue[5] : geekblue[4],
                    borderRadius: 2,
                    colorBgContainer: darkMode ? geekblue[9] : geekblue[0],
                    colorText: darkMode ? '#fff' : '#000'
                  }
                }}
              >
                <MainView />
              </ConfigProvider>
            )}
          </DarkModeContext.Consumer>
        </SocketProvider>
      </MultiContextProvider>
    </DarkModeProvider>
  )
}

export default App
