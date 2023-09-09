/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
import AppHandledSelect from '@/components/forms/select/handled-select';
import { dictionary } from '@/utils/constants/dictionary';
import { fileTypeOptions } from '@/utils/constants/options';
import {
  inputPlaceholderText,
  selectPlaceholderText
} from '@/utils/constants/texts';
import { Col, Form, Row, UploadFile } from 'antd';
import {
  SubmitHandler,
  UseFormSetValue,
  UseFormWatch,
  useForm
} from 'react-hook-form';
import AppFileUpload from '@/components/forms/file-upload';
import { Dispatch, SetStateAction } from 'react';
import { inputValidationText } from '@/utils/constants/validations';
import { toast } from 'react-toastify';
import { toastOptions } from '@/configs/global-configs';
import { FolderTypes } from '@/models/common';
import { IEdcContractForm, IEdcContractFileUploadModalForm } from '../models';

type IEdcCreateContractFileUploadProps = {
  globalSetvalue: UseFormSetValue<IEdcContractForm>;
  globalWatch: UseFormWatch<IEdcContractForm>;
  setShowUploadFileModal: Dispatch<SetStateAction<boolean>>;
};

function FileUpload({
  globalSetvalue,
  globalWatch,
  setShowUploadFileModal
}: IEdcCreateContractFileUploadProps) {
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<IEdcContractFileUploadModalForm>({
    mode: 'onChange',
    defaultValues: {
      fileType: null
    }
  });

  const onSubmit: SubmitHandler<IEdcContractFileUploadModalForm> = async (
    data: IEdcContractFileUploadModalForm
  ) => {
    console.log(
      {
        ...data?.fileList,
        type: Number(data?.fileType)
      },
      'muddet'
    );
    if (!watch('fileList')) {
      toast.error(inputValidationText(dictionary.en.doc), toastOptions);
      return;
    }
    if (data?.fileList && 'id' in data.fileList) {
      globalSetvalue('tableFileList', [
        ...globalWatch('tableFileList'),
        {
          ...data.fileList,
          type: Number(data.fileType)
        }
      ]);
    }

    setShowUploadFileModal(false);

    setShowUploadFileModal(false);
  };

  const filteredOptions = () => {
    const selectedValues: number[] = (
      globalWatch('tableFileList')?.map(z => z?.type) || []
    ).filter(Boolean) as number[];
    const res = fileTypeOptions?.filter(
      z => typeof z?.value === 'number' && !selectedValues.includes(z?.value)
    );
    return res;
  };

  return (
    <div>
      <Form
        onFinish={handleSubmit(onSubmit)}
        id="file-upload-modal-form"
        layout="vertical"
      >
        <Row gutter={16}>
          <Col className="gutter-row" span={24}>
            <AppHandledSelect
              label={dictionary.en.fileType}
              name="fileType"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: inputValidationText(dictionary.en.fileType)
                }
              }}
              required
              placeholder={inputPlaceholderText(dictionary.en.fileType)}
              errors={errors}
              selectProps={{
                showSearch: true,
                id: 'fileType',
                placeholder: selectPlaceholderText(dictionary.en.fileType),
                className: 'w-full',
                options: filteredOptions(),
                size: 'large'
              }}
              formItemProps={{
                labelAlign: 'left',
                labelCol: { span: 8 },
                style: { fontWeight: 'bolder' }
              }}
            />
          </Col>
          <Col span={24}>
            <AppFileUpload
              listType="picture-card"
              accept=".pdf"
              length={1}
              getValues={(e: Array<UploadFile>) => {
                if (e && e.length > 0) {
                  setValue('fileList', e[0]?.response?.Data);
                }
              }}
              folderType={FolderTypes.ContractMainFile}
            />
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default FileUpload;
