import Icon from '@ant-design/icons/lib/components/Icon'
import { forwardRef, useMemo } from 'react'
import { Search as LucideIcon } from 'lucide-react'

const Search = forwardRef(function (props, ref) {
  const SvgComp = useMemo(
    () =>
      function SvgInner() {
        return <LucideIcon />
      },
    []
  )
  return <Icon ref={ref} component={SvgComp} {...props} />
})

Search.displayName = 'Search'

export default Search
