import AppEmpty from '@/components/display/empty';
import { Button, Modal, Table, theme } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FilePdfOutlined } from '@ant-design/icons';
import { useState } from 'react';
import ViewFileModal from '@/components/display/view-file-modal';
import { IFileServerResponse } from '@/models/common';
import { dictionary } from '@/utils/constants/dictionary';
import dayjs from 'dayjs';
import { IEdcChangeLogItem, IEdcChangeLogListItem } from '../../models';

interface IChangeLogDetailModalProps {
  item?: IEdcChangeLogListItem;
}

function ChangeLogDetailModal({ item }: IChangeLogDetailModalProps) {
  const { useToken } = theme;
  const { token } = useToken();
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IFileServerResponse>();

  const columns: ColumnsType<IEdcChangeLogItem> = [
    {
      title: 'Növü',
      dataIndex: 'name',
      key: '1'
    },
    {
      title: 'Köhnə məlumat',
      key: '2',
      render: (record: IEdcChangeLogItem) => {
        if (record?.type === 1) {
          return typeof record?.value?.oldValue === 'string' &&
            dayjs(record?.value.oldValue).isValid()
            ? dayjs(record?.value.oldValue).format('DD.MM.YYYY')
            : typeof record?.value?.oldValue === 'string' &&
                record?.value.oldValue;
        }

        return (
          <div>
            <FilePdfOutlined
              style={{
                cursor: 'pointer',
                fontSize: token.fontSizeXL,
                color: token.red,
                marginRight: token?.marginXXS
              }}
              rev={undefined}
              onClick={() => {
                typeof record?.value?.oldValue !== 'string' &&
                  setSelectedItem(record?.value?.oldValue);
                setShowFileModal(true);
              }}
            />
            {typeof record?.value?.oldValue !== 'string' &&
              record?.value?.oldValue?.name}
          </div>
        );
      }
    },
    {
      title: 'Yeni məlumat',
      key: '3',
      render: (record: IEdcChangeLogItem) => {
        if (record?.type === 1) {
          return typeof record?.value?.newValue === 'string' &&
            dayjs(record?.value.newValue).isValid()
            ? dayjs(record?.value.newValue).format('DD.MM.YYYY')
            : typeof record?.value?.newValue === 'string' &&
                record?.value.newValue;
        }

        return (
          <div>
            <FilePdfOutlined
              style={{
                cursor: 'pointer',
                fontSize: token.fontSizeXL,
                color: token.red,
                marginRight: token?.marginXXS
              }}
              rev={undefined}
              onClick={() => {
                typeof record?.value?.newValue !== 'string' &&
                  setSelectedItem(record?.value?.newValue);
                setShowFileModal(true);
              }}
            />
            {typeof record?.value?.newValue !== 'string' &&
              record?.value?.newValue?.name}
          </div>
        );
      }
    }
  ];
  return (
    <div>
      <Table
        pagination={false}
        size="small"
        locale={{
          emptyText: <AppEmpty />
        }}
        columns={columns}
        dataSource={item?.changeLog}
      />
      <Modal
        open={showFileModal}
        title={selectedItem?.name}
        onCancel={() => setShowFileModal(false)}
        destroyOnClose
        width={992}
        cancelText={dictionary.en.closeBtn}
        okText={dictionary.en.save}
        footer={[
          <Button onClick={() => setShowFileModal(false)}>
            {dictionary.en.closeBtn}
          </Button>
        ]}
      >
        <ViewFileModal src={selectedItem} />
      </Modal>
    </div>
  );
}

export default ChangeLogDetailModal;
