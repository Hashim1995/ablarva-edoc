import React, { Dispatch, SetStateAction } from 'react';
import { Modal, Button, Space } from 'antd';
import { dictionary } from '@/utils/constants/dictionary';

interface IConfirmationModalProps {
  titleText: string;
  descriptionText: string;
  closeText: string;
  okText: string;
  form?: string;
  loading: boolean;
  isRequired: Dispatch<SetStateAction<boolean>>;
}

function ConfirmSaveModalCustom({
  titleText,
  descriptionText,
  closeText,
  okText,
  form,
  loading,
  isRequired
}: IConfirmationModalProps) {
  const showConfirmationModal = () => {
    Modal.confirm({
      title: titleText,
      content: descriptionText,
      okText,
      cancelText: closeText,
      footer: (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            paddingTop: '10px'
          }}
        >
          <Button key="back" onClick={() => Modal.destroyAll()}>
            {closeText}
          </Button>
          <Button
            onClick={() => {
              isRequired(false);
              Modal.destroyAll();
            }}
            htmlType="submit"
            form={form}
            type="primary"
            loading={loading}
            disabled={loading}
          >
            <Space>{okText}</Space>
          </Button>
        </div>
      )
    });
  };

  return (
    <div>
      <Button onClick={showConfirmationModal}>{dictionary.en.save}</Button>
    </div>
  );
}

export default ConfirmSaveModalCustom;
