import React, { useEffect, useState } from 'react'
import { Layout, Tabs, theme, Button, Affix, Alert, Typography } from 'antd'
import StickyBox from 'react-sticky-box'
import { useSocket } from '../../contexts/SocketContext'
import DCView from './DCView'
import ProbeStatusView from './ProbeStatusView'
import ProbeACView from './ProbeACView'
import ErrorSignalsView from './ErrorSignalsView'
import MiscView from './MiscView'
import SettingModal from '../modals/SettingModal'
import { Settings2 } from 'lucide-react'
import { blue } from '@ant-design/colors'
import axios from 'axios'

const { Header, Content } = Layout

const items = [
  { key: '1', label: 'DC', children: <DCView /> },
  { key: '2', label: 'Probe Status', children: <ProbeStatusView /> },
  { key: '3', label: 'Probe AC', children: <ProbeACView /> },
  { key: '4', label: 'Error Signals', children: <ErrorSignalsView /> },
  { key: '5', label: 'Misc', children: <MiscView /> }
]

const MainView = () => {
  const { socket } = useSocket()
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showIpAddressChangeAlert, setShowIpAddressChangeAlert] = useState(false)
  const [ipAddress, setIpAddress] = useState('')

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
  const handleIpChange = (newIp) => {
    setIpAddress(newIp)
    socket.emit('change ip', newIp)
    handleCancel()

    setShowIpAddressChangeAlert(true)
    setTimeout(() => {
      setShowIpAddressChangeAlert(false)
    }, 5000)
  }

  /**
   * Useeffect for fetching initial ip address
   */
  useEffect(() => {
    const fetchIp = async () => {
      const { data } = await axios.get('http://localhost:3000/ip')

      if (data) {
        setIpAddress(data)
      }
    }

    fetchIp()
  }, [])

  const renderTabBar = (props, DefaultTabBar) => (
    <StickyBox offsetTop={60} offsetBottom={0} style={{ zIndex: 1 }}>
      <DefaultTabBar {...props} style={{ background: colorBgContainer }} />
      {showIpAddressChangeAlert && (
        <Alert
          message={`Ip Address Changed to ${ipAddress}`}
          type="success"
          closable
          afterClose={() => setShowIpAddressChangeAlert(false)}
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
            <Typography.Title>Probe @ {ipAddress}</Typography.Title>
            <Button
              style={{ marginLeft: 'auto' }}
              type="text"
              icon={<Settings2 />}
              onClick={showModal}
            />
          </Header>
        </Affix>
        <Content style={{ background: colorBgContainer }}>
          <Tabs defaultActiveKey="1" items={items} renderTabBar={renderTabBar} />
        </Content>
      </Layout>
      <SettingModal
        open={isModalOpen}
        onCancel={handleCancel}
        ipAddress={ipAddress}
        onIpChange={handleIpChange}
      />
    </>
  )
}

export default MainView
