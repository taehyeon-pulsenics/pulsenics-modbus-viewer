import React, { forwardRef, useMemo } from 'react'
import Icon from '@ant-design/icons/lib/components/Icon'
import { CircleDashed as LucideIcon } from 'lucide-react'

const CircleDashed = forwardRef(function CircleDashed(props, ref) {
  const SvgComp = useMemo(
    () =>
      function SvgInner() {
        return <LucideIcon />
      },
    []
  )

  return <Icon ref={ref} component={SvgComp} {...props} />
})

CircleDashed.displayName = 'CircleDashed'

export default CircleDashed
