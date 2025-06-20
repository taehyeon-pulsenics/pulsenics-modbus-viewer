import { List, Space, Tooltip, Typography } from 'antd'
import { CircleDashed, CircleSlash } from 'lucide-react'

const FaultList = ({ dataSource }) => {
  return (
    <List
      dataSource={dataSource}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Tooltip title={<FaultDescriptor details={item.details} />}>
                {item.data ? <CircleSlash color="red" /> : <CircleDashed />}
              </Tooltip>
            }
            title={<Typography.Text>{item.title}</Typography.Text>}
          />
        </List.Item>
      )}
    />
  )
}

const FaultDescriptor = ({ details }) => {
  return (
    <Space direction="vertical">
      <Typography.Text type="danger">
        When <CircleSlash color="red" size={14} /> :
      </Typography.Text>
      <Typography.Text type="danger">{details}</Typography.Text>
    </Space>
  )
}

export default FaultList
