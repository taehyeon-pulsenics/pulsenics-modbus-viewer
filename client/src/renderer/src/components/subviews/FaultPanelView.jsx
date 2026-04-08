import { Row, Col } from 'antd'
import { useModbusStore } from '../../store/modbusStore'
import CollapsibleCard from '../cards/CollapsibleCard'
import FaultList from '../lists/FaultList'

const FaultPanelView = () => {
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
    eisEnableSwitchOffPreventingSample,
    reversePolarityDetected,
    inputOverloadDetected
  } = useModbusStore((s) => s.faults)

  const signals = [
    {
      title: 'Critical Fault',
      data: criticalFault,
      details:
        'A critical fault has occurred affecting the Probe’s ability to conduct EIS. Contact Pulsenics for support. '
    },
    {
      title: 'General Fault',
      data: generalFault,
      details:
        'A fault has occurred which is preventing the Probe from sampling. See faults below for details.'
    },
    {
      title: 'DUT Overvoltage Fault',
      data: dutOvervoltageFault,
      details:
        'The Probe has measured a voltage above the specified overvoltage limit. Ensure the DUT voltage is stationary and within the device specifications, and the DUT Overvoltage limit is set correctly.'
    },
    {
      title: 'DUT Undervoltage Fault',
      data: dutUndervoltageFault,
      details:
        'The Probe has measured a voltage below the specified undervoltage limit. Ensure the DUT voltage is stationary and within the device specifications, and the DUT Undervoltage limit is set correctly.'
    },
    {
      title: 'Transient Detected',
      data: transientDetected,
      details:
        'The Probe has detected a transient in the current through the DUT, preventing EIS. Ensure the DUT current is stationary during Probe Sampling.'
    },
    {
      title: 'Over Temperature',
      data: overTemperatureDetected,
      details:
        'The Probe’s internal temperature is above a safe level. Ensure the Probe fans are not obstructed and air may freely flow through the Probe, the current through the DUT is within the specifications, and the Probe’s operating temperature is within the specifications.'
    },
    {
      title: 'Grid Connection Failure',
      data: gridConnectionFault,
      details:
        'The Probe cannot draw the required power from the power grid. Ensure that the Probe’s AC connection follows the specifications.'
    },
    {
      title: 'Open Circuit Detected',
      data: openCircultDetected,
      details:
        'The Probe is not able to drive current through the DUT. Check that the DUT is properly connected to the DUT+ and DUT- terminals. '
    },
    {
      title: 'Over Power Limit',
      data: overPowerLimitDetected,
      details:
        'The Probe is drawing too much power. Ensure the DUT voltage and current are stable, and the DUT Over Power limit is set correctly. Try a lower current amplitude to reduce the power draw. '
    },
    {
      title: 'Over Current Limit',
      data: overCurrentLimitDetected,
      details:
        'The Probe’s output current has exceeded the specified over current limit. Ensure the DUT current is stationary, and the DUT Over Current limit is set correctly. Try a lower number of simultaneous frequencies, or current amplitude. '
    },
    {
      title: 'EIS Control Error',
      data: eisControlError,
      details:
        'An invalid value has been entered for the EIS Controls (minimum frequency, maximum frequency, amplitude, number of frequencies, or number of simultaneous frequencies).  '
    },
    {
      title: 'E-Stop Preventing Sample',
      data: eStopPreventingSample,
      details:
        'The Probe’s E-Stop mode is on, preventing sampling. Ensure the Idle Mode switch on the front of the Probe in the On position.'
    },
    {
      title: 'DUT Forced Disconnect Mode Preventing Sample',
      data: dutForcedDisconnectModePreventingSample,
      details: 'The Probe’s DUT Forced Disconnect mode is on, preventing sampling.'
    },
    {
      title: 'Full Disconnect Mode Preventing Sample',
      data: fullDisconnectModePreventingSample,
      details: 'The Probe’s Full Disconnect mode is on, preventing sampling.'
    },
    {
      title: 'Low Power Mode Preventing Sample',
      data: lowerPowerModePreventingSample,
      details: 'The Probe’s Low Power mode is on, preventing sampling.'
    }
  ]

  // Split into two roughly equal columns
  const mid = Math.ceil(signals.length / 2)
  const left = signals.slice(0, mid)
  const right = signals.slice(mid)

  return (
    <CollapsibleCard size="small" title="Error Signals">
      <Row gutter={16}>
        <Col span={12}>
          <FaultList dataSource={left} />
        </Col>
        <Col span={12}>
          <FaultList dataSource={right} />
        </Col>
      </Row>
    </CollapsibleCard>
  )
}

export default FaultPanelView
