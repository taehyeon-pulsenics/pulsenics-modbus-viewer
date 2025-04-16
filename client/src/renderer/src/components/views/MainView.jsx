import React from 'react'
import { Tabs, theme } from 'antd'
import StickyBox from 'react-sticky-box'
import { useSocket } from '../../contexts/SocketContext'
import DCView from './DCView'
import ProbeStatusView from './ProbeStatusView'
import ProbeACView from './ProbeACView'
import ErrorSignalsView from './ErrorSignalsView'

const items = [
  {
    key: '1',
    label: 'DC',
    children: <DCView />
  },
  {
    key: '2',
    label: 'Probe Status',
    children: <ProbeStatusView />
  },
  {
    key: '3',
    label: 'Probe AC',
    children: <ProbeACView />
  },
  {
    key: '10',
    label: 'Error Signals',
    children: <ErrorSignalsView />
  }
]

const MainView = () => {
  useSocket()
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  const renderTabBar = (props, DefaultTabBar) => (
    <StickyBox offsetTop={0} offsetBottom={0} style={{ zIndex: 1 }}>
      <DefaultTabBar {...props} style={{ background: colorBgContainer }} />
    </StickyBox>
  )

  return <Tabs defaultActiveKey="1" items={items} renderTabBar={renderTabBar} />
}

export default MainView
