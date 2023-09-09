import React, { useEffect, useState } from 'react';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Upload } from 'antd';
import type {
  UploadFile,
  UploadListType,
  UploadProps
} from 'antd/es/upload/interface';
import TokenizedImage from '@/components/display/image';

import { convertBytesToReadableSize } from '@/utils/functions/functions';
import { dictionary } from '@/utils/constants/dictionary';
import ViewFileModal from '@/components/display/view-file-modal';
import { toast } from 'react-toastify';

interface IProps {
  listType: UploadListType;
  accept?: string;
  getValues: any;
  length?: number;
  folderType: number;
  loadingText?: string;
  size?: {
    max?: number;
    min?: number;
    maxErrorText?: string;
    minErrorText?: string;
  };
  dimension?: {
    width?: number;
    height?: number;
    errorText?: string;
  };
  defaultFileList?: any;
}

function AppFileUpload({
  listType,
  folderType,
  accept,
  getValues,
  length = 5,
  loadingText,
  size,
  dimension,
  defaultFileList
}: IProps) {
  const userToken = JSON.parse(localStorage.getItem('userToken') || '{}');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<any>('');
  const [previewTitle, setPreviewTitle] = useState('');
  const handleCancel = () => {
    setPreviewOpen(false);
  };
  const [fileList, setFileList] = useState<any[]>(defaultFileList);

  const handlePreview = async (file: UploadFile) => {
    if (file?.response?.Data) {
      setPreviewImage(file?.response?.Data);

      setPreviewTitle(file.response.Data.name);
    } else if (file) {
      setPreviewImage(file);
      setPreviewTitle(file.name);
    }

    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList.filter(item => item.status));
    getValues(fileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined rev={undefined} />
      <div style={{ marginTop: 8 }}>Select or drag</div>
    </div>
  );

  const promise = (file: any) =>
    new Promise(resolve => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const { width, height } = img;
        if (
          (dimension?.width && width > dimension?.width) ||
          (dimension?.height && height > dimension?.height)
        ) {
          toast.error(
            dimension?.errorText || `Resolution must be max  ${width}x${height}`
          );
          resolve(false);
        } else {
          resolve(true);
        }
      };
    });

  useEffect(() => {
    getValues(fileList);
  }, [fileList]);

  return (
    <>
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.02)',
          padding: 10,
          border: '1px dashed #d9d9d9'
        }}
      >
        <Upload
          beforeUpload={async file => {
            if (size?.max && file.size > size.max) {
              toast.error(
                size?.maxErrorText ||
                  `Max size must be ${convertBytesToReadableSize(size.max)} `
              );
              return false;
            }
            if (size?.min && file.size <= size.min) {
              toast.error(
                size?.minErrorText ||
                  `Min size must be ${convertBytesToReadableSize(size.min)} `
              );
              return false;
            }

            if (dimension) {
              const res = await promise(file);
              if (!res) {
                return false;
              }
            }

            return true;
          }}
          listType={listType}
          showUploadList={{
            showPreviewIcon: false,
            showDownloadIcon: true,
            downloadIcon: <EyeOutlined rev={undefined} />
          }}
          onDownload={handlePreview}
          fileList={fileList}
          onRemove={file => {
            const updatedFileList = fileList.filter(
              item => item.uid !== file.uid
            );
            setFileList(updatedFileList);
          }}
          locale={{ uploading: loadingText || 'uplading...' }}
          onPreview={handlePreview}
          onChange={handleChange}
          accept={accept}
          action={`https://cloud2.ninco.org:8443/api/fileupload/${folderType}`}
          headers={{
            AuthPerson: userToken
          }}
        >
          {fileList?.length >= length ? null : uploadButton}
        </Upload>
      </div>

      {previewImage?.mimeType !== 'application/pdf' ? (
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
          destroyOnClose
        >
          <TokenizedImage
            tokenized
            style={{ width: '100%' }}
            src={previewImage?.fileUrl}
          />
        </Modal>
      ) : (
        <Modal
          open={previewOpen}
          title={dictionary.en.viewDoc}
          onCancel={handleCancel}
          destroyOnClose
          width={992}
          cancelText={dictionary.en.closeBtn}
          okText={dictionary.en.save}
          footer={[
            <Button onClick={handleCancel}>{dictionary.en.closeBtn}</Button>
          ]}
        >
          <ViewFileModal src={previewImage} />
        </Modal>
      )}
    </>
  );
}

export default AppFileUpload;
