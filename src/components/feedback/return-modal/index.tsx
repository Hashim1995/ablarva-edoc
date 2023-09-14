/* eslint-disable no-debugger */
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button, Form, Modal } from 'antd';
import { useForm } from 'react-hook-form';
import AppHandledTextArea from '@/components/forms/text-area/handled-text-area';
import { dictionary } from '@/utils/constants/dictionary';
import { inputPlaceholderText } from '@/utils/constants/texts';
import { EdcServies } from '@/services/edc-services/edc-services';
import { toast } from 'react-toastify';
import { toastOptions } from '@/configs/global-configs';
import {
  inputValidationText,
  minLengthCheck
} from '@/utils/constants/validations';

interface FormData {
  Message: string | null;
}

interface ReturnModalProps {
  id: number | undefined;
  showReturnForm: boolean;
  setShowReturnForm: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
}
function ReturnModal({
  id,
  showReturnForm,
  setRefreshComponent,
  setShowReturnForm
}: ReturnModalProps) {
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
      const res = await EdcServies.getInstance().returntDoc(
        id,
        {
          Message: data.Message
        },
        () => setBtnLoader(false)
      );

      if (res.IsSuccess) {
        toast.success(res.Data?.message, toastOptions);
        setShowReturnForm && setShowReturnForm(false);
        setRefreshComponent && setRefreshComponent(z => !z);
        setBtnLoader(false);
      }
    }
  };

  return (
    <Modal
      width={700}
      destroyOnClose
      title={dictionary.en.returnReason}
      open={showReturnForm}
      onCancel={() => setShowReturnForm(false)}
      okText={dictionary.en.send}
      footer={[
        <Button
          form="Message-return-form"
          type="primary"
          loading={btnLoader}
          key="submit"
          htmlType="submit"
        >
          {dictionary.en.send}
        </Button>
      ]}
    >
      <Form
        onFinish={handleSubmit(onSubmit)}
        id="Message-return-form"
        layout="vertical"
      >
        <AppHandledTextArea
          label={dictionary.en.reason}
          name="Message"
          control={control}
          placeholder={inputPlaceholderText(dictionary.en.returnReason)}
          errors={errors}
          rules={{
            required: {
              value: true,
              message: inputValidationText(dictionary.en.returnReason)
            },
            minLength: {
              value: 5,
              message: minLengthCheck(dictionary.en.finCode, '7')
            }
          }}
          required
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

export default ReturnModal;
