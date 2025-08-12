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
import { ConfigProvider } from 'antd'
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
                    colorBgContainer: darkMode ? geekblue[9] : geekblue[0],
                    colorText: darkMode ? 'rgba(255,255,255,0.88)' : 'rgba(0,0,0,0.88)',
                    colorTextQuaternary: darkMode ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
                    colorTextSecondary: darkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
                    colorTextTertiary: darkMode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',

                    colorBorder: darkMode ? geekblue[7] : geekblue[2],
                    colorBorderSecondary: darkMode ? geekblue[6] : geekblue[1],
                    colorSplit: darkMode ? geekblue[6] : geekblue[1]
                  },
                  components: {
                    Alert: darkMode
                      ? {
                          // Background colors
                          colorBgContainer: '#141414',
                          colorInfoBg: 'rgba(24,144,255,0.16)',
                          colorSuccessBg: 'rgba(82,196,26,0.16)',
                          colorWarningBg: 'rgba(250,173,20,0.16)',
                          colorErrorBg: 'rgba(255,77,79,0.16)',

                          // Text colors
                          colorText: 'rgba(255,255,255,0.88)',
                          colorInfoText: 'rgba(255,255,255,0.88)',
                          colorSuccessText: 'rgba(255,255,255,0.88)',
                          colorWarningText: 'rgba(255,255,255,0.88)',
                          colorErrorText: 'rgba(255,255,255,0.88)',

                          // Border colors
                          colorBorder: '#434343',
                          colorInfoBorder: '#177ddc',
                          colorSuccessBorder: '#49aa19',
                          colorWarningBorder: '#d89614',
                          colorErrorBorder: '#a61d24'
                        }
                      : {},
                    Modal: darkMode
                      ? {
                          contentBg: geekblue[9],
                          headerBg: geekblue[9]
                        }
                      : {
                          contentBg: geekblue[0],
                          headerBg: geekblue[0]
                        }
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
