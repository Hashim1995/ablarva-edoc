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
  UndoOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilePdfOutlined,
  PlusCircleOutlined,
  SwapOutlined,
  FileAddOutlined,
  RetweetOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { dictionary } from '@/utils/constants/dictionary';
import {
  inputPlaceholderText,
  selectPlaceholderText
} from '@/utils/constants/texts';
import AppHandledInput from '@/components/forms/input/handled-input';
import AppHandledSelect from '@/components/forms/select/handled-select';
import { docStatusOptions } from '@/utils/constants/options';
import AppHandledTextArea from '@/components/forms/text-area/handled-text-area';
import {
  inputValidationText,
  maxLengthCheck,
  minLengthCheck
} from '@/utils/constants/validations';
import AppEmpty from '@/components/display/empty';
import {
  formatDate,
  showCloseConfirmationModal
} from '@/utils/functions/functions';
import { ColumnsType } from 'antd/es/table';
import { toast } from 'react-toastify';
import { getTimeLineStyle, toastOptions } from '@/configs/global-configs';
import { EdcServies } from '@/services/edc-services/edc-services';
import AppHandledInputWithButton from '@/components/forms/input/handled-input-with-button';
import { ICreateResponse, selectOption } from '@/models/common';
import ViewFileModal from '@/components/display/view-file-modal';
import AppRouteBlocker from '@/components/display/blocker';
import {
  ICompanyDetailResponse,
  IEdcContractForm,
  IEdcContractPayload,
  IEdcContractTableFileListItem,
  IGetEdcContractByIdResponse,
  IGetTemplatesListResponse
} from '../../../models';
import AppHandledDate from '../../../../../components/forms/date/handled-date';
import FileUploadModal from '../../../modals/file-upload';

