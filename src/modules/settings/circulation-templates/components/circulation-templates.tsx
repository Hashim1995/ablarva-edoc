import { dictionary } from '@/utils/constants/dictionary';
import { useState, useEffect } from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Collapse,
  Dropdown,
  Form,
  MenuProps,
  Row,
  Space,
  Spin,
  Switch,
  Table,
  Tooltip,
  Typography,
  theme
} from 'antd';
import { HomeOutlined, UndoOutlined, MoreOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import AppHandledInput from '@/components/forms/input/handled-input';
import { IHTTPSParams } from '@/services/adapter-config/config';
import AppHandledSelect from '@/components/forms/select/handled-select';
import {
  inputPlaceholderText,
  selectPlaceholderText
} from '@/utils/constants/texts';
import { SubmitHandler, useForm } from 'react-hook-form';
import { convertFormDataToQueryParams } from '@/utils/functions/functions';
import { statusOptions } from '@/utils/constants/options';
import AppEmpty from '@/components/display/empty';
import AppPagination from '@/components/display/pagination';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { CirculationTemplateServies } from '@/services/circulation-template-services/circulation-template-service';
import { IGlobalResponse, selectOption } from '@/models/common';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '@/components/display/DeleteConfirmationModal';
import { toastOptions } from '@/configs/global-configs';
import {
  ICirculationTemplateFilter,
  ICirculationTemplateItem,
  IGetCirculationTemplatesResponse,
  IGetUsersResponse
} from '../models';
import AddTemplate from '../modals/add-template';
import EditTemplate from '../modals/edit-template';

function CirculationTemplates() {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ICirculationTemplateFilter>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      createdAt: '',
      updatedAt: '',
      status: null
    }
  });

  const { useToken } = theme;
  const { token } = useToken();
  const navigate = useNavigate();

  const [page, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<selectOption[]>([]);
  const [templateData, setTemplateData] =
    useState<IGetCirculationTemplatesResponse>();
  const [selectedItem, setSelectedItem] = useState<string>();
  const [showTemplateUpdateModal, setShowTemplateUpdateModal] =
    useState<boolean>(false);
  const [showAddTemplateModal, setShowTemplateAddModal] =
    useState<boolean>(false);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);

  const items: MenuProps['items'] = [
    {
      label: <Typography.Text>{dictionary.en.editBtn}</Typography.Text>,
      key: '0',
      disabled: usersLoading
    },
    {
      label: <Typography.Text>{dictionary.en.view}</Typography.Text>,
      key: '1'
    },
    {
      label: <Typography.Text>{dictionary.en.delete}</Typography.Text>,
      key: '2'
    }
  ];

  const handleMenuClick = (e: any, raw: ICirculationTemplateItem) => {
    if (e?.key === '0') {
      setSelectedItem(raw.id.toString());
      setShowTemplateUpdateModal(true);
    }
    if (e?.key === '1') {
      navigate(`/settings/circulation-templates/view/${raw.id}`);
    }
    if (e?.key === '2') {
      setSelectedItem(raw.id.toString());
      setShowDeleteConfirmationModal(true);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    const res: IGetUsersResponse =
      await CirculationTemplateServies.getInstance().getUsers();
    setUsersList(res.Data.Datas);
    setUsersLoading(false);
  };

  const fetchTemplateList = async () => {
    setLoading(true);
    const res: IGetCirculationTemplatesResponse =
      await CirculationTemplateServies.getInstance().getTemplateList([
        ...queryParams,
        { name: 'page', value: page }
      ]);
    setTemplateData(res);

    if (res.IsSuccess) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const onChangeStatus = async (id: number) => {
    setLoading(true);

    const res: IGlobalResponse =
      await CirculationTemplateServies.getInstance().changeStatus(id);
    if (res.IsSuccess) {
      setLoading(false);
      setRefreshComponent(!refreshComponent);
      toast.success(dictionary.en.statusSuccessMessage);
    } else {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<ICirculationTemplateFilter> = async (
    data: ICirculationTemplateFilter
  ) => {
    setCurrentPage(1);
    const queryParamsData: IHTTPSParams[] =
      convertFormDataToQueryParams<ICirculationTemplateFilter>(data);
    setQueryParams(queryParamsData);
    setRefreshComponent(!refreshComponent);
  };

  const closeDeleteConfirmationModal = () => {
    setShowDeleteConfirmationModal(false);
  };

  const deleteTemplate = async () => {
    if (selectedItem) {
      const res = await CirculationTemplateServies.getInstance().deleteTemplate(
        Number(selectedItem)
      );
      if (res.IsSuccess) {
        toast.success(res.Data?.Message, toastOptions);
        setShowDeleteConfirmationModal(false);
        setRefreshComponent(z => !z);
      }
    }
  };

  const columns: ColumnsType<ICirculationTemplateItem> = [
    {
      title: dictionary.en.templateName,
      dataIndex: 'name',
      key: 'name',

      render: record => (
        <Typography.Paragraph
          style={{
            margin: 0
          }}
          ellipsis={{
            rows: 1,
            tooltip: record
          }}
        >
          {record}
        </Typography.Paragraph>
      )
    },
    {
      title: dictionary.en.createdBy,
      dataIndex: 'createdBy',
      key: 'createdBy',

      render: record => (
        <Typography.Paragraph
          style={{
            margin: 0
          }}
          ellipsis={{
            rows: 1,
            tooltip: record
          }}
        >
          {record}
        </Typography.Paragraph>
      )
    },
    {
      title: dictionary.en.createdAt,
      dataIndex: 'createdDate',
      key: 'createdDate',
      responsive: ['lg'],
      render: (record: string) => (
        <Typography.Paragraph
          style={{
            margin: 0
          }}
          ellipsis={{
            rows: 1,
            tooltip: record ?? record
          }}
        >
          {dayjs(record).format('YYYY-MM-DD')}
        </Typography.Paragraph>
      )
    },
    {
      title: dictionary.en.updatedAt,
      dataIndex: 'updateDate',
      key: 'updateDate',
      responsive: ['lg'],
      render: (record: string) => (
        <Typography.Paragraph
          style={{
            margin: 0
          }}
          ellipsis={{
            rows: 1,
            tooltip: record ?? record
          }}
        >
          {record
            ? dayjs(record).format('YYYY-MM-DD')
            : dictionary.en.noDataText}
        </Typography.Paragraph>
      )
    },
    {
      title: dictionary.en.status,
      dataIndex: 'status',
      key: 'status',
      responsive: ['lg'],
      render: (record, raw: ICirculationTemplateItem) => (
        <Tooltip placement="top" title="Statusu dəyiş">
          <Switch
            checked={record === 1}
            onChange={() => {
              onChangeStatus(raw.id);
            }}
          />
        </Tooltip>
      )
    },
    {
      title: '',
      key: 'actions',
      align: 'end',

      render: (_, raw: ICirculationTemplateItem) => (
        <Space>
          <Dropdown
            menu={{
              items,
              onClick: e => handleMenuClick(e, raw)
            }}
            key={raw?.id}
            trigger={['click']}
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ];

  useEffect(() => {
    fetchUsers();
    fetchTemplateList();
  }, [page, refreshComponent]);

  return (
    <div>
      {' '}
      <Card size="small" className="box box-margin-y">
        <Row justify="space-between" align="middle">
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
                title: dictionary.en.internalStructure
              }
            ]}
          />

          <Button
            onClick={() => {
              setShowTemplateAddModal(true);
            }}
            loading={usersLoading}
            type="primary"
          >
            <Space>{dictionary.en.addBtn}</Space>
          </Button>
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
              header={
                <Typography.Text type="secondary">
                  {dictionary.en.filter}
                </Typography.Text>
              }
            >
              <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
                <Row gutter={16}>
                  <Col span={6}>
                    <AppHandledInput
                      label={dictionary.en.templateName}
                      name="name"
                      inputProps={{
                        id: 'name'
                      }}
                      control={control}
                      required={false}
                      inputType="text"
                      placeholder={inputPlaceholderText(
                        dictionary.en.templateName
                      )}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <AppHandledSelect
                      label={dictionary.en.status}
                      required={false}
                      name="status"
                      control={control}
                      placeholder={inputPlaceholderText(dictionary.en.status)}
                      errors={errors}
                      selectProps={{
                        allowClear: true,
                        showSearch: true,
                        id: 'status',
                        placeholder: selectPlaceholderText(
                          dictionary.en.status
                        ),
                        className: 'w-full',
                        options: statusOptions
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
      {templateData?.Data?.Datas.length ? (
        <Card className="box box-margin-y ">
          <Spin size="large" spinning={loading}>
            <Row style={{ padding: token.paddingXS }}>
              <Col span={24}>
                <Table
                  pagination={false}
                  locale={{
                    emptyText: <AppEmpty />
                  }}
                  scroll={{ x: 768 }}
                  columns={columns}
                  dataSource={
                    templateData?.Data?.Datas !== null
                      ? templateData?.Data?.Datas
                      : []
                  }
                />
              </Col>
            </Row>
            <Row justify="end" style={{ padding: token.paddingXS }}>
              <Col>
                <AppPagination
                  style={{ marginTop: '20px', marginBottom: '20px' }}
                  current={page}
                  total={templateData?.Data?.TotalDataCount}
                  onChange={(z: number) => setCurrentPage(z)}
                />
              </Col>
            </Row>
          </Spin>
        </Card>
      ) : (
        <Spin size="large" spinning={loading}>
          <Card>
            <AppEmpty />
          </Card>
        </Spin>
      )}
      {showAddTemplateModal && (
        <AddTemplate
          users={usersList}
          setShowTemplateAddModal={setShowTemplateAddModal}
          setRefreshComponent={setRefreshComponent}
          showAddTemplateModal={showAddTemplateModal}
        />
      )}
      {showTemplateUpdateModal && selectedItem && (
        <EditTemplate
          users={usersList}
          setShowTemplateUpdateModal={setShowTemplateUpdateModal}
          setRefreshComponent={setRefreshComponent}
          showTemplateUpdateModal={showTemplateUpdateModal}
          selectedItem={selectedItem}
        />
      )}
      <DeleteConfirmationModal
        onCancel={closeDeleteConfirmationModal}
        onOk={deleteTemplate}
        visible={showDeleteConfirmationModal}
      />
    </div>
  );
}

export default CirculationTemplates;
