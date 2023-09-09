import { Col, Row, Typography, theme } from 'antd';
import dayjs from 'dayjs';
import { dictionary } from '@/utils/constants/dictionary';
import { IEdcChangeLogListItem } from '../../models';

interface IChangeLogMessageModalProps {
  item?: IEdcChangeLogListItem;
}

function ChangeLogMessageModal({ item }: IChangeLogMessageModalProps) {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <div>
      <Row className="w-full">
        <Col span={12}>
          <Typography.Paragraph
            style={{
              color: token.colorTextSecondary
            }}
          >
            {dictionary.en.user}
          </Typography.Paragraph>
        </Col>
        <Col span={12}>
          <Typography.Paragraph strong>{item?.userName}</Typography.Paragraph>
        </Col>
      </Row>
      <Row className="w-full">
        <Col span={12}>
          <Typography.Paragraph
            style={{
              color: token.colorTextSecondary
            }}
          >
            {dictionary.en.appointment}
          </Typography.Paragraph>
        </Col>
        <Col span={12}>
          <Typography.Paragraph strong>
            {item?.appointment}
          </Typography.Paragraph>
        </Col>
      </Row>
      <Row className="w-full">
        <Col span={12}>
          <Typography.Paragraph
            style={{
              color: token.colorTextSecondary
            }}
          >
            {dictionary.en.date}
          </Typography.Paragraph>
        </Col>
        <Col span={12}>
          <Typography.Paragraph strong>
            {dayjs(item?.date).format('DD.MM.YYYY HH:mm:ss')}
          </Typography.Paragraph>
        </Col>
      </Row>
      <Row className="w-full">
        <Col span={12}>
          <Typography.Paragraph
            style={{
              color: token.colorTextSecondary
            }}
          >
            {dictionary.en.reason}
          </Typography.Paragraph>
        </Col>
        <Col span={12}>
          <Typography.Paragraph strong>{item?.message}</Typography.Paragraph>
        </Col>
      </Row>
    </div>
  );
}

export default ChangeLogMessageModal;
