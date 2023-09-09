import { Row, Space, Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Title } = Typography;
const antIcon = (
  <LoadingOutlined style={{ fontSize: 64 }} spin rev={undefined} />
);
interface IProps {
  title: string;
}
function AuthLoader({ title }: IProps) {
  return (
    <Row justify="center" align="middle" className="h-full">
      <Space className="text-center" direction="vertical" size="middle">
        <Title level={3}>{title}</Title>
        <Spin indicator={antIcon} />
      </Space>
    </Row>
  );
}

export default AuthLoader;
