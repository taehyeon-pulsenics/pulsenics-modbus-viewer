import { List, Typography } from 'antd'
import CircleX from '../icons/CircleX'
import CircleCheck from '../icons/CircleCheck'

const BooleanList = ({ dataSource }) => {
  return (
    <List
      dataSource={dataSource}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={item.data ? <CircleCheck /> : <CircleX />}
            title={<Typography.Text>{item.title}</Typography.Text>}
          />
        </List.Item>
      )}
    />
  )
}

export default BooleanList
