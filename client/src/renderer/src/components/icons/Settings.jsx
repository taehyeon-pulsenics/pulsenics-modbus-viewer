import Icon from '@ant-design/icons/lib/components/Icon'
import { forwardRef, useMemo } from 'react'
import { Settings2 as LucideIcon } from 'lucide-react'

const Settings = forwardRef(function (props, ref) {
  const SvgComp = useMemo(
    () =>
      function SvgInner() {
        return <LucideIcon />
      },
    []
  )
  return <Icon ref={ref} component={SvgComp} {...props} />
})

Settings.displayName = 'Settings'

export default Settings
