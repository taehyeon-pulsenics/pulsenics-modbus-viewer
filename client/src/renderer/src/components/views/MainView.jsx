import { useState, useContext } from 'react'
import { Layout, Tabs, theme, Button, Affix, Alert, Typography } from 'antd'
import StickyBox from 'react-sticky-box'
import { useSocket } from '../../contexts/SocketContext'
import DCDataView from './DCDataView'
import ProbeStatusView from './ProbeStatusView'
import ACDataView from './ACDataView'
import ErrorSignalsView from './ErrorSignalsView'
import MiscView from './MiscView'
import ModbusConErrorView from './ModbusConErrorView'
import SettingModal from '../modals/SettingModal'
import { Settings2 } from 'lucide-react'
import { blue } from '@ant-design/colors'

import './MainView.css'
import { ModbusContext } from '../../contexts/ModbusContext'
import FocusedView from './FocusedView'

const { Header, Content } = Layout

const items = [
  { key: '0', label: 'Focused', children: <FocusedView /> },
  { key: '1', label: 'Probe Status', children: <ProbeStatusView /> },
  { key: '2', label: 'DC Data', children: <DCDataView /> },
  { key: '3', label: 'AC Data', children: <ACDataView /> },
  { key: '4', label: 'Error Signals', children: <ErrorSignalsView /> },
  { key: '5', label: 'Misc', children: <MiscView /> }
]

const MainView = () => {
  const { config } = useSocket()
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  const { modbusConnected } = useContext(ModbusContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showUpdatedAlert, setShowUpdatedAlert] = useState(false)

  /**
   * Modal Control Functions
   */
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  /**
   * Helper functions for Settings Modal
   */
  const handleSubmit = () => {
    handleOk()

    setShowUpdatedAlert(true)
    setTimeout(() => {
      setShowUpdatedAlert(false)
    }, 5000)
  }

  const renderTabBar = (props, DefaultTabBar) => (
    <StickyBox offsetTop={60} offsetBottom={0} style={{ zIndex: 1 }}>
      <DefaultTabBar {...props} style={{ background: colorBgContainer }} />
      {showUpdatedAlert && (
        <Alert
          message={`Config Saved Successfully`}
          type="success"
          closable
          afterClose={() => setShowUpdatedAlert(false)}
        />
      )}
    </StickyBox>
  )

  return (
    <>
      <Layout style={{ height: '100%' }}>
        <Affix offsetTop={0}>
          <Header
            style={{
              background: blue[4],
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: '0 16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            <Typography.Title>Probe @ {config.probeIp}</Typography.Title>
            <Button
              style={{ marginLeft: 'auto' }}
              type="text"
              icon={<Settings2 />}
              onClick={showModal}
            />
          </Header>
        </Affix>

        <Content style={{ background: colorBgContainer }}>
          {modbusConnected ? (
            <Tabs defaultActiveKey="0" items={items} renderTabBar={renderTabBar} />
          ) : (
            <ModbusConErrorView />
          )}
        </Content>
      </Layout>
      <SettingModal open={isModalOpen} onCancel={handleCancel} onSubmit={handleSubmit} />
    </>
  )
}

export default MainView
