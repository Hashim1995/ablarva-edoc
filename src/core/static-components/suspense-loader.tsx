import { Row, Space, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

function SuspenseLoader() {
  const antIcon = (
    <LoadingOutlined style={{ fontSize: 96 }} spin rev={undefined} />
  );
  return (
    <Row justify="center" align="middle" className="h-full">
      <Space className="text-center" direction="vertical" size="middle">
        <Spin indicator={antIcon} />
      </Space>
    </Row>
  );
}

export default SuspenseLoader;
