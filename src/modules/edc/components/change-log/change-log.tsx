/* eslint-disable no-unused-vars */
import AppEmpty from '@/components/display/empty';
import AppPagination from '@/components/display/pagination';
import { EdcServies } from '@/services/edc-services/edc-services';
import { dictionary } from '@/utils/constants/dictionary';
import {
  Button,
  Card,
  Col,
  Divider,
  Modal,
  Row,
  Table,
  theme,
  Typography
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { number } from 'prop-types';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  IEdcChangeLogListItem,
  IEdcChangeLogListItemResponse
} from '../../models';
import ChangeLogDetailModal from './change-log-detail-modal';
import ChangeLogMessageModal from './change-log-message-modal';

interface IChangeLogProps {
  id?: string;
  refreshComponent: boolean;
}

function ChangeLog({ id, refreshComponent }: IChangeLogProps) {
  const [selectedItem, setSelectedItem] = useState<IEdcChangeLogListItem>();
  const [showDetailedModal, setShowDetailModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [page, setCurrentPage] = useState<number>(1);
  const [changeLogList, setChangeLogList] =
    useState<IEdcChangeLogListItemResponse>();
  const columns: ColumnsType<IEdcChangeLogListItem> = [
    {
      title: 'İSTİFADƏÇİ',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: 'TƏYİNAT',
      dataIndex: 'appointment',
      key: 'appointment'
    },
    {
      title: 'TARİX',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => {
        const formattedDate = dayjs(date).format('DD.MM.YYYY HH:mm:ss');
        return <span>{formattedDate}</span>;
      }
    }
  ];

  const fetchEdcChangeLogList = async () => {
    if (id) {
      const res: IEdcChangeLogListItemResponse =
        await EdcServies.getInstance().getEdcChangeLog(id, [
          { name: 'page', value: page }
        ]);
      setChangeLogList(res);
    }
  };

  useEffect(() => {
    fetchEdcChangeLogList();
  }, [page, refreshComponent]);

  const { useToken } = theme;
  const { token } = useToken();
  return (
    <>
      <Card size="small" className="box box-margin-y">
        <Typography.Text>
          {' '}
          {dictionary.en.changeLog.toLocaleUpperCase('tr-TR')}
        </Typography.Text>
        <Divider
          style={{
            marginTop: token.marginXS,
            marginBottom: token.marginXS
          }}
        />

        <Row style={{ padding: token.paddingXS }}>
          <Col span={24}>
            <Table
              onRow={(record: IEdcChangeLogListItem) => ({
                onClick: () => {
                  if (
                    record?.changeLog !== null &&
                    record?.changeLog.length !== 0 &&
                    record?.message === null
                  ) {
                    setSelectedItem(record);
                    setShowDetailModal(true);
                  } else if (
                    (record?.changeLog === null ||
                      record?.changeLog.length === 0) &&
                    record?.message !== null
                  ) {
                    setSelectedItem(record);
                    setShowMessageModal(true);
                  }
                }
              })}
              rowClassName="pointer"
              pagination={false}
              size="small"
              locale={{
                emptyText: <AppEmpty />
              }}
              columns={columns}
              dataSource={
                changeLogList?.Data !== null ? changeLogList?.Data.Datas : []
              }
            />
          </Col>
        </Row>
        <Row justify="end" style={{ padding: token.paddingXS }}>
          <Col>
            <AppPagination
              style={{ marginTop: '20px', marginBottom: '20px' }}
              current={page}
              total={changeLogList?.Data?.TotalDataCount}
              onChange={(z: number) => setCurrentPage(z)}
            />
          </Col>
        </Row>
      </Card>
      <Modal
        open={showDetailedModal}
        title={selectedItem?.appointment}
        onCancel={() => setShowDetailModal(false)}
        destroyOnClose
        width={992}
        cancelText={dictionary.en.closeBtn}
        okText={dictionary.en.save}
        footer={[
          <Button onClick={() => setShowDetailModal(false)}>
            {dictionary.en.closeBtn}
          </Button>
        ]}
      >
        <ChangeLogDetailModal item={selectedItem} />
      </Modal>

      <Modal
        open={showMessageModal}
        title={selectedItem?.appointment}
        onCancel={() => setShowMessageModal(false)}
        destroyOnClose
        width={592}
        cancelText={dictionary.en.closeBtn}
        okText={dictionary.en.save}
        footer={[
          <Button onClick={() => setShowMessageModal(false)}>
            {dictionary.en.closeBtn}
          </Button>
        ]}
      >
        <ChangeLogMessageModal item={selectedItem} />
      </Modal>
    </>
  );
}

export default ChangeLog;
