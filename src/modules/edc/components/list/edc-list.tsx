/* eslint-disable no-debugger */
import {
  Breadcrumb,
  Typography,
  Space,
  Col,
  Row,
  Form,
  Collapse,
  Button,
  Tooltip,
  Card,
  theme,
  Tabs,
  Spin,
  Dropdown,
  MenuProps,
  Grid
} from 'antd';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  DownOutlined,
  FileAddOutlined,
  UndoOutlined
} from '@ant-design/icons';
import { useEffect, useState } from 'react';

import {
  inputPlaceholderText,
  // noDataText,
  // resetTxt,
  // searchTxt,
  selectPlaceholderText
} from '@/utils/constants/texts';
import { dictionary } from '@/utils/constants/dictionary';
import AppHandledInput from '@/components/forms/input/handled-input';
import AppHandledSelect from '@/components/forms/select/handled-select';
import { EdcServies } from '@/services/edc-services/edc-services';
import { IHTTPSParams } from '@/services/adapter-config/config';
import { convertFormDataToQueryParams } from '@/utils/functions/functions';
import AppPagination from '@/components/display/pagination';
// import * as signalR from '@microsoft/signalr';
import AppEmpty from '@/components/display/empty';
import DeleteConfirmationModal from '@/components/display/DeleteConfirmationModal';
import { toastOptions } from '@/configs/global-configs';
import { toast } from 'react-toastify';
import RejectModal from '@/components/feedback/reject-modal';
import ReturnModal from '@/components/feedback/return-modal';
import EdcListItemCard from './edc-list-item-card';
import {
  IDeleteEdcItemResponse,
  IEdcListFilter,
  IEdcListItem,
  IGetEdcListResponse
} from '../../models';
import { DocumentTypeId, Status, items } from '../../constants/static-options';
import { edcListTabNavs } from '../../constants/variables';

