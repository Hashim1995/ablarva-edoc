/* eslint-disable no-unused-vars */
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Modal,
  Row,
  Space,
  theme,
  Popconfirm,
  Tooltip,
  Timeline,
  Table,
  Skeleton,
  Grid
} from 'antd';
import {
  HomeOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { dictionary } from '@/utils/constants/dictionary';
import {
  inputPlaceholderText,
  selectPlaceholderText
} from '@/utils/constants/texts';
import AppHandledInput from '@/components/forms/input/handled-input';
import { RootState } from '@/redux/store';
import AppHandledTextArea from '@/components/forms/text-area/handled-text-area';
import { inputValidationText } from '@/utils/constants/validations';
import AppEmpty from '@/components/display/empty';
import {
  formatDate,
  showCloseConfirmationModal
} from '@/utils/functions/functions';
import { ColumnsType } from 'antd/es/table';
import { toast } from 'react-toastify';
import { getTimeLineStyle, toastOptions } from '@/configs/global-configs';
import { EdcServies } from '@/services/edc-services/edc-services';
import { ICreateResponse } from '@/models/common';
import ViewFileModal from '@/components/display/view-file-modal';
import AppRouteBlocker from '@/components/display/blocker';
import AppHandledSelect from '@/components/forms/select/handled-select';
import SingleFileUpload from '@/modules/edc/modals/single-file-upload';
import dayjs from 'dayjs';
import {
  IEdcAdditionForm,
  IEdcContractTableFileListItem,
  IEdcDocsListOptions,
  IEdcDocsListOptionsResponse,
  IGetEdcExtraByIdResponse
} from '../../../models';
import AppHandledDate from '../../../../../components/forms/date/handled-date';

function UpdateAddition() {
  const { id } = useParams();
  const userCompanyData = useSelector(
    (state: RootState) => state.user.user.getLegalEntityDto
  );
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<IEdcAdditionForm>({
    mode: 'onChange',
    defaultValues: {
      SenderLegalEntityVoen: '',
      SenderLegalEntityName: '',
      RecieverLegalEntityVoen: '',
      RecieverLegalEntityName: '',
      StartDate: '',
      Description: '',
      tableFileList: []
    }
  });
  const navigate = useNavigate();
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();
  const [showUploadFileModal, setShowUploadFileModal] = useState(false);
  const [formIsRequired, setFormIsRequired] = useState<boolean>(false);
  const [selectedTableListItem, setSelectedTableListItem] =
    useState<IEdcContractTableFileListItem>();
  const [showFileViewModal, setShowFileViewModal] = useState<boolean>(false);

  const [activeKeys, setActiveKeys] = useState<string[]>(['1']);

  const [mainSubmitLoading, setMainSubmitLoading] = useState<boolean>(false);
  const [draftSubmitLoading, setDraftSubmitLoading] = useState<boolean>(false);
  const [blockRoute, setBlockRoute] = useState(true);
  const [docsListOptions, setDocsListOptions] =
    useState<IEdcDocsListOptions[]>();
  const [docsListOptionsLoading, setDocsListOptionsLoading] =
    useState<boolean>(true);
  const [skeleton, setSkeleton] = useState<boolean>(true);

  const getDocsListOptions = async () => {
    const res: IEdcDocsListOptionsResponse =
      await EdcServies.getInstance().getDocsListOptions();

    if (res?.IsSuccess) {
      setDocsListOptions(res?.Data?.Datas);
      setDocsListOptionsLoading(false);
    }
  };

  const { pathname } = useLocation();

  const getByID = async (docId: string) => {
    const isDraft: boolean = pathname?.includes('draft');
    const res: IGetEdcExtraByIdResponse =
      await EdcServies.getInstance().getExtraById(docId, isDraft);

    if (res.IsSuccess) {
      setSkeleton(false);
      const { Data } = res;
      setValue('Description', Data?.Description ?? '');
      setValue('SenderLegalEntityVoen', Data?.SenderLegalEntityVoen ?? '');
      setValue('SenderLegalEntityName', Data?.SenderLegalEntity ?? '');
      setValue('RecieverLegalEntityVoen', Data?.RecieverLegalEntityVoen ?? '');
      setValue('RecieverLegalEntityName', Data?.RecieverLegalEntity ?? '');
      setValue(
        'StartDate',
        Data?.StartDate
          ? dayjs(formatDate(Data?.StartDate ?? ''), 'DD.MM.YYYY')
          : ''
      );
      setValue('tableFileList', Data?.TableFileList);
      setValue(
        'contractNumber',
        docsListOptions?.find(
          (z: IEdcDocsListOptions) => z?.value === Data?.contractNumber && z
        ) ?? null
      );
    }
  };
  useEffect(() => {
    getDocsListOptions();
  }, []);

  useEffect(() => {
    id && !docsListOptionsLoading && getByID(id);
    window.scrollTo(0, 0);
  }, [id, docsListOptions]);

  useEffect(() => {
    setValue('SenderLegalEntityName', userCompanyData.Name);
    setValue('SenderLegalEntityVoen', userCompanyData.Voen);
  }, [userCompanyData]);

  const { useToken } = theme;
  const { token } = useToken();

  const handleDotClick = (dotKey: string) => {
    if (activeKeys.includes(dotKey)) {
      setActiveKeys(activeKeys.filter(key => key !== dotKey));
    } else {
      setActiveKeys([...activeKeys, dotKey]);
    }
  };

  const handleClose = () => {
    showCloseConfirmationModal({
      onClose: () => {
        setShowUploadFileModal(false);
      }
    });
  };

  const createMainAddition = async (data: IEdcAdditionForm) => {
    const isDraft: boolean = pathname?.includes('draft');
    if (data?.tableFileList?.length !== 1) {
      toast.error(inputValidationText(dictionary.en.doc), toastOptions);
      return;
    }
    setMainSubmitLoading(true);

    const res: ICreateResponse =
      await EdcServies.getInstance().updateAdditionMain(
        id,
        isDraft,
        data,
        () => {
          setMainSubmitLoading(false);
        }
      );
    if (res.IsSuccess) {
      toast.success(dictionary.en.successTxt, toastOptions);
      navigate(`/edc/view-addition/${res?.Data?.id}`);
    }
    setMainSubmitLoading(false);
  };

  const createDraftAddition = async (data: IEdcAdditionForm) => {
    const isDraft: boolean = pathname?.includes('draft');
    setDraftSubmitLoading(true);

    const res: ICreateResponse =
      await EdcServies.getInstance().updateAdditionDraft(
        id,
        isDraft,
        data,
        () => {
          setDraftSubmitLoading(false);
        }
      );
    if (res.IsSuccess) {
      toast.success(dictionary.en.successTxt, toastOptions);
      navigate(`/edc/view-addition/draft/${res?.Data?.id}`);
    }
    setDraftSubmitLoading(false);
  };

  const onSubmit: SubmitHandler<IEdcAdditionForm> = async (
    data: IEdcAdditionForm
  ) => {
    setBlockRoute(false);
    console.log(dayjs(data?.StartDate)?.format(), 'muddet');
    const startDate = new Date(
      data.StartDate.$y,
      data.StartDate.$M,
      data.StartDate.$D
    );
    const payload: IEdcAdditionForm = {
      ...data,
      contractNumber:
        typeof data?.contractNumber === 'object'
          ? data?.contractNumber?.value
          : null,
      RecieverLegalEntityName: data?.RecieverLegalEntityName,
      RecieverLegalEntityVoen: data?.RecieverLegalEntityVoen,
      Description: data?.Description,
      DocumentTypeId: 2,
      StartDate: data?.StartDate
        ? dayjs(startDate.toISOString()).format()
        : null,
      tableFileList: data?.tableFileList?.map(z => ({
        type: z?.type,
        id: z?.id
      }))
    };

    if (formIsRequired) {
      createMainAddition(payload);
    } else {
      createDraftAddition(payload);
    }
  };

  const removeItemFromTableList = (
    selectedItem: IEdcContractTableFileListItem
  ): void => {
    const filtered = watch('tableFileList')?.filter(
      (z: IEdcContractTableFileListItem) => z?.id !== selectedItem?.id
    );
    setValue('tableFileList', filtered);
  };

  const columns: ColumnsType<IEdcContractTableFileListItem> = [
    {
      title: 'Sənədin tipi',
      dataIndex: 'type',
      key: 'name',
      render: () => dictionary.en.fileTypeIsMain
    },
    {
      title: 'Sənədin adı',
      dataIndex: 'name',
      key: 'age'
    },
    {
      title: '',
      align: 'right',
      key: 'actions',
      render: (record: IEdcContractTableFileListItem) => (
        <Space>
          <Tooltip title={dictionary.en.delete}>
            <Popconfirm
              title={dictionary.en.dataWillBeDeleted}
              description={dictionary.en.sure}
              onConfirm={() => removeItemFromTableList(record)}
              okText={dictionary.en.yesTxt}
              cancelText={dictionary.en.closeBtn}
            >
              <DeleteOutlined
                style={{
                  cursor: 'pointer',
                  fontSize: token.fontSizeXL,
                  color: token.colorPrimary
                }}
                size={23}
                rev={undefined}
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title={dictionary.en.view}>
            <FilePdfOutlined
              style={{
                cursor: 'pointer',
                fontSize: token.fontSizeXL,
                color: token.colorPrimary
              }}
              rev={undefined}
              onClick={() => {
                setSelectedTableListItem(record);
                setShowFileViewModal(true);
              }}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div>
      <AppRouteBlocker open={blockRoute} />
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
                  title: (
                    <Link to="/edc">
                      {dictionary.en.electronicDocumentCycle}
                    </Link>
                  )
                },
                {
                  title: dictionary.en.edcCreateAddition
                }
              ]}
            />
          </Space>
          <Space>
            <Tooltip title={dictionary.en.navigateToBack}>
              <Button
                onClick={() => {
                  navigate(-1);
                }}
                type="default"
              >
                <Space>
                  <CloseOutlined rev={undefined} />
                </Space>
              </Button>
            </Tooltip>

            <Button
              onClick={() => {
                setFormIsRequired(false);
              }}
              htmlType="submit"
              form="create-contract-form"
              type="default"
              loading={draftSubmitLoading}
              disabled={draftSubmitLoading}
            >
              <Space>{dictionary.en.save}</Space>
            </Button>
            <Button
              onClick={() => {
                setFormIsRequired(true);
              }}
              form="create-contract-form"
              htmlType="submit"
              loading={mainSubmitLoading}
              disabled={mainSubmitLoading}
              type="primary"
            >
              <Space>{dictionary.en.send}</Space>
            </Button>
          </Space>
        </Row>
      </Card>
      <Card size="small" className="box box-margin-y">
        {!skeleton ? (
          <Form
            id="create-contract-form"
            onFinish={handleSubmit(onSubmit)}
            layout={!lg ? 'vertical' : 'horizontal'}
          >
            <Timeline
              style={{ color: token.colorPrimary, padding: token.paddingMD }}
            >
              <Timeline.Item
                dot={
                  <InfoCircleOutlined
                    rev={undefined}
                    onClick={() => handleDotClick('1')}
                    style={getTimeLineStyle(token)}
                  />
                }
                color="blue"
              >
                <div
                  aria-hidden
                  onClick={() => {
                    handleDotClick('1');
                  }}
                >
                  <Collapse
                    defaultActiveKey="1"
                    activeKey={activeKeys}
                    style={{ marginLeft: token.marginMD }}
                  >
                    <Collapse.Panel header={dictionary.en.exchangeData} key="1">
                      <div onClick={e => e.stopPropagation()} aria-hidden>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={24}>
                            <AppHandledSelect
                              label={dictionary.en.contractNumber}
                              name="contractNumber"
                              control={control}
                              required
                              placeholder={inputPlaceholderText(
                                dictionary.en.contractNumber
                              )}
                              getLabelOnChange
                              onChangeApp={(e: IEdcDocsListOptions) => {
                                setValue(
                                  'RecieverLegalEntityVoen',
                                  e?.receiverVoen
                                );
                                setValue(
                                  'RecieverLegalEntityName',
                                  e?.receiverName
                                );
                              }}
                              errors={errors}
                              selectProps={{
                                loading: docsListOptionsLoading,
                                disabled: docsListOptionsLoading,
                                showSearch: true,
                                id: 'contractNumber',
                                placeholder: selectPlaceholderText(
                                  dictionary.en.contractNumber
                                ),
                                className: 'w-full',
                                options: docsListOptions,
                                size: 'large'
                              }}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8 },
                                style: { fontWeight: 'bolder' }
                              }}
                            />
                          </Col>
                          <Col className="gutter-row" span={24}>
                            <AppHandledInput
                              label={dictionary.en.sendingLegalEntityVAT}
                              name="SenderLegalEntityVoen"
                              control={control}
                              required={false}
                              inputType="text"
                              placeholder={inputPlaceholderText(
                                dictionary.en.sendingLegalEntityVAT
                              )}
                              errors={errors}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8 },
                                style: { fontWeight: 'bolder' }
                              }}
                              inputProps={{
                                size: 'large',
                                disabled: true
                              }}
                            />
                          </Col>
                          <Col className="gutter-row" span={24}>
                            <AppHandledInput
                              label={dictionary.en.sendingLegalEntity}
                              name="SenderLegalEntityName"
                              control={control}
                              required={false}
                              inputType="text"
                              placeholder={inputPlaceholderText(
                                dictionary.en.sendingLegalEntity
                              )}
                              errors={errors}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8 },
                                style: { fontWeight: 'bolder' }
                              }}
                              inputProps={{
                                size: 'large',
                                disabled: true
                              }}
                            />
                          </Col>
                          <Col className="gutter-row" span={24}>
                            <AppHandledInput
                              label={dictionary.en.receivingLegalEntityVAT}
                              name="RecieverLegalEntityVoen"
                              control={control}
                              required
                              inputType="text"
                              placeholder={inputPlaceholderText(
                                dictionary.en.receivingLegalEntityVAT
                              )}
                              errors={errors}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8 },
                                style: { fontWeight: 'bolder' }
                              }}
                              inputProps={{
                                size: 'large',

                                disabled: true
                              }}
                            />
                          </Col>

                          <Col className="gutter-row" span={24}>
                            <AppHandledInput
                              label={dictionary.en.receivingLegalEntity}
                              name="RecieverLegalEntityName"
                              control={control}
                              required
                              inputType="text"
                              placeholder={inputPlaceholderText(
                                dictionary.en.receivingLegalEntity
                              )}
                              errors={errors}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8 },
                                style: { fontWeight: 'bolder' }
                              }}
                              inputProps={{
                                size: 'large',
                                disabled: true
                              }}
                            />
                          </Col>
                        </Row>
                      </div>
                    </Collapse.Panel>
                  </Collapse>
                </div>
              </Timeline.Item>
              <Timeline.Item
                dot={
                  <InfoCircleOutlined
                    rev={undefined}
                    onClick={() => handleDotClick('2')}
                    style={getTimeLineStyle(token)}
                  />
                }
                color="blue"
              >
                <div aria-hidden onClick={() => handleDotClick('2')}>
                  <Collapse
                    activeKey={activeKeys}
                    style={{ marginLeft: token.marginMD }}
                  >
                    <Collapse.Panel header={dictionary.en.docInfo} key="2">
                      <div onClick={e => e.stopPropagation()} aria-hidden>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={24}>
                            <AppHandledDate
                              label={dictionary.en.additionDate}
                              name="StartDate"
                              control={control}
                              required
                              rules={{
                                required: {
                                  value: formIsRequired,
                                  message: inputValidationText(
                                    dictionary.en.additionDate
                                  )
                                }
                              }}
                              placeholder={dictionary.en.ddmmyyyy}
                              errors={errors}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8 },
                                style: { fontWeight: 'bolder' }
                              }}
                              dateProps={{
                                size: 'large',
                                style: {
                                  width: '100%'
                                },
                                format: 'DD.MM.YYYY'
                              }}
                            />
                          </Col>

                          <Col className="gutter-row" span={24}>
                            <AppHandledTextArea
                              label={dictionary.en.summary}
                              name="Description"
                              control={control}
                              required={false}
                              placeholder={inputPlaceholderText(
                                dictionary.en.summary
                              )}
                              errors={errors}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8 },
                                style: { fontWeight: 'bolder' }
                              }}
                              textareaProps={{
                                size: 'large',
                                row: 112
                              }}
                            />
                          </Col>
                        </Row>
                      </div>
                    </Collapse.Panel>
                  </Collapse>
                </div>
              </Timeline.Item>
              <Timeline.Item
                dot={
                  <InfoCircleOutlined
                    rev={undefined}
                    onClick={() => handleDotClick('3')}
                    style={getTimeLineStyle(token)}
                  />
                }
                color="blue"
              >
                <div aria-hidden onClick={() => handleDotClick('3')}>
                  <Collapse
                    activeKey={activeKeys}
                    style={{ marginLeft: token.marginMD }}
                  >
                    <Collapse.Panel
                      extra={
                        <Tooltip title={dictionary.en.uploadFile}>
                          <PlusCircleOutlined
                            onClick={e => {
                              watch('tableFileList')?.length < 1
                                ? setShowUploadFileModal(true)
                                : toast.warn(
                                    'Yalnız 1 sənəd əlavə edə bilərsiniz',
                                    toastOptions
                                  );
                              e.stopPropagation();
                            }}
                            style={{
                              fontSize: token.fontSizeHeading4
                            }}
                            rev={undefined}
                          />
                        </Tooltip>
                      }
                      header={dictionary.en.docInfo}
                      key="3"
                    >
                      <div onClick={e => e.stopPropagation()} aria-hidden>
                        {watch('tableFileList')?.length ? (
                          <div>
                            <Table
                              pagination={false}
                              size="small"
                              locale={{
                                emptyText: <AppEmpty />
                              }}
                              columns={columns}
                              dataSource={
                                watch('tableFileList')?.length
                                  ? watch('tableFileList')
                                  : []
                              }
                            />
                          </div>
                        ) : (
                          <AppEmpty />
                        )}
                      </div>
                    </Collapse.Panel>
                  </Collapse>
                </div>
              </Timeline.Item>
            </Timeline>
          </Form>
        ) : (
          <div>
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
          </div>
        )}
      </Card>
      <Modal
        width={700}
        destroyOnClose
        title={dictionary.en.uploadFile}
        open={showUploadFileModal}
        onCancel={handleClose}
        cancelText={dictionary.en.closeBtn}
        okText={dictionary.en.save}
        footer={[
          <Button>{dictionary.en.closeBtn}</Button>,
          <Button
            form="file-upload-modal-form"
            type="primary"
            key="submit"
            htmlType="submit"
          >
            {dictionary.en.save}
          </Button>
        ]}
      >
        <SingleFileUpload
          setShowUploadFileModal={setShowUploadFileModal}
          globalSetvalue={setValue}
        />
      </Modal>
      <Modal
        open={showFileViewModal}
        title={selectedTableListItem?.name}
        onCancel={() => setShowFileViewModal(false)}
        destroyOnClose
        width={992}
        cancelText={dictionary.en.closeBtn}
        okText={dictionary.en.save}
        footer={[
          <Button onClick={() => setShowFileViewModal(false)}>
            {dictionary.en.closeBtn}
          </Button>
        ]}
      >
        <ViewFileModal src={selectedTableListItem} />
      </Modal>
    </div>
  );
}

export default UpdateAddition;
