/* eslint-disable no-unused-vars */
import { dictionary } from '@/utils/constants/dictionary';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Row,
  Space,
  Spin,
  UploadFile
} from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import AppHandledInput from '@/components/forms/input/handled-input';
import {
  inputValidationText,
  maxLengthCheck,
  minLengthCheck
} from '@/utils/constants/validations';
import { inputPlaceholderText } from '@/utils/constants/texts';
import { tokenizeImage } from '@/utils/functions/functions';
import { IGlobalResponse } from '@/models/common';
import { toast } from 'react-toastify';

import AppFileUpload from '@/components/forms/file-upload';

import { useDispatch } from 'react-redux';
import {
  AuthService,
  IAuthResponse
} from '@/services/auth-services/auth-services';
import { PersonalCabinetServies } from '@/services/personal-cabinet-services/personal-cabinet-services';
import { setUser } from '@/redux/auth/auth-slice';
import { IPersonalData } from '../models';

function PersonalCabinet() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<Partial<IPersonalData>>({
    mode: 'onChange',
    defaultValues: {
      Name: '',
      Surname: '',
      FathersName: '',
      FinCode: '',
      Profession: '',
      Email: '',
      PhoneNumber: '',
      fileId: null
    }
  });

  const dispatch = useDispatch();

  const [skeleton, setSkeleton] = useState<boolean>(false);
  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any>([]);

  const getUserData = async () => {
    setIsFormSubmiting(true);
    const res: IAuthResponse = await AuthService.getInstance().getUserData();

    if (res?.IsSuccess) {
      dispatch(setUser(res?.Data));
      setValue('Name', res?.Data?.Name ?? '');
      setValue('Email', res?.Data?.Email ?? '');
      setValue('Surname', res?.Data?.Surname ?? '');
      setValue('FathersName', res?.Data?.FathersName ?? '');
      setValue('FinCode', res?.Data?.FinCode ?? '');
      setValue('Profession', res?.Data?.Profession ?? '');
      setValue('PhoneNumber', res?.Data?.PhoneNumber ?? '');
      setValue('fileId', res?.Data?.getFile?.id ?? null);
      const file = res?.Data?.getFile;
      if (file) {
        const tokenizedFile = await tokenizeImage(file);
        setFileList([tokenizedFile]);
      }

      setSkeleton(false);
    }
    setIsFormSubmiting(false);
  };

  useEffect(() => {
    getUserData();
  }, [refresh]);

  const onSubmit: SubmitHandler<Partial<IPersonalData>> = async (
    data: Partial<IPersonalData>
  ) => {
    setIsFormSubmiting(true);

    const payload = {
      Name: data.Name ?? '',
      Surname: data.Surname ?? '',
      FathersName: data.FathersName ?? '',
      FinCode: data.FinCode ?? '',
      Profession: data.Profession ?? '',
      Email: data.Email ?? '',
      PhoneNumber: data.PhoneNumber ?? '',
      fileId: data.fileId ?? null
    };

    const res: IGlobalResponse =
      await PersonalCabinetServies.getInstance().updatePersonalData(
        payload,
        () => setIsFormSubmiting(false)
      );

    if (res.IsSuccess) {
      toast.success(dictionary.en.successTxt);
      setRefresh(t => !t);
    }
    setIsFormSubmiting(false);
  };

  return (
    <div>
      <Card size="small" className="box box-margin-y">
        <Row justify="space-between">
          <Space>
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
                  title: dictionary.en.personalCabinet
                }
              ]}
            />
          </Space>
          <Space>
            <Button
              form="personal-form"
              htmlType="submit"
              loading={isFormSubmiting}
              disabled={isFormSubmiting}
              type="primary"
            >
              <Space>{dictionary.en.save}</Space>
            </Button>
          </Space>
        </Row>
      </Card>
      <Card className="box box-margin-y">
        <div>
          {!skeleton ? (
            <Form
              onFinish={handleSubmit(onSubmit)}
              id="personal-form"
              layout="vertical"
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Row gutter={24}>
                    <Col span={24}>
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
                        placeholder={inputPlaceholderText(
                          dictionary.en.finCode
                        )}
                        errors={errors}
                      />
                    </Col>
                    <Col span={24}>
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
                    </Col>
                    <Col span={24}>
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
                        placeholder={inputPlaceholderText(
                          dictionary.en.surname
                        )}
                        errors={errors}
                      />
                    </Col>
                    <Col span={24}>
                      <AppHandledInput
                        label={dictionary.en.FathersName}
                        name="FathersName"
                        rules={{
                          required: {
                            value: true,
                            message: inputValidationText(
                              dictionary.en.FathersName
                            )
                          },
                          minLength: {
                            value: 3,
                            message: minLengthCheck(
                              dictionary.en.FathersName,
                              '3'
                            )
                          }
                        }}
                        required
                        control={control}
                        inputType="text"
                        placeholder={inputPlaceholderText(
                          dictionary.en.FathersName
                        )}
                        errors={errors}
                      />
                    </Col>
                    <Col span={24}>
                      <Form.Item label={dictionary.en.profilePhoto}>
                        <AppFileUpload
                          isProfile
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
                  </Row>
                </Col>

                <Col span={12}>
                  <Row gutter={24}>
                    <Col span={24}>
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
                    </Col>
                    <Col span={24}>
                      <AppHandledInput
                        label={dictionary.en.contactNumber}
                        name="PhoneNumber"
                        rules={{
                          required: {
                            value: true,
                            message: inputValidationText(
                              dictionary.en.contactNumber
                            )
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
                        placeholder={inputPlaceholderText(
                          dictionary.en.contactNumber
                        )}
                        errors={errors}
                      />
                    </Col>
                    <Col span={24}>
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
                        placeholder={inputPlaceholderText(
                          dictionary.en.position
                        )}
                        errors={errors}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          ) : (
            <Spin />
          )}
        </div>
      </Card>
    </div>
  );
}

export default PersonalCabinet;
