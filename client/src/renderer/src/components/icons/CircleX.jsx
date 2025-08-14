import { geekblue, red } from '@ant-design/colors'
import Icon from '@ant-design/icons/lib/components/Icon'
import { forwardRef, useContext, useMemo } from 'react'
import { DarkModeContext } from '../../contexts/DarkModeContext'
import { CircleX as LucideIcon } from 'lucide-react'

const CircleX = forwardRef(function (props, ref) {
  const { darkMode } = useContext(DarkModeContext)

  const SvgComp = useMemo(
    () =>
      function SvgInner() {
        return (
          <LucideIcon
            fill={darkMode ? geekblue[9] : geekblue[0]}
            color={darkMode ? red[4] : red[5]}
          />
        )
      },
    [darkMode]
  )
  return <Icon ref={ref} component={SvgComp} {...props} />
})

CircleX.displayName = 'CircleX'

export default CircleX
