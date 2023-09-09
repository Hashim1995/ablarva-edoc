import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button, Form, Modal } from 'antd';
import { useForm } from 'react-hook-form';
import AppHandledTextArea from '@/components/forms/text-area/handled-text-area';
import { dictionary } from '@/utils/constants/dictionary';
import { inputPlaceholderText } from '@/utils/constants/texts';
import { EdcServies } from '@/services/edc-services/edc-services';
import { toast } from 'react-toastify';
import { toastOptions } from '@/configs/global-configs';

interface FormData {
  Message: string | null;
}

interface RejectModalProps {
  id: number | undefined;
  showRejectForm: boolean;
  setShowRejectForm: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent?: Dispatch<SetStateAction<boolean>>;
}
function RejectModal({
  id,
  showRejectForm,
  setRefreshComponent,
  setShowRejectForm
}: RejectModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      Message: null
    }
  });

  const [btnLoader, setBtnLoader] = useState(false);

  const onSubmit = async (data: any) => {
    setBtnLoader(true);

    if (id) {
      const res = await EdcServies.getInstance().rejectDoc(
        id,
        {
          Message: data.Message
        },
        () => setBtnLoader(false)
      );

      if (res.IsSuccess) {
        toast.success(res.Data?.message, toastOptions);
        setShowRejectForm && setShowRejectForm(false);
        setRefreshComponent && setRefreshComponent(z => !z);

        setBtnLoader(false);
      }
    }
  };

  return (
    <Modal
      width={700}
      destroyOnClose
      title={dictionary.en.rejectionReason}
      open={showRejectForm}
      onCancel={() => setShowRejectForm(false)}
      okText={dictionary.en.send}
      footer={[
        <Button
          form="Message-form"
          type="primary"
          loading={btnLoader}
          key="submit"
          htmlType="submit"
        >
          {dictionary.en.send}
        </Button>
      ]}
    >
      <Form onFinish={handleSubmit(onSubmit)} id="Message-form">
        <AppHandledTextArea
          name="Message"
          control={control}
          placeholder={inputPlaceholderText(dictionary.en.rejectionReason)}
          errors={errors}
          formItemProps={{
            labelAlign: 'left',
            labelCol: { span: 8, sm: 12, md: 10, lg: 8 },
            style: { fontWeight: 'bolder' }
          }}
          textareaProps={{
            size: 'large',
            row: 112
          }}
        />
      </Form>
    </Modal>
  );
}

export default RejectModal;
