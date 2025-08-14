import { green } from '@ant-design/colors'
import Icon from '@ant-design/icons/lib/components/Icon'
import { forwardRef, useContext, useMemo } from 'react'
import { DarkModeContext } from '../../contexts/DarkModeContext'
import { Cloud as LucideIcon } from 'lucide-react'

const Cloud = forwardRef(function (props, ref) {
  const { darkMode } = useContext(DarkModeContext)

  const SvgComp = useMemo(
    () =>
      function SvgInner() {
        return <LucideIcon color={darkMode ? green[4] : green[5]} />
      },
    [darkMode]
  )
  return <Icon ref={ref} component={SvgComp} {...props} />
})

Cloud.displayName = 'Cloud'

export default Cloud
