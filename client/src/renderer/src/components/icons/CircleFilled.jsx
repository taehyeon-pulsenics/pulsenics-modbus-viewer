import React, { forwardRef, useContext, useMemo } from 'react'
import { geekblue, red } from '@ant-design/colors'
import Icon from '@ant-design/icons/lib/components/Icon'
import { DarkModeContext } from '../../contexts/DarkModeContext'
import { CircleSlash as LucideIcon } from 'lucide-react'

const CircleFilled = forwardRef(function CircleFilled(props, ref) {
  const { darkMode } = useContext(DarkModeContext)

  // Stable SVG component for Icon.component (avoid re-creating every render)
  const SvgComp = useMemo(
    () =>
      // NOTE: Icon.component expects a component that renders an <svg>
      // It will pass standard svg props; we forward them through.
      function SvgInner() {
        return (
          <LucideIcon
            color={darkMode ? geekblue[9] : geekblue[0]}
            fill={darkMode ? red[4] : red[5]}
          />
        )
      },
    [darkMode]
  )

  // Forward the ref to the outer <span role="img"> rendered by AntD Icon
  return <Icon ref={ref} component={SvgComp} {...props} />
})

CircleFilled.displayName = 'CircleFilled'

export default CircleFilled
