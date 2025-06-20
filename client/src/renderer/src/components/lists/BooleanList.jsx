import { List, Typography } from 'antd'
import { CircleCheck, CircleX } from 'lucide-react'

const BooleanList = ({ dataSource }) => {
  return (
    <List
      dataSource={dataSource}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={item.data ? <CircleCheck color="green" /> : <CircleX color="red" />}
            title={<Typography.Text>{item.title}</Typography.Text>}
          />
        </List.Item>
      )}
    />
  )
}

export default BooleanList
