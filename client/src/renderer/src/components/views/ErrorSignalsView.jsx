import React, { useContext } from 'react'
import { ModbusContext } from '../../contexts/ModbusContext'
import { List, Space, Typography } from 'antd'
import CollapsibleCard from '../cards/CollapsibleCard'
import { CircleCheck, CircleX } from 'lucide-react'
import { useSocket } from '../../contexts/SocketContext'

const ErrorSignalsView = () => {
  const {
    criticalFault,
    generalFault,
    dutOvervoltageFault,
    dutUndervoltageFault,
    transientDetected,
    overTemperatureDetected,
    gridConnectionFault,
    openCircultDetected,
    overPowerLimitDetected,
    overCurrentLimitDetected,
    eisControlError,
    eStopPreventingSample,
    dutForcedDisconnectModePreventingSample,
    fullDisconnectModePreventingSample,
    lowerPowerModePreventingSample,
    sampleFailed
  } = useContext(ModbusContext)
  const { config } = useSocket()

  const signals = [
    {
      onErrorText: 'Critical Fault!',
      data: criticalFault,
      details:
        'A critical fault has occurred affecting the Probe’s ability to conduct EIS. Contact Pulsenics for support. '
    },
    {
      onErrorText: 'General Fault!',
      data: generalFault,
      details:
        'A fault has occurred which is preventing the Probe from sampling. See faults below for details.'
    },
    {
      onErrorText: 'DUT Overvoltage Fault!',
      data: dutOvervoltageFault,
      details:
        'The Probe has measured a voltage above the specified overvoltage limit. Ensure the DUT voltage is stationary and within the device specifications, and the DUT Overvoltage limit is set correctly.'
    },
    {
      onErrorText: 'DUT Undervoltage Fault!',
      data: dutUndervoltageFault,
      details:
        'The Probe has measured a voltage below the specified undervoltage limit. Ensure the DUT voltage is stationary and within the device specifications, and the DUT Undervoltage limit is set correctly.'
    },
    {
      onErrorText: 'Transient Detected!',
      data: transientDetected,
      details:
        'The Probe has detected a transient in the current through the DUT, preventing EIS. Ensure the DUT current is stationary during Probe Sampling.'
    },
    {
      onErrorText: 'Over Temperature!',
      data: overTemperatureDetected,
      details:
        'The Probe’s internal temperature is above a safe level. Ensure the Probe fans are not obstructed and air may freely flow through the Probe, the current through the DUT is within the specifications, and the Probe’s operating temperature is within the specifications.'
    },
    {
      onErrorText: 'Grid Connection Failure!',
      data: gridConnectionFault,
      details:
        'The Probe cannot draw the required power from the power grid. Ensure that the Probe’s AC connection follows the specifications.'
    },
    {
      onErrorText: 'Open Circuit Detected!',
      data: openCircultDetected,
      details:
        'The Probe is not able to drive current through the DUT. Check that the DUT is properly connected to the DUT+ and DUT- terminals. '
    },
    {
      onErrorText: 'Over Power Limit!',
      data: overPowerLimitDetected,
      details:
        'The Probe is drawing too much power. Ensure the DUT voltage and current are stable, and the DUT Over Power limit is set correctly. Try a lower current amplitude to reduce the power draw. '
    },
    {
      onErrorText: 'Over Current Limit!',
      data: overCurrentLimitDetected,
      details:
        'The Probe’s output current has exceeded the specified over current limit. Ensure the DUT current is stationary, and the DUT Over Current limit is set correctly. Try a lower number of simultaneous frequencies, or current amplitude. '
    },
    {
      onErrorText: 'EIS Control Error',
      data: eisControlError,
      details:
        'An invalid value has been entered for the EIS Controls (minimum frequency, maximum frequency, amplitude, number of frequencies, or number of simultaneous frequencies).  '
    },
    {
      onErrorText: 'E-Stop Preventing Sample!',
      data: eStopPreventingSample,
      details:
        'The Probe’s E-Stop mode is on, preventing sampling. Ensure the Idle Mode switch on the front of the Probe in the On position.'
    },
    {
      onErrorText: 'DUT Forced Disconnect Mode Preventing Sample!',
      data: dutForcedDisconnectModePreventingSample,
      details: 'The Probe’s DUT Forced Disconnect mode is on, preventing sampling.'
    },
    {
      onErrorText: 'Full Disconnect Mode Preventing Sample!',
      data: fullDisconnectModePreventingSample,
      details: 'The Probe’s Full Disconnect mode is on, preventing sampling.'
    },
    {
      onErrorText: 'Low Power Mode Preventing Sample!',
      data: lowerPowerModePreventingSample,
      details: 'The Probe’s Low Power mode is on, preventing sampling.'
    }
  ]

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      {!config.legacy && (
        <p>
          Sample Failed: {sampleFailed ? <CircleCheck color="green" /> : <CircleX color="red" />}
        </p>
      )}

      <CollapsibleCard size="small" title="Error Signals">
        <List
          bordered
          dataSource={signals}
          renderItem={(item) =>
            item.data && (
              <List.Item>
                <CircleX color="red" size={12} />{' '}
                <Typography.Text type="danger">{item.onErrorText}</Typography.Text>
                <div>{item.details}</div>
              </List.Item>
            )
          }
        />
      </CollapsibleCard>
    </Space>
  )
}

export default ErrorSignalsView
