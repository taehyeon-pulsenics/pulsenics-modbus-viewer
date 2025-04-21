import React, { useState } from 'react'
import { Card, Button } from 'antd'
import { ChevronDown } from 'lucide-react'
import { CSSTransition } from 'react-transition-group'
import './CollapsibleCard.css'

const CollapsibleCard = ({ title, initiallyCollapsed = false, children, ...rest }) => {
  const [collapsed, setCollapsed] = useState(initiallyCollapsed)

  const handleToggle = () => {
    setCollapsed((prev) => !prev)
  }

  // Custom header that shows the title and the rotating chevron
  const customTitle = (
    <div className="card-header">
      <span>{title}</span>
      <Button size="small" type="link" onClick={handleToggle}>
        <ChevronDown className={`chevron-icon ${collapsed ? 'rotated' : ''}`} />
      </Button>
    </div>
  )

  return (
    <Card title={customTitle} {...rest}>
      <CSSTransition
        in={!collapsed}
        timeout={300}
        unmountOnExit
        classNames="collapsible-content"
        // These callbacks allow us to animate the height even though "auto" is not directly animatable.
        onEnter={(node) => {
          node.style.height = '0px'
          node.style.opacity = 0
        }}
        onEntering={(node) => {
          // Expand the node to its full height
          node.style.height = `${node.scrollHeight}px`
          node.style.opacity = 1
        }}
        onEntered={(node) => {
          // Reset to auto after the animation completes so the height adjusts naturally if the content changes.
          node.style.height = 'auto'
          node.style.opacity = 1
        }}
        onExit={(node) => {
          // Before collapsing, set explicit height
          node.style.height = `${node.scrollHeight}px`
          node.style.opacity = 1
        }}
        onExiting={(node) => {
          // Animate back to 0 height and opacity
          node.style.height = '0px'
          node.style.opacity = 0
        }}
      >
        <div className="collapsible-content">{children}</div>
      </CSSTransition>
    </Card>
  )
}

export default CollapsibleCard
