import AppHandledInput from '@/components/forms/input/handled-input';
import AppHandledSelect from '@/components/forms/select/handled-select';
import { StaffServies } from '@/services/settings-staff-service/settings-staff-service';
import {
  inputValidationText,
  minLengthCheck,
  maxLengthCheck
} from '@/utils/constants/validations';
import { dictionary } from '@/utils/constants/dictionary';
import {
  inputPlaceholderText,
  selectPlaceholderText
} from '@/utils/constants/texts';

import { Button, Col, Form, Modal, Row, UploadFile } from 'antd';
import { Dispatch, SetStateAction, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { IGlobalResponse, selectOption } from '@/models/common';
import { showCloseConfirmationModal } from '@/utils/functions/functions';
import AppFileUpload from '@/components/forms/file-upload';
import { IAddStaffForm } from '../models';

type IAddStaffProps = {
  showAddStaffModal: boolean;
  permissions: selectOption[];
  setShowAddStaffModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
};

function AddStaff({
  permissions,
  setShowAddStaffModal,
  setRefreshComponent,
  showAddStaffModal
}: IAddStaffProps) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<IAddStaffForm>({
    mode: 'onChange',
    defaultValues: {
      Name: '',
      Surname: '',
      FathersName: '',
      FinCode: '',
      Profession: '',
      Email: '',
      PhoneNumber: '',
      PermissionId: null,
      fileId: null
    }
  });

  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);
  const onSubmit: SubmitHandler<IAddStaffForm> = async (
    data: IAddStaffForm
  ) => {
    setIsFormSubmiting(true);
    console.log(isFormSubmiting);
    console.log(data);

    const payload = {
      Name: data.Name,
      Surname: data.Surname,
      FathersName: data.FathersName,
      FinCode: data.FinCode,
      Profession: data.Profession,
      Email: data.Email,
      PhoneNumber: data.PhoneNumber,
      PermissionId: data.PermissionId,
      FileId: data.fileId
    };

    const res: IGlobalResponse = await StaffServies.getInstance().addStaff(
      payload,
      () => setIsFormSubmiting(false)
    );

    if (res.IsSuccess) {
      toast.success(dictionary.en.successTxt);
      setShowAddStaffModal(false);
      console.log(isFormSubmiting);
      setRefreshComponent(z => !z);
    }
    setShowAddStaffModal(false);
    setIsFormSubmiting(false);
    console.log(isFormSubmiting);
  };

  const handleClose = () => {
    showCloseConfirmationModal({
      onClose: () => {
        setShowAddStaffModal(false);
      }
    });
  };

  return (
    <Modal
      width={700}
      destroyOnClose
      title={dictionary.en.addStaff}
      open={showAddStaffModal}
      onCancel={handleClose}
      cancelText={dictionary.en.closeBtn}
      okText={dictionary.en.save}
      footer={[
        <Button
          form="add-staff-modal-form"
          type="primary"
          key="submit"
          htmlType="submit"
          disabled={isFormSubmiting}
          loading={isFormSubmiting}
        >
          {dictionary.en.save}
        </Button>
      ]}
    >
      <div>
        <Form
          onFinish={handleSubmit(onSubmit)}
          id="add-staff-modal-form"
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <AppHandledInput
                label={dictionary.en.finCode}
                name="FinCode"
                formItemProps={{
                  id: 'FinCode'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(dictionary.en.finCode)
                  },
                  minLength: {
                    value: 7,
                    message: minLengthCheck(dictionary.en.finCode, '7')
                  },
                  maxLength: {
                    value: 7,
                    message: maxLengthCheck(dictionary.en.finCode, '7')
                  },
                  validate: {
                    checkOnlyEnglishChars: (value: string) =>
                      /^[a-zA-Z0-9]+$/.test(value) ||
                      'FinCode field should contain only english characters.'
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText(dictionary.en.finCode)}
                errors={errors}
              />
              <AppHandledInput
                label={dictionary.en.name}
                name="Name"
                inputProps={{
                  id: 'name'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(dictionary.en.name)
                  },
                  minLength: {
                    value: 3,
                    message: minLengthCheck(dictionary.en.name, '3')
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText(dictionary.en.name)}
                errors={errors}
              />
              <AppHandledInput
                label={dictionary.en.surname}
                name="Surname"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(dictionary.en.surname)
                  },
                  minLength: {
                    value: 3,
                    message: minLengthCheck(dictionary.en.surname, '3')
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText(dictionary.en.surname)}
                errors={errors}
              />
              <AppHandledInput
                label={dictionary.en.FathersName}
                name="FathersName"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(dictionary.en.FathersName)
                  },
                  minLength: {
                    value: 3,
                    message: minLengthCheck(dictionary.en.FathersName, '3')
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText(dictionary.en.FathersName)}
                errors={errors}
              />
              <Form.Item label={dictionary.en.profilePhoto}>
                <AppFileUpload
                  listType="picture-circle"
                  accept=".jpg, .jpeg, .png, .webp"
                  length={1}
                  getValues={(e: UploadFile[]) => {
                    if (e && e.length > 0) {
                      const selectedFile = e[0];
                      const fileData = selectedFile?.response?.Data;
                      fileData && setValue('fileId', fileData?.id);
                    } else {
                      setValue('fileId', null);
                    }
                  }}
                  folderType={2}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <AppHandledInput
                label={dictionary.en.email}
                name="Email"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(dictionary.en.email)
                  },
                  validate: {
                    checkOnlyEnglishChars: (value: string) =>
                      /^[\w\\.-]+@[\w\\.-]+\.\w+$/.test(value) ||
                      'Please enter a valid email address.'
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText(dictionary.en.email)}
                errors={errors}
              />
              <AppHandledInput
                label={dictionary.en.contactNumber}
                name="PhoneNumber"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(dictionary.en.contactNumber)
                  },
                  validate: {
                    checkPhoneNumber: value =>
                      /([0-9\s-]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/.test(
                        value
                      ) || 'Please enter a valid phone number'
                  }
                }}
                required
                control={control}
                inputType="number"
                placeholder={inputPlaceholderText(dictionary.en.contactNumber)}
                errors={errors}
              />
              <AppHandledInput
                label={dictionary.en.position}
                name="Profession"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(dictionary.en.position)
                  },
                  minLength: {
                    value: 3,
                    message: minLengthCheck(dictionary.en.position, '3')
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText(dictionary.en.position)}
                errors={errors}
              />
              <AppHandledSelect
                label={dictionary.en.permissions}
                name="PermissionId"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(dictionary.en.permissions)
                  }
                }}
                required
                control={control}
                placeholder={inputPlaceholderText(dictionary.en.permissions)}
                errors={errors}
                selectProps={{
                  allowClear: true,
                  showSearch: true,
                  id: 'PermissionId',
                  placeholder: selectPlaceholderText(dictionary.en.permissions),
                  className: 'w-full',
                  options: permissions
                }}
              />
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
}

export default AddStaff;
