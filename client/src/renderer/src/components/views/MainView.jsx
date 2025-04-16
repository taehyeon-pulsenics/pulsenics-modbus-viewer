import React from 'react'
import { Tabs, theme } from 'antd'
import StickyBox from 'react-sticky-box'
import { useSocket } from '../../contexts/SocketContext'
import DCView from './DCView'
import ProbeStatusView from './ProbeStatusView'
import ProbeACView from './ProbeACView'

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
    key: '4',
    label: 'Tab 4',
    children: 'Content of Tab Pane 4'
  },
  {
    key: '5',
    label: 'Tab 5',
    children: 'Content of Tab Pane 5'
  },
  {
    key: '6',
    label: 'Tab 6',
    children: 'Content of Tab Pane 6'
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