function UpdateContract() {
  const { id } = useParams();
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<IEdcContractForm>({
    mode: 'onChange',
    defaultValues: {
      SenderLegalEntityVoen: '',
      SenderLegalEntityName: '',
      RecieverLegalEntityVoen: '',
      RecieverLegalEntityName: '',
      ProssesType: null,
      StartDate: '',
      ExpireDate: '',
      RenewalDate: '',
      Description: '',
      tableFileList: []
    }
  });
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const [showUploadFileModal, setShowUploadFileModal] = useState(false);
  const [formIsRequired, setFormIsRequired] = useState<boolean>(false);
  const [selectedTableListItem, setSelectedTableListItem] =
    useState<IEdcContractTableFileListItem>();
  const [showFileViewModal, setShowFileViewModal] = useState<boolean>(false);

  const [activeKeys, setActiveKeys] = useState<string[]>(['1']);
  const [voenInputLoading, setVoenInputLoading] = useState<boolean>(false);
  const [disableRecieverVoen, setdisableRecieverVoen] =
    useState<boolean>(false);
  const [mainSubmitLoading, setMainSubmitLoading] = useState<boolean>(false);
  const [draftSubmitLoading, setDraftSubmitLoading] = useState<boolean>(false);
  const [skeleton, setSkeleton] = useState<boolean>(true);
  const [blockRoute, setBlockRoute] = useState(true);
  const [senderLegalEntityVoen, setSenderLegalEntityVoen] = useState<
    string | null
  >('');
  const [templatesListLoading, setTemplatesListLoading] =
    useState<boolean>(false);
  const [templatesList, setTemplatesList] =
    useState<IGetTemplatesListResponse>();

  const getByID = async (docId: string) => {
    const isDraft: boolean = pathname?.includes('draft');

    const res: IGetEdcContractByIdResponse =
      await EdcServies.getInstance().getContractById(docId, isDraft);

    if (res.IsSuccess) {
      setSkeleton(false);
      const { Data } = res;
      setSenderLegalEntityVoen(Data?.SenderLegalEntityVoen ?? '');
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
      setValue(
        'ExpireDate',
        Data?.ExpireDate
          ? dayjs(formatDate(Data?.ExpireDate ?? ''), 'DD.MM.YYYY')
          : ''
      );
      setValue(
        'RenewalDate',
        Data?.RenewalDate
          ? dayjs(formatDate(Data?.RenewalDate ?? ''), 'DD.MM.YYYY')
          : ''
      );

      setValue('tableFileList', Data?.TableFileList);

      const ProssesTypeObj = docStatusOptions.find(
        (z: selectOption) => z?.value === Data?.ProssesType
      );

      setValue('ProssesType', ProssesTypeObj ? [ProssesTypeObj] : null);
    }
  };

  const fetchTemplatesList = async () => {
    setTemplatesListLoading(true);
    const res: IGetTemplatesListResponse =
      await EdcServies.getInstance().getTemplatesList();
    setTemplatesList(res);
    setTemplatesListLoading(false);
  };

  useEffect(() => {
    id && getByID(id);
    fetchTemplatesList();
    window.scrollTo(0, 0);
  }, [id]);

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

  const updateMainContract = async (data: IEdcContractPayload) => {
    const isDraft: boolean = pathname?.includes('draft');
    if (data?.tableFileList?.length !== 2) {
      toast.error(inputValidationText(dictionary.en.doc), toastOptions);
      return;
    }
    setMainSubmitLoading(true);

    const res: ICreateResponse =
      await EdcServies.getInstance().updateContractMain(
        String(id),
        isDraft,
        data,
        () => {
          setMainSubmitLoading(false);
        }
      );
    if (res.IsSuccess) {
      toast.success(dictionary.en.successTxt, toastOptions);
      navigate(`/edc/view-contract/${res?.Data?.id}`);
    } else {
      toast.error(res.Errors[0], toastOptions);
      setMainSubmitLoading(false);
    }
    setMainSubmitLoading(false);
  };

  const updateDraftContract = async (data: IEdcContractPayload) => {
    const isDraft: boolean = pathname?.includes('draft');
    setDraftSubmitLoading(true);

    const res: ICreateResponse =
      await EdcServies.getInstance().updateContractDraft(
        String(id),
        isDraft,
        data,
        () => {
          setDraftSubmitLoading(false);
        }
      );
    if (res.IsSuccess) {
      toast.success(dictionary.en.successTxt, toastOptions);
      navigate(`/edc/view-contract/draft/${res?.Data?.id}`);
    } else {
      toast.error(res.Errors[0], toastOptions);
      setDraftSubmitLoading(false);
    }
    setDraftSubmitLoading(false);
  };

  const onSubmit: SubmitHandler<IEdcContractForm> = async (
    data: IEdcContractForm
  ) => {
    setBlockRoute(false);
    const startDate = new Date(
      data.StartDate.$y,
      data.StartDate.$M,
      data.StartDate.$D
    );
    const expireDate = new Date(
      data.ExpireDate.$y,
      data.ExpireDate.$M,
      data.ExpireDate.$D
    );
    const renewalDate = new Date(
      data.RenewalDate.$y,
      data.RenewalDate.$M,
      data.RenewalDate.$D
    );

    const payload: IEdcContractPayload = {
      ...data,
      RecieverLegalEntityName: data?.RecieverLegalEntityName,
      RecieverLegalEntityVoen: data?.RecieverLegalEntityVoen,
      ProssesType: Array.isArray(data?.ProssesType)
        ? data?.ProssesType[0].value
        : data?.ProssesType,
      Description: data?.Description,
      ExpireDate: data?.ExpireDate
        ? dayjs(expireDate.toISOString()).format()
        : null,
      RenewalDate: data?.RenewalDate
        ? dayjs(renewalDate.toISOString()).format()
        : null,
      StartDate: data?.StartDate
        ? dayjs(startDate.toISOString()).format()
        : null,
      tableFileList: data?.tableFileList?.map(z => ({
        type: z?.type,
        id: z?.id
      }))
    };

    console.log(formIsRequired, 'test');

    if (formIsRequired) {
      updateMainContract(payload);
    } else {
      updateDraftContract(payload);
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
      render: (record: number) =>
        record === 1
          ? dictionary.en.fileTypeIsMain
          : dictionary.en.fileTypeIsPrivate
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

  const getByVoen = async () => {
    if (senderLegalEntityVoen === watch('RecieverLegalEntityVoen')) {
      toast.error(dictionary.en.voenMustBeDifferent, toastOptions);
    } else {
      setVoenInputLoading(true);
      const res: ICompanyDetailResponse =
        await EdcServies.getInstance().getByVoen(
          watch('RecieverLegalEntityVoen'),
          () => {
            setVoenInputLoading(false);
            setValue('RecieverLegalEntityName', '');
          }
        );

      if (res.IsSuccess) {
        setValue('RecieverLegalEntityName', res?.Data?.Name);
        setdisableRecieverVoen(true);
        toast.success(dictionary.en.successTxt, toastOptions);
      }
      setVoenInputLoading(false);
    }
  };

  const suffix = watch('RecieverLegalEntityName') ? (
    <Tooltip title={dictionary.en.resetTxt}>
      <Button
        onClick={() => {
          setVoenInputLoading(false);
          setValue('RecieverLegalEntityName', '');
          setdisableRecieverVoen(false);
          2348593049;
        }}
        type="dashed"
        icon={<UndoOutlined rev={undefined} />}
      />
    </Tooltip>
  ) : (
    <Tooltip title={dictionary.en.searchTxt}>
      <Button
        onClick={() => {
          getByVoen();
        }}
        type="dashed"
        icon={<SearchOutlined rev={undefined} />}
      />
    </Tooltip>
  );
  return (
    <div>
      <AppRouteBlocker open={blockRoute} />

      <Card size="small" className="box box-margin-y">
        <Row justify="space-between" gutter={[24, 24]} align="middle">
          <Col>
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
                    title: (
                      <Link to="/edc">{`${dictionary.en.viewDoc} - ${id}`}</Link>
                    )
                  },
                  {
                    title: `${dictionary.en.editDoc} - ${id}`
                  }
                ]}
              />
            </Space>
          </Col>
          <Col>
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
                form="update-contract-form"
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
                form="update-contract-form"
                htmlType="submit"
                loading={mainSubmitLoading}
                disabled={mainSubmitLoading}
                type="primary"
              >
                <Space>{dictionary.en.editAndSend}</Space>
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
      <Card size="small" className="box box-margin-y">
        {!skeleton ? (
          <Form
            id="update-contract-form"
            onFinish={handleSubmit(onSubmit)}
            layout={!lg ? 'vertical' : 'horizontal'}
          >
            <Timeline
              style={{ color: token.colorPrimary, padding: token.paddingMD }}
            >
              <Timeline.Item
                dot={
                  <SwapOutlined
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
                            <AppHandledInputWithButton
                              rules={{
                                required: {
                                  value: formIsRequired,
                                  message: inputValidationText(
                                    dictionary.en.receivingLegalEntityVAT
                                  )
                                },
                                minLength: {
                                  value: 10,
                                  message: minLengthCheck(
                                    dictionary.en.receivingLegalEntityVAT,
                                    '10'
                                  )
                                },
                                maxLength: {
                                  value: 10,
                                  message: maxLengthCheck(
                                    dictionary.en.receivingLegalEntityVAT,
                                    '10'
                                  )
                                },
                                validate: {
                                  voenCheck: (value: string) =>
                                    /^\d{10}$/.test(value) ||
                                    dictionary.en.voenRegexChecker
                                }
                              }}
                              label={dictionary.en.receivingLegalEntityVAT}
                              name="RecieverLegalEntityVoen"
                              control={control}
                              required
                              inputType="text"
                              placeholder={inputPlaceholderText(
                                dictionary.en.receivingLegalEntityVAT
                              )}
                              btn={suffix}
                              errors={errors}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8 },
                                style: { fontWeight: 'bolder' }
                              }}
                              inputProps={{
                                size: 'large',

                                disabled:
                                  voenInputLoading || disableRecieverVoen
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
                          <Col className="gutter-row" span={24}>
                            <AppHandledSelect
                              label={dictionary.en.receiver}
                              name="Receiver"
                              control={control}
                              required
                              placeholder={inputPlaceholderText(
                                dictionary.en.receiver
                              )}
                              errors={errors}
                              selectProps={{
                                showSearch: true,
                                id: 'Receiver',
                                placeholder: selectPlaceholderText(
                                  dictionary.en.receiver
                                ),
                                className: 'w-full',
                                options: docStatusOptions,
                                size: 'large'
                              }}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8, sm: 12, md: 10, lg: 8 },
                                style: { fontWeight: 'bolder' }
                              }}
                            />
                          </Col>
                          <Col className="gutter-row" span={24}>
                            <AppHandledSelect
                              label={dictionary.en.forInfo}
                              name="ForInfo"
                              control={control}
                              placeholder={inputPlaceholderText(
                                dictionary.en.forInfo
                              )}
                              errors={errors}
                              selectProps={{
                                mode: 'multiple',
                                showSearch: true,
                                id: 'ForInfo',
                                placeholder: selectPlaceholderText(
                                  dictionary.en.forInfo
                                ),
                                className: 'w-full',
                                options: docStatusOptions,
                                size: 'large'
                              }}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8, sm: 12, md: 10, lg: 8 },
                                style: { fontWeight: 'bolder' }
                              }}
                            />
                          </Col>
                          <Col className="gutter-row" span={24}>
                            <AppHandledSelect
                              label={dictionary.en.docStatus}
                              name="ProssesType"
                              control={control}
                              required
                              placeholder={inputPlaceholderText(
                                dictionary.en.docStatus
                              )}
                              errors={errors}
                              selectProps={{
                                showSearch: true,
                                id: 'ProssesType',
                                placeholder: selectPlaceholderText(
                                  dictionary.en.docStatus
                                ),
                                className: 'w-full',
                                options: docStatusOptions,
                                size: 'large'
                              }}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8 },
                                style: { fontWeight: 'bolder' }
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
                  <RetweetOutlined
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
                    <Collapse.Panel header={dictionary.en.circulation} key="2">
                      <div onClick={e => e.stopPropagation()} aria-hidden>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={24}>
                            <AppHandledSelect
                              label={dictionary.en.templateName}
                              name="documentApprovalCycleId"
                              control={control}
                              required
                              placeholder={inputPlaceholderText(
                                dictionary.en.templateName
                              )}
                              getLabelOnChange
                              errors={errors}
                              selectProps={{
                                loading: templatesListLoading,
                                disabled: templatesListLoading,
                                showSearch: true,
                                id: 'documentApprovalCycleId',
                                placeholder: selectPlaceholderText(
                                  dictionary.en.templateName
                                ),
                                className: 'w-full',
                                options: templatesList?.Data?.Datas,
                                size: 'large'
                              }}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8, sm: 12, md: 10, lg: 8 },
                                style: { fontWeight: 'bolder' }
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
                    <Collapse.Panel header={dictionary.en.docInfo} key="3">
                      <div onClick={e => e.stopPropagation()} aria-hidden>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={24}>
                            <AppHandledDate
                              label={dictionary.en.contractDate}
                              name="StartDate"
                              control={control}
                              required
                              rules={{
                                required: {
                                  value: formIsRequired,
                                  message: inputValidationText(
                                    dictionary.en.contractDate
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
                              onChangeApp={() => {
                                setValue('RenewalDate', null);
                                setValue('ExpireDate', null);
                              }}
                              dateProps={{
                                size: 'large',
                                style: {
                                  width: '100%'
                                },
                                format: 'DD.MM.YYYY',

                                disabledDate: current =>
                                  current &&
                                  current < dayjs().endOf('day').add(-1, 'day')
                              }}
                            />
                            <AppHandledDate
                              label={dictionary.en.validityPeriodContract}
                              name="ExpireDate"
                              control={control}
                              required
                              rules={{
                                required: {
                                  value: formIsRequired,
                                  message: inputValidationText(
                                    dictionary.en.validityPeriodContract
                                  )
                                }
                              }}
                              placeholder={dictionary.en.ddmmyyyy}
                              errors={errors}
                              onChangeApp={() => {
                                setValue('RenewalDate', null);
                              }}
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
                                format: 'DD.MM.YYYY',
                                disabled: !watch('StartDate'),

                                disabledDate: current => {
                                  const v = dayjs(watch('StartDate'));
                                  return (
                                    current &&
                                    (current.isBefore(v) ||
                                      current.isSame(v, 'day'))
                                  );
                                }
                              }}
                            />
                          </Col>
                          <Col className="gutter-row" span={24}>
                            <AppHandledDate
                              label={dictionary.en.ContractRenewalPeriod}
                              name="RenewalDate"
                              control={control}
                              required
                              rules={{
                                required: {
                                  value: formIsRequired,
                                  message: inputValidationText(
                                    dictionary.en.ContractRenewalPeriod
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
                                format: 'DD.MM.YYYY',
                                disabled: !watch('ExpireDate'),
                                disabledDate: current => {
                                  const v = dayjs(watch('ExpireDate'));
                                  return (
                                    current &&
                                    (current.isBefore(v) ||
                                      current.isSame(v, 'day'))
                                  );
                                }
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
                  <FileAddOutlined
                    rev={undefined}
                    onClick={() => handleDotClick('4')}
                    style={getTimeLineStyle(token)}
                  />
                }
                color="blue"
              >
                <div aria-hidden onClick={() => handleDotClick('4')}>
                  <Collapse
                    activeKey={activeKeys}
                    style={{ marginLeft: token.marginMD }}
                  >
                    <Collapse.Panel
                      extra={
                        <Tooltip title={dictionary.en.uploadFile}>
                          <PlusCircleOutlined
                            onClick={e => {
                              watch('tableFileList')?.length < 2
                                ? setShowUploadFileModal(true)
                                : toast.warn(
                                    'Yalnız 2 sənəd əlavə edə bilərsiniz',
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
                      key="4"
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
          <Button onClick={handleClose}>{dictionary.en.closeBtn}</Button>,
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
        <FileUploadModal
          globalWatch={watch}
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

export default UpdateContract;
