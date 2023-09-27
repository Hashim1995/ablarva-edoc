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

import { Button, Col, Form, Modal, Row, Spin, UploadFile } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { IGlobalResponse, selectOption } from '@/models/common';
import {
  showCloseConfirmationModal,
  tokenizeImage
} from '@/utils/functions/functions';
import AppFileUpload from '@/components/forms/file-upload';
import {
  IAddStaffForm,
  IGetSingleStaffResponse,
  IStaffItem,
  PartialStaff
} from '../models';

interface IUpdateStaffProps {
  permissions: selectOption[];
  selectedItem: IStaffItem;
  showUpdateStaffModal: boolean;
  setShowUpdateStaffModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
}

function UpdateStaff({
  setShowUpdateStaffModal,
  selectedItem,
  permissions,
  setRefreshComponent,
  showUpdateStaffModal
}: IUpdateStaffProps) {
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
      Permission: [],
      fileId: null
    }
  });

  const [skeleton, setSkeleton] = useState(true);
  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any>([]);

  const getStaffItemById = async (id: number) => {
    setIsFormSubmiting(true);
    const res: IGetSingleStaffResponse =
      await StaffServies.getInstance().getSingleStaff(id);

    const permissionValues: (string | number)[] = Array.isArray(
      res?.Data?.Permission
    )
      ? res?.Data?.Permission.map(
          permission => permission?.value as string | number
        ).filter(Boolean)
      : [res?.Data?.Permission?.value as string | number].filter(Boolean);

    if (res?.IsSuccess) {
      setValue('Name', res?.Data?.Name ?? '');
      setValue('Email', res?.Data?.Email ?? '');
      setValue('Surname', res?.Data?.Surname ?? '');
      setValue('FathersName', res?.Data?.FathersName ?? '');
      setValue('FinCode', res?.Data?.FinCode ?? '');
      setValue('Profession', res?.Data?.Profession ?? '');
      setValue('PhoneNumber', res?.Data?.PhoneNumber ?? '');
      setValue('Permission', permissionValues ?? []);
      const file = res?.Data?.File;
      if (file) {
        const tokenizedFile = await tokenizeImage(file);
        setFileList([tokenizedFile]);
      }
      setSkeleton(false);
    }
    setIsFormSubmiting(false);
  };

  const onSubmit: SubmitHandler<IAddStaffForm> = async (data: PartialStaff) => {
    console.log(data);
    console.log(typeof data?.Permission);

    setIsFormSubmiting(true);
    console.log(data?.Permission, 'Val');
    // const permissionValues: (string | number)[] = Array.isArray(data?.Permission)
    // ? data?.Permission.map(permission => permission?.value as string | number).filter(Boolean)
    // : [data?.Permission?.value as string | number].filter(Boolean);
    // console.log(permissionValues, 'lol');

    const payload = {
      Name: data.Name ?? '',
      Surname: data.Surname ?? '',
      FathersName: data.FathersName ?? '',
      FinCode: data.FinCode ?? '',
      Profession: data.Profession ?? '',
      Email: data.Email ?? '',
      PhoneNumber: data.PhoneNumber ?? '',
      Permissions: data.Permission,
      FileId: data.fileId
    };

    console.log(payload, 'pp');

    const res: IGlobalResponse = await StaffServies.getInstance().updateStaff(
      selectedItem?.Id,
      payload,
      () => setIsFormSubmiting(false)
    );

    if (res.IsSuccess) {
      toast.success(dictionary.en.successTxt);
      setShowUpdateStaffModal(false);
      setRefreshComponent(z => !z);
    }
    setIsFormSubmiting(false);
    setShowUpdateStaffModal(false);
  };

  const handleClose = () => {
    showCloseConfirmationModal({
      onClose: () => {
        setShowUpdateStaffModal(false);
      }
    });
  };

  useEffect(() => {
    getStaffItemById(selectedItem?.Id);
  }, []);

  return (
    <Modal
      width={700}
      destroyOnClose
      title={dictionary.en.updateStaff}
      open={showUpdateStaffModal}
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
        {!skeleton ? (
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
                    defaultFileList={fileList}
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
                    }
                  }}
                  required
                  control={control}
                  inputType="text"
                  placeholder={inputPlaceholderText(
                    dictionary.en.contactNumber
                  )}
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
                  name="Permission"
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
                    mode: 'multiple',
                    allowClear: true,
                    showSearch: true,
                    id: 'Permission',
                    placeholder: selectPlaceholderText(
                      dictionary.en.permissions
                    ),
                    className: 'w-full',
                    options: permissions
                  }}
                />
              </Col>
            </Row>
          </Form>
        ) : (
          <Spin />
        )}
      </div>
    </Modal>
  );
}

export default UpdateStaff;
