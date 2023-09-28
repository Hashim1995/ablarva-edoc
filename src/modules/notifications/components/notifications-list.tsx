import { dictionary } from '@/utils/constants/dictionary';
import { useState, useEffect } from 'react';
import {
  Avatar,
  Breadcrumb,
  Card,
  Col,
  Row,
  Space,
  Spin,
  Typography,
  theme
} from 'antd';
import { HomeOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AppPagination from '@/components/display/pagination';
import { NotificationServices } from '@/services/notification-services/notification-services';
import notificationSocket from '@/redux/notification-socket';
import AppEmpty from '@/components/display/empty';
import { formatDateToWords } from '@/utils/functions/functions';
import {
  IGetNotificationsListResponse,
  INotificationsListItem
} from '../models';

function NotificationsList() {
  const { useToken } = theme;
  const { token } = useToken();
  const [page, setCurrentPage] = useState<number>(1);
  const [notifications, setNotifications] =
    useState<IGetNotificationsListResponse>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchNotificationsList = async () => {
    setLoading(true);

    const res: IGetNotificationsListResponse =
      await NotificationServices.getInstance().getAllNotifications(
        [{ name: 'page', value: page }],
        () => setLoading(false)
      );

    if (res.IsSuccess) {
      setNotifications(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotificationsList();
  }, [page]);

  useEffect(() => {
    notificationSocket.on('Receiver', data => {
      data && fetchNotificationsList();
    });
  }, []);

  return (
    <div>
      <div>
        <Card size="small" className="box box-margin-y">
          <Row justify="space-between">
            <Breadcrumb
              items={[
                {
                  title: (
                    <Link to="/home">
                      <HomeOutlined rev={undefined} />
                    </Link>
                  )
                },
                {
                  title: dictionary.en.notifications
                }
              ]}
            />
          </Row>
        </Card>

        <Card size="small" className="box box-margin-y">
          <Typography.Text type="secondary">
            {dictionary.en.notifications} (
            {notifications?.Data?.TotalDataCount ?? 0})
          </Typography.Text>
          <Spin size="large" spinning={loading}>
            {notifications?.Data?.Datas.length ? (
              notifications?.Data.Datas.map((t: INotificationsListItem) => (
                <Card key={t.Id} className="box-margin-y">
                  <Link to={`/edc/view-contract/${t.DocumentId}`}>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Space size="large">
                          <Avatar
                            style={{
                              backgroundColor: token.colorPrimaryBg,
                              color: token.colorPrimary
                            }}
                            icon={<FileTextOutlined rev={undefined} />}
                          />
                          <Typography.Text
                            ellipsis
                            strong
                            style={{ whiteSpace: 'normal' }}
                          >
                            {' '}
                            {t.Message ?? dictionary.en.noDataText}
                          </Typography.Text>
                        </Space>
                      </Col>
                      <Col>
                        <Typography.Text type="secondary">
                          {formatDateToWords(t.CreatedDate) ??
                            dictionary.en.noDataText}
                        </Typography.Text>
                      </Col>
                    </Row>
                  </Link>
                </Card>
              ))
            ) : (
              <Card className="box-margin-y">
                <AppEmpty />
              </Card>
            )}
          </Spin>

          <Row justify="end" style={{ padding: token.paddingXS }}>
            <Col>
              <AppPagination
                style={{ marginTop: '20px', marginBottom: '20px' }}
                current={page}
                total={notifications?.Data?.TotalDataCount}
                onChange={(z: number) => setCurrentPage(z)}
              />
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}

export default NotificationsList;
