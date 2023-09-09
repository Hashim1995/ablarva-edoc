import { Col, Row, Space, theme, Typography } from 'antd';
import TokenizedIframe from '@/components/display/iframe';
import dayjs from 'dayjs';
import { convertBytesToReadableSize } from '@/utils/functions/functions';

const { Text } = Typography;

function ViewFileModal({ src }: { src: any }) {
  const { useToken } = theme;
  const { token } = useToken();

  return (
    <Row style={{ paddingTop: token.padding, paddingBottom: token.padding }}>
      <Col span={5}>
        <Space direction="vertical">
          <div>
            <div>
              <Text type="secondary">FILE NAME</Text>
            </div>
            <div>
              <Text>{src?.name}</Text>
            </div>
          </div>
          <div>
            <div>
              <Text type="secondary">FILE SIZE</Text>
            </div>
            <div>
              <Text>{convertBytesToReadableSize(src?.size)}</Text>
            </div>
          </div>
          <div>
            <div>
              <Text type="secondary">DATE</Text>
            </div>
            <div>
              <Text>
                {dayjs(src?.uploadDate).format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            </div>
          </div>
        </Space>
      </Col>
      <Col span={1} />
      <Col span={18}>
        <TokenizedIframe
          style={{ height: 450 }}
          className="w-full"
          src={src?.fileUrl}
          tokenized
        />
      </Col>
    </Row>
  );
}

export default ViewFileModal;
