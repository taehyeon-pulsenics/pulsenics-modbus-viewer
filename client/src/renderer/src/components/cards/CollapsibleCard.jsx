import { Collapse } from 'antd'

const CollapsibleCard = ({ title, initiallyCollapsed = false, children, ...rest }) => {
  return (
    <Collapse
      {...rest}
      items={[
        {
          key: '1',
          label: title,
          children: <div>{children}</div>
        }
      ]}
      defaultActiveKey={initiallyCollapsed ? [] : ['1']}
    />
  )
}

export default CollapsibleCard
