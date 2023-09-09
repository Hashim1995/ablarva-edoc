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
  minLengthCheck
} from '@/utils/constants/validations';
import { inputPlaceholderText } from '@/utils/constants/texts';
import { useReadLocalStorage } from 'usehooks-ts';
import { IGlobalResponse } from '@/models/common';
import { toast } from 'react-toastify';
import { PersonalServies } from '@/services/personal-service/personal-service';
import AppFileUpload from '@/components/forms/file-upload';
import { IGetuserDataResponse, IUserData } from '../models';

function Personal() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<Partial<IUserData>>({
    mode: 'onChange',
    defaultValues: {
      Name: '',
      Voen: '',
      Email: '',
      PhoneNumber: '',
      ActivityField: '',
      Address: '',
      fileId: null,
      File: null
    }
  });
  const userToken = useReadLocalStorage<any>('userToken');

  const [skeleton, setSkeleton] = useState<boolean>(true);
  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any>([]);
  const tokenizeImage = async (file: any): Promise<any> => {
    file.status = 'done';
    const src = file.fileUrl;
    const cache = await caches.open('imageCache');
    const cachedResponse = await cache.match(src);
    if (cachedResponse) {
      const blob = await cachedResponse.blob();
      const objectUrl = URL.createObjectURL(blob);
      file.url = objectUrl;
    } else {
      const response = await fetch(src, {
        headers: {
          AuthPerson: userToken
        }
      });
      if (response.ok) {
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        src && (await cache.put(src, new Response(blob)));
        file.url = objectUrl;
      }
    }
    return file;
  };

  const getUserData = async () => {
    setIsFormSubmiting(true);
    const res: IGetuserDataResponse =
      await PersonalServies.getInstance().getUserData();

    if (res?.IsSuccess) {
      setValue('Name', res?.Data?.Name ?? '');
      setValue('Email', res?.Data?.Email ?? '');
      setValue('Voen', res?.Data?.Voen ?? '');
      setValue('ActivityField', res?.Data?.ActivityField ?? '');
      setValue('PhoneNumber', res?.Data?.PhoneNumber ?? '');
      setValue('Address', res?.Data?.Address ?? '');
      setValue('fileId', res?.Data?.File?.id ?? null);
      const file = res?.Data?.File;
      if (file) {
        const tokenizedFile = await tokenizeImage(file);
        setFileList([tokenizedFile]);
      }

      setSkeleton(false);
    }
    setIsFormSubmiting(false);
  };

  const onSubmit: SubmitHandler<Partial<IUserData>> = async (
    data: Partial<IUserData>
  ) => {
    setIsFormSubmiting(true);

    const payload = {
      Email: data?.Email ?? '',
      PhoneNumber: data?.PhoneNumber ?? '',
      ActivityField: data?.ActivityField ?? '',
      Address: data?.Address ?? '',
      fileId: data?.fileId ?? null
    };

    const res: IGlobalResponse =
      await PersonalServies.getInstance().updateUserData(payload, () =>
        setIsFormSubmiting(false)
      );

    if (res.IsSuccess) {
      toast.success(dictionary.en.successTxt);
    }
    setIsFormSubmiting(false);
  };

  useEffect(() => {
    getUserData();
  }, []);

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
                  title: dictionary.en.personal
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
                        inputProps={{ disabled: true }}
                        formItemProps={{
                          labelAlign: 'left'
                        }}
                        control={control}
                        inputType="text"
                        placeholder={inputPlaceholderText(dictionary.en.name)}
                        errors={errors}
                      />
                    </Col>
                    <Col span={24}>
                      <AppHandledInput
                        label={dictionary.en.voen}
                        name="Voen"
                        rules={{
                          required: {
                            value: true,
                            message: inputValidationText(dictionary.en.voen)
                          },
                          minLength: {
                            value: 3,
                            message: minLengthCheck(dictionary.en.voen, '10')
                          }
                        }}
                        formItemProps={{
                          labelAlign: 'left'
                        }}
                        required
                        inputProps={{ disabled: true }}
                        control={control}
                        inputType="text"
                        placeholder={inputPlaceholderText(dictionary.en.voen)}
                        errors={errors}
                      />
                    </Col>
                    <Col span={24}>
                      <AppHandledInput
                        label={dictionary.en.activityField}
                        name="ActivityField"
                        rules={{
                          required: {
                            value: true,
                            message: inputValidationText(
                              dictionary.en.activityField
                            )
                          },
                          minLength: {
                            value: 3,
                            message: minLengthCheck(
                              dictionary.en.activityField,
                              '3'
                            )
                          }
                        }}
                        required
                        formItemProps={{
                          labelAlign: 'left'
                        }}
                        control={control}
                        inputType="text"
                        placeholder={inputPlaceholderText(
                          dictionary.en.activityField
                        )}
                        errors={errors}
                      />
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
                            checkOnlyEnglishChars: value =>
                              /^[\w\\.-]+@[\w\\.-]+\.\w+$/.test(value) ||
                              'Zəhmət olmasa düzgün bir e-poçt ünvanı daxil edin.'
                          }
                        }}
                        required
                        formItemProps={{
                          labelAlign: 'left'
                        }}
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
                          }
                        }}
                        required
                        formItemProps={{
                          labelAlign: 'left'
                        }}
                        control={control}
                        inputType="text"
                        placeholder={inputPlaceholderText(
                          dictionary.en.contactNumber
                        )}
                        errors={errors}
                      />
                    </Col>
                    <Col span={24}>
                      <AppHandledInput
                        label={dictionary.en.address}
                        name="Address"
                        rules={{
                          required: {
                            value: true,
                            message: inputValidationText(dictionary.en.address)
                          },
                          minLength: {
                            value: 3,
                            message: minLengthCheck(dictionary.en.address, '3')
                          }
                        }}
                        required
                        formItemProps={{
                          labelAlign: 'left'
                        }}
                        control={control}
                        inputType="text"
                        placeholder={inputPlaceholderText(
                          dictionary.en.address
                        )}
                        errors={errors}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
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

export default Personal;
