import Icon from '@ant-design/icons/lib/components/Icon'
import { useContext } from 'react'
import { DarkModeContext } from '../../contexts/DarkModeContext'
import { CircleCheck as LucideIcon } from 'lucide-react'
import { green } from '@ant-design/colors'

const CircleCheck = () => {
  const { darkMode } = useContext(DarkModeContext)

  return <Icon component={() => <LucideIcon color={darkMode ? green[4] : green[5]} />} />
}

export default CircleCheck
