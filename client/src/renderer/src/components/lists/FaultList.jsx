import { List, Space, Tooltip, Typography } from 'antd'
import CircleFilled from '../icons/CircleFilled'
import CircleDashed from '../icons/CircleDashed'

const FaultList = ({ dataSource }) => {
  return (
    <List
      dataSource={dataSource}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Tooltip title={<FaultDescriptor details={item.details} />}>
                {item.data ? <CircleFilled /> : <CircleDashed />}
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
      <Typography.Text type="danger">{details}</Typography.Text>
    </Space>
  )
}

export default FaultList