function EdcList() {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<IEdcListFilter>({
    mode: 'onChange',
    defaultValues: {
      DocumentCode: '',
      SenderLegalEntityId: '',
      SenderLegalEntityVoen: '',
      RecieverLegalEntityId: '',
      RecieverLegalEntityVoen: '',
      DocumentTypeId: null,
      DocumentStatusId: null,
      status: null
    }
  });

  const { useBreakpoint } = Grid;
  const { md } = useBreakpoint();

  // useEffect(() => {
  //   const connection = new signalR.HubConnectionBuilder()
  //     .withUrl('wss://cloud2.ninco.org:8443/hubs/notification', {
  //       headers: {
  //         AuthPerson:
  //           'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJUb2tlbklkIjoiYjIyNjZlYzYtMzQxMC00Yzg0LTk2NjUtYTkwOTVhYTZjMGNhIiwiVXNlcklkIjoxLCJDb25zdW1lcklkIjoxMCwibmJmIjoxNjkzMjI0ODU2LCJleHAiOjE2OTMzMTEyNTYsImlhdCI6MTY5MzIyNDg1Nn0.HCO92_HnMP2deaU-FD-YxEeV25c_EWZZTjrqO-bngm0',
  //         foo: 'bar'
  //       }
  //       // transport: signalR.HttpTransportType.WebSockets,
  //       // skipNegotiation: true
  //     })
  //     .configureLogging(signalR.LogLevel.Information)
  //     .build();

  //   async function start() {
  //     try {
  //       await connection.start();
  //       console.log('SignalR Connected.', 'subhan');
  //     } catch (err) {
  //       console.log(err);
  //       setTimeout(start, 5000);
  //     }
  //   }

  //   connection.onclose(async () => {
  //     console.log('Connection closed, retying...', 'subhan');
  //     await start();
  //   });

  //   connection.on('Ping', data => {
  //     console.log('Data received!', 'subhan');
  //     console.log(data, 'subhan');
  //   });

  //   // Start the connection.
  //   start();
  // }, []);

  const [edcListData, setEdcListData] = useState<IGetEdcListResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [page, setCurrentPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('1');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] =
    useState<Partial<IEdcListItem> | null>(null);
  const [showRejectForm, setShowRejectForm] = useState<boolean>(false);
  const [showReturnForm, setShowReturnForm] = useState<boolean>(false);

  const { Text } = Typography;
  const { useToken } = theme;
  const { token } = useToken();
  const navigate = useNavigate();

  const fetchEdcList = async () => {
    setLoading(true);

    const res: IGetEdcListResponse = await EdcServies.getInstance().getEdcList([
      ...queryParams,
      { name: 'page', value: page },
      { name: 'Tab', value: activeTab }
    ]);
    setEdcListData(res);
    if (res.IsSuccess) {
      setEdcListData(res);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleModalVisibility = () => {
    setModalVisible(true);
  };

  const onCloseModal = () => {
    setModalVisible(false);
  };

  const onSubmit: SubmitHandler<IEdcListFilter> = async (
    data: IEdcListFilter
  ) => {
    setCurrentPage(1);
    const queryParamsData: IHTTPSParams[] =
      convertFormDataToQueryParams<IEdcListFilter>(data);
    setQueryParams(queryParamsData);
    setRefreshComponent(!refreshComponent);
  };

  const deleteDocument = async () => {
    if (selectedItem) {
      const res: IDeleteEdcItemResponse =
        await EdcServies.getInstance().deleteDocument(selectedItem.Id);
      if (res.IsSuccess) {
        toast.success(dictionary.en.successTxt, toastOptions);
        setModalVisible(false);
      }
    }
    setRefreshComponent(z => !z);
  };

  const deleteDraft = async () => {
    if (selectedItem) {
      const res: IDeleteEdcItemResponse =
        await EdcServies.getInstance().deleteExtra(selectedItem.Id, () =>
          setLoading(false)
        );
      if (res.IsSuccess) {
        toast.success(res.Data?.message, toastOptions);
        setModalVisible(false);
      }
    }
    setRefreshComponent(z => !z);
  };

  const onConfirmDelete = () => {
    if (selectedItem?.isDraft) {
      deleteDraft();
    } else {
      deleteDocument();
    }
  };

  useEffect(() => {
    fetchEdcList();
  }, [page, activeTab, refreshComponent]);

  const handleMenuClick: MenuProps['onClick'] = e => {
    console.log('click', e);
    if (e?.key === '2') {
      navigate('create-addition');
    } else if (e?.key === '3') {
      navigate('create-invoice');
    } else if (e?.key === '4') {
      navigate('create-act');
    }
  };
  const menuProps = {
    items,
    onClick: handleMenuClick
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
                  title: dictionary.en.electronicDocumentCycle
                }
              ]}
            />
          </Space>

          <Space>
            <Dropdown menu={menuProps} trigger={['click']}>
              <Button
                style={{
                  borderColor: token.colorPrimary,
                  color: token.colorPrimary
                }}
                type="default"
              >
                <Space>
                  {dictionary.en.additionalDocuments}
                  <DownOutlined rev={undefined} />
                </Space>
              </Button>
            </Dropdown>
            <div>
              <Button
                onClick={() => {
                  navigate('create-contract');
                }}
                type="primary"
              >
                <Space>
                  <FileAddOutlined rev={undefined} />
                  {dictionary.en.contract}
                </Space>
              </Button>
            </div>
          </Space>
        </Row>
      </Card>
      <Card size="small" className="box box-margin-y ">
        <div>
          <Collapse
            expandIconPosition="end"
            ghost
            style={{
              padding: '0'
            }}
            defaultActiveKey="1"
            size="small"
          >
            <Collapse.Panel
              key={1}
              header={<Text type="secondary">{dictionary.en.filter}</Text>}
            >
              <Form
                onFinish={handleSubmit(onSubmit)}
                layout="vertical"
                labelWrap={false}
              >
                <Row gutter={16}>
                  <Col
                    className="gutter-row"
                    style={{ marginBottom: token.marginSM }}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                  >
                    <AppHandledSelect
                      label={dictionary.en.documentType}
                      name="DocumentTypeId"
                      control={control}
                      required={false}
                      placeholder={inputPlaceholderText(
                        dictionary.en.documentType
                      )}
                      formItemProps={{
                        style: { fontSize: md ? '10px' : '12px', color: 'red' }
                      }}
                      errors={errors}
                      selectProps={{
                        allowClear: true,
                        showSearch: true,
                        id: 'DocumentTypeId',
                        placeholder: selectPlaceholderText(
                          dictionary.en.documentType
                        ),
                        className: 'w-full',
                        options: DocumentTypeId
                      }}
                    />
                  </Col>
                  <Col
                    className="gutter-row"
                    style={{ marginBottom: token.marginSM }}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                  >
                    <AppHandledInput
                      label={dictionary.en.documentNumber}
                      name="DocumentCode"
                      control={control}
                      required={false}
                      inputType="text"
                      placeholder={inputPlaceholderText(
                        dictionary.en.documentNumber
                      )}
                      errors={errors}
                    />
                  </Col>
                  <Col
                    className="gutter-row"
                    style={{ marginBottom: token.marginSM }}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                  >
                    <AppHandledInput
                      label={dictionary.en.sendingCompany}
                      name="SenderLegalEntity"
                      control={control}
                      required={false}
                      inputType="text"
                      placeholder={inputPlaceholderText(
                        dictionary.en.sendingCompany
                      )}
                      formItemProps={{
                        labelCol: { sm: { span: 24, offset: 0 } },
                        style: { fontSize: md ? '8px' : '6px' }
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col
                    className="gutter-row"
                    style={{ marginBottom: token.marginSM }}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                  >
                    <AppHandledInput
                      label={dictionary.en.sendingLegalEntityVAT}
                      required={false}
                      name="SenderLegalEntityVoen"
                      control={control}
                      inputType="text"
                      placeholder={inputPlaceholderText(
                        dictionary.en.sendingLegalEntityVAT
                      )}
                      formItemProps={{
                        labelCol: { sm: { span: 24, offset: 0 } },
                        style: {
                          fontSize: md ? '8px !important' : '6px',
                          whiteSpace: 'nowrap'
                        }
                      }}
                      errors={errors}
                    />
                  </Col>

                  <Col
                    className="gutter-row"
                    style={{ marginBottom: token.marginSM }}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                  >
                    <AppHandledInput
                      label={dictionary.en.receivingCompany}
                      required={false}
                      name="RecieverLegalEntity"
                      control={control}
                      inputType="text"
                      placeholder={inputPlaceholderText(
                        dictionary.en.receivingCompany
                      )}
                      formItemProps={{
                        style: { fontSize: md ? '10px' : '12px' }
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col
                    className="gutter-row"
                    style={{ marginBottom: token.marginSM }}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                  >
                    <AppHandledInput
                      label={dictionary.en.receivingLegalEntityVAT}
                      name="RecieverLegalEntityVoen"
                      control={control}
                      required={false}
                      inputType="text"
                      placeholder={inputPlaceholderText(
                        dictionary.en.receivingLegalEntityVAT
                      )}
                      formItemProps={{
                        style: { fontSize: md ? '10px' : '12px' }
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col
                    className="gutter-row"
                    style={{ marginBottom: token.marginSM }}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                  >
                    <AppHandledSelect
                      label={dictionary.en.status}
                      required={false}
                      name="DocumentStatusId"
                      control={control}
                      placeholder={inputPlaceholderText(dictionary.en.status)}
                      errors={errors}
                      formItemProps={{
                        style: { fontSize: md ? '10px' : '12px' }
                      }}
                      selectProps={{
                        allowClear: true,
                        showSearch: true,
                        id: 'Status',
                        placeholder: selectPlaceholderText(
                          dictionary.en.status
                        ),
                        className: 'w-full',
                        options: Status
                      }}
                    />
                  </Col>
                </Row>
                <Row justify="end">
                  <div style={{ textAlign: 'right' }}>
                    <Space size="small">
                      <Tooltip title={dictionary.en.resetTxt}>
                        <Button
                          onClick={() => {
                            reset();
                            setCurrentPage(1);
                            setQueryParams([]);
                            setRefreshComponent(r => !r);
                          }}
                          type="dashed"
                          icon={<UndoOutlined rev={undefined} />}
                        />
                      </Tooltip>
                      <Button type="primary" htmlType="submit">
                        {dictionary.en.searchTxt}
                      </Button>
                    </Space>
                  </div>
                </Row>
              </Form>
            </Collapse.Panel>
          </Collapse>
        </div>
      </Card>
      <Card size="small" className="box box-margin-y">
        <Row justify="space-between" style={{ padding: token.paddingXS }}>
          <Text type="secondary">
            {dictionary.en.table} (
            {edcListData?.Data?.TotalDataCount ?? dictionary.en.noDataText})
          </Text>
          <Tabs
            style={{
              width: '400px'
            }}
            moreIcon={false}
            size="small"
            defaultActiveKey="1"
            items={edcListTabNavs}
            destroyInactiveTabPane
            onChange={(z: string) => {
              setActiveTab(z);
              setCurrentPage(1);
            }}
          />
        </Row>
        <Row justify="center" style={{ padding: token.paddingXS }}>
          {edcListData?.Data?.Datas.length ? (
            <Spin size="large" spinning={loading}>
              <Row gutter={[0, 10]}>
                {edcListData?.Data?.Datas?.map((z: IEdcListItem) => (
                  <Col span={24} key={z.Id}>
                    {' '}
                    <EdcListItemCard
                      isDraft={z?.isDraft}
                      Id={z?.Id}
                      DocumentStatus={z?.DocumentStatus}
                      DocumentTypeId={z?.DocumentTypeId}
                      DocumentType={z?.DocumentType}
                      DocumentCode={z?.DocumentCode}
                      RecieverLegalEntity={z?.RecieverLegalEntity}
                      RecieverLegalEntityVoen={z?.RecieverLegalEntityVoen}
                      SenderLegalEntity={z?.SenderLegalEntity}
                      SenderLegalEntityVoen={z?.SenderLegalEntityVoen}
                      DocumentStatusId={z?.DocumentStatusId}
                      setSelectedItem={setSelectedItem}
                      handleModalVisibility={handleModalVisibility}
                      permission={z?.permission}
                      setRefreshComponent={setRefreshComponent}
                      setShowRejectForm={setShowRejectForm}
                      setShowReturnForm={setShowReturnForm}
                    />
                  </Col>
                ))}
              </Row>
            </Spin>
          ) : (
            <Spin size="large" spinning={loading}>
              <AppEmpty />
            </Spin>
          )}

          {/* <Table
            pagination={false}
            size="small"
            locale={{
              emptyText: <AppEmpty />
            }}
            loading={{ spinning: loading, size: 'large' }}
            columns={columns}
            dataSource={edcListData?.datas?.datas}
          /> */}
        </Row>
        <Row justify="end" style={{ padding: token.paddingXS }}>
          {edcListData?.Data?.Datas?.length ? (
            <AppPagination
              style={{ marginTop: '20px', marginBottom: '20px' }}
              current={page}
              total={edcListData?.Data?.TotalDataCount}
              onChange={(z: number) => setCurrentPage(z)}
            />
          ) : null}
        </Row>
      </Card>
      <DeleteConfirmationModal
        onCancel={onCloseModal}
        onOk={onConfirmDelete}
        visible={modalVisible}
      />
      <RejectModal
        setRefreshComponent={setRefreshComponent}
        id={selectedItem?.Id}
        showRejectForm={showRejectForm}
        setShowRejectForm={setShowRejectForm}
      />
      <ReturnModal
        setRefreshComponent={setRefreshComponent}
        id={selectedItem?.Id}
        showReturnForm={showReturnForm}
        setShowReturnForm={setShowReturnForm}
      />
    </div>
  );
}

export default EdcList;
