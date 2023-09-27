/* eslint-disable no-nested-ternary */
import AppPopover from '@/components/display/popover';
import { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellOutlined, FileTextOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import {
  Avatar,
  Button,
  Col,
  Row,
  Skeleton,
  Space,
  Typography,
  Badge,
  theme
} from 'antd';

import { dictionary } from '@/utils/constants/dictionary';
import { toastOptions } from '@/configs/global-configs';
import { NotificationServices } from '@/services/notification-services/notification-services';
import notificationSocket from '@/redux/notification-socket';
import { formatDateToWords } from '@/utils/functions/functions';
import { IGlobalResponse } from '@/models/common';
import AppEmpty from '@/components/display/empty';
import {
  IGetNotificationsListResponse,
  IReadNotificationPayload
} from '../models';

function NotificationsPopover() {
  const { useToken } = theme;
  const { token } = useToken();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<IGetNotificationsListResponse>();
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const navigate = useNavigate();

  const readAll = async () => {
    const res: IGlobalResponse =
      await NotificationServices.getInstance().readAllNotifications(() => {
        setLoading(false);
      });
    if (res.IsSuccess) {
      toast.success(dictionary.en.successTxt, toastOptions);
      setLoading(false);
      setRefresh(!refresh);
    }
    setLoading(false);
  };

  const readNotification = async ({ Id }: IReadNotificationPayload) => {
    const res: IGlobalResponse =
      await NotificationServices.getInstance().readNotification({ Id }, () => {
        setLoading(false);
      });
    if (res.IsSuccess) {
      setRefresh(!refresh);
      setLoading(false);
    }
    setLoading(false);
  };

  const handleClick = (id: number, documentId: number, isRead: boolean) => {
    setOpen(false);
    !isRead && readNotification({ Id: id });
    navigate(`/edc/view-contract/${documentId}`);
  };

  const fetchNotificationsList = async () => {
    setLoading(true);

    const res: IGetNotificationsListResponse =
      await NotificationServices.getInstance().getAllNotifications([
        { name: 'page', value: 1 }
      ]);

    if (res.IsSuccess) {
      setLoading(false);
      setNotifications(res);
      setUnreadCount(res?.Data?.unReadCount);
      setTotalCount(res?.Data?.TotalDataCount);
    }
  };
  useEffect(() => {
    fetchNotificationsList();
  }, [refresh]);

  useEffect(() => {
    notificationSocket.on('Receiver', data => {
      console.log(data, 'letafet');
      data && fetchNotificationsList();
    });
  }, []);

  const notifPopoverContetn: ReactNode = (
    <div>
      <div
        className="notification"
        style={{ width: 450, maxHeight: 369, overflow: 'auto' }}
      >
        {loading ? (
          <Skeleton />
        ) : totalCount > 0 ? (
          notifications?.Data.Datas.map(t => (
            <Space
              key={t.Id}
              onClick={() => handleClick(t.Id, t.DocumentId, t.IsRead)}
              style={{
                borderBottom: '1px solid',
                cursor: 'pointer',
                borderColor: token.colorBorder,
                padding: token.paddingMD,
                background: t.IsRead ? token.colorBgBase : token.colorPrimaryBg
              }}
            >
              <Col>
                <Avatar
                  style={{
                    backgroundColor: token.colorPrimaryBgHover,
                    color: token.colorPrimary
                  }}
                  icon={<FileTextOutlined rev={undefined} />}
                />
              </Col>
              <Col>
                <Row>
                  <Typography.Text>{t.Message}</Typography.Text>
                </Row>
                <Row justify="end">
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: token.fontSizeSM }}
                  >
                    {formatDateToWords(t.CreatedDate)}
                  </Typography.Text>
                </Row>
              </Col>
            </Space>
          ))
        ) : (
          <AppEmpty />
        )}
      </div>
      <div
        style={{
          padding: token.paddingLG,
          borderTop: '1px solid',
          borderColor: token.colorBorder
        }}
      >
        <Button
          type="default"
          block
          onClick={() => {
            setOpen(false);
            navigate('/notifications');
          }}
        >
          {dictionary.en.seeAll}
        </Button>
      </div>
    </div>
  );

  return (
    <AppPopover
      triggerComponent={
        <Badge size="default" count={unreadCount}>
          {' '}
          <BellOutlined
            className="pointer"
            style={{ fontSize: token.fontSizeXL }}
            rev={undefined}
          />{' '}
        </Badge>
      }
      title={
        <Row
          justify="space-between"
          align="middle"
          style={{
            padding: token.paddingLG,
            borderBottom: '1px solid',
            borderBottomColor: token.colorBorder
          }}
        >
          <Col>
            <Typography.Text style={{ fontSize: token.fontSizeXL }} strong>
              {dictionary.en.notifications}
            </Typography.Text>
          </Col>
          <Button
            style={{
              background: token.colorPrimaryBg,
              color: token.colorPrimary
            }}
            type="text"
            shape="round"
            size="small"
            onClick={readAll}
          >
            {dictionary.en.readAll}
          </Button>
        </Row>
      }
      content={notifPopoverContetn}
      trigger="click"
      open={open}
      onOpenChange={(e: boolean) => setOpen(e)}
      arrow={false}
      placement="bottomRight"
    />
  );
}

export default NotificationsPopover;
