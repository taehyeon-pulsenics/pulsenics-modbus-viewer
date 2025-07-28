import { useState, createContext } from 'react'
const FaultsContext = createContext()

const FaultsProvider = ({ children }) => {
  // error signals
  const [criticalFault, setCriticalFault] = useState(false)
  const [generalFault, setGeneralFault] = useState(false)
  const [dutOvervoltageFault, setDutOvervoltageFault] = useState(false)
  const [dutUndervoltageFault, setDutUndervoltageFault] = useState(false)
  const [transientDetected, setTransientDetected] = useState(false)
  const [overTemperatureDetected, setOverTemperatureDetected] = useState(false)
  const [gridConnectionFault, setGridConnectionFault] = useState(false)
  const [openCircultDetected, setOpenCircultDetected] = useState(false)
  const [overPowerLimitDetected, setOverPowerLimitDetected] = useState(false)
  const [overCurrentLimitDetected, setOverCurrentLimitDetected] = useState(false)
  const [eisControlError, setEisControlError] = useState(false)
  const [eStopPreventingSample, setEStopPreventingSample] = useState(false)
  const [dutForcedDisconnectModePreventingSample, setDutForcedDisconnectModePreventingSample] =
    useState(false)
  const [fullDisconnectModePreventingSample, setFullDisconnectModePreventingSample] =
    useState(false)
  const [lowerPowerModePreventingSample, setLowerPowerModePreventingSample] = useState(false)
  const [eisEnableSwitchOffPreventingSample, setEisEnableSwitchOffPreventingSample] =
    useState(false)
  const [reversePolarityDetected, setReversePolarityDetected] = useState(false)
  const [inputOverloadDetected, setInputOverloadDetected] = useState(false)

  return (
    <FaultsContext.Provider
      value={{
        criticalFault,
        setCriticalFault,
        generalFault,
        setGeneralFault,
        dutOvervoltageFault,
        setDutOvervoltageFault,
        dutUndervoltageFault,
        setDutUndervoltageFault,
        transientDetected,
        setTransientDetected,
        overTemperatureDetected,
        setOverTemperatureDetected,
        gridConnectionFault,
        setGridConnectionFault,
        openCircultDetected,
        setOpenCircultDetected,
        overPowerLimitDetected,
        setOverPowerLimitDetected,
        overCurrentLimitDetected,
        setOverCurrentLimitDetected,
        eisControlError,
        setEisControlError,
        eStopPreventingSample,
        setEStopPreventingSample,
        dutForcedDisconnectModePreventingSample,
        setDutForcedDisconnectModePreventingSample,
        fullDisconnectModePreventingSample,
        setFullDisconnectModePreventingSample,
        lowerPowerModePreventingSample,
        setLowerPowerModePreventingSample,
        eisEnableSwitchOffPreventingSample,
        setEisEnableSwitchOffPreventingSample,
        reversePolarityDetected,
        setReversePolarityDetected,
        inputOverloadDetected,
        setInputOverloadDetected
      }}
    >
      {children}
    </FaultsContext.Provider>
  )
}

export { FaultsContext, FaultsProvider }
