import React from 'react';
import { Modal } from 'antd';
import { dictionary } from '@/utils/constants/dictionary';

interface DeleteConfirmationModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}

function DeleteConfirmationModal({
  visible,
  onOk,
  onCancel
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      title={dictionary.en.confirmTitle}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={dictionary.en.yesTxt}
      okType="danger"
      cancelText={dictionary.en.noTxt}
    >
      <p>{dictionary.en.confirmDelete}</p>
    </Modal>
  );
}

export default DeleteConfirmationModal;
