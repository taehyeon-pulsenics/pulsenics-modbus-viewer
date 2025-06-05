import React, { useContext } from 'react'
import { ModbusContext } from '../../contexts/ModbusContext'
import { Space } from 'antd'
import ACView from './subviews/ACView'

const ACDataView = () => {
  const { freqs, currMag, currPha, probeVoltageMag, probeVoltagePha } = useContext(ModbusContext)

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <ACView
        frequencies={freqs}
        currMags={currMag}
        currPhases={currPha}
        volMags={probeVoltageMag}
        volPhases={probeVoltagePha}
      />
    </Space>
  )
}

export default ACDataView
