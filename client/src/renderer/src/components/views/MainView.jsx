import React from 'react'
import { Tabs } from 'antd'
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

  return <Tabs defaultActiveKey="1" items={items} />
}

export default MainView
