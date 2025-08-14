import { geekblue, red } from '@ant-design/colors'
import Icon from '@ant-design/icons/lib/components/Icon'
import { forwardRef, useContext, useMemo } from 'react'
import { DarkModeContext } from '../../contexts/DarkModeContext'
import { CloudOff as LucideIcon } from 'lucide-react'

const CloudOff = forwardRef(function (props, ref) {
  const { darkMode } = useContext(DarkModeContext)

  const SvgComp = useMemo(
    () =>
      function SvgInner() {
        return <LucideIcon color={darkMode ? red[4] : red[5]} />
      },
    [darkMode]
  )
  return <Icon ref={ref} component={SvgComp} {...props} />
})

CloudOff.displayName = 'CloudOff'

export default CloudOff
