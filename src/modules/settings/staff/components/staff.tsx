import { dictionary } from '@/utils/constants/dictionary';
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
  theme,
  Tooltip,
  Typography
} from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, UndoOutlined, MoreOutlined } from '@ant-design/icons';
import AppHandledInput from '@/components/forms/input/handled-input';
import AppHandledSelect from '@/components/forms/select/handled-select';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  inputPlaceholderText,
  selectPlaceholderText
} from '@/utils/constants/texts';
import { useCallback, useEffect, useState } from 'react';
import { convertFormDataToQueryParams } from '@/utils/functions/functions';
import { IHTTPSParams } from '@/services/adapter-config/config';
import { statusOptions } from '@/utils/constants/options';
import { StaffServies } from '@/services/settings-staff-service/settings-staff-service';
import AppEmpty from '@/components/display/empty';
import { ColumnsType } from 'antd/es/table';
import AppPagination from '@/components/display/pagination';
import dayjs from 'dayjs';
import { IGlobalResponse, selectOption } from '@/models/common';
import { toast } from 'react-toastify';
import {
  IGetPermissionResponse,
  IGetStaffResponse,
  IStaffFilter,
  IStaffItem,
  IStaffStatus
} from '../models';
import AddStaff from '../modals/add-staff';
import UpdateStaff from '../modals/edit-staff';

function Staff() {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<IStaffFilter>({
    mode: 'onChange',
    defaultValues: {
      Name: '',
      Surname: '',
      FinCode: '',
      PhoneNumber: '',
      Profession: '',
      Email: '',
      StatusId: null
    }
  });

  const { Text } = Typography;
  const { useToken } = theme;
  const { token } = useToken();

  const [page, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [staffData, setStaffData] = useState<IGetStaffResponse>();
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [showAddStaffModal, setShowAddStaffModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<IStaffItem>();
  const [showUpdateStaffModal, setShowUpdateStaffModal] =
    useState<boolean>(false);
  const [permissionsList, setPermissionList] = useState<selectOption[]>([]);
  const [permissionsLoading, setPermissionsLoading] = useState<boolean>(true);
  const items: MenuProps['items'] = [
    {
      label: <Typography.Text>{dictionary.en.editBtn}</Typography.Text>,
      key: '0'
    }
    // {
    //   label: <Typography.Text>{dictionary.en.view}</Typography.Text>,
    //   key: '1'
    // }
  ];

  const handleMenuClick = (e: any, raw: any) => {
    if (e?.key === '0') {
      setSelectedItem(raw);
      setShowUpdateStaffModal(true);
    }
  };

  // const convertToSelectOptions = (data: any): selectOption[] =>
  //   data.map((item: any) => ({
  //     value: item.Value,
  //     label: item.Label || ''
  //   }));

  const fetchPermisions = async () => {
    setPermissionsLoading(true);
    const res: IGetPermissionResponse =
      await StaffServies.getInstance().getPermisions();
    setPermissionList(res.Data);
    setPermissionsLoading(false);
  };

  const fetchStaffList = async () => {
    setLoading(true);
    const res: IGetStaffResponse =
      await StaffServies.getInstance().getStaffList([
        ...queryParams,
        { name: 'page', value: page }
      ]);
    setStaffData(res);

    if (res.IsSuccess) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<IStaffFilter> = async (data: IStaffFilter) => {
    setCurrentPage(1);
    const queryParamsData: IHTTPSParams[] =
      convertFormDataToQueryParams<IStaffFilter>(data);
    setQueryParams(queryParamsData);
    setRefreshComponent(!refreshComponent);
  };

  const onChangeStatus = useCallback(
    async (id: number, statusId: number) => {
      setLoading(true);

      const payload: IStaffStatus = {
        StatusId: statusId
      };

      const res: IGlobalResponse =
        await StaffServies.getInstance().changeStatus(id, payload);
      if (res.IsSuccess) {
        setLoading(false);
        setRefreshComponent(!refreshComponent);
        toast.success(dictionary.en.statusSuccessMessage);
      } else {
        setLoading(false);
      }
    },
    [staffData]
  );

  const columns: ColumnsType<IStaffItem> = [
    {
      title: dictionary.en.name,
      dataIndex: 'Name',
      key: 'Name',

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
      title: dictionary.en.surname,
      dataIndex: 'Surname',
      key: 'Surname',

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
      title: dictionary.en.finCode,
      dataIndex: 'FinCode',
      key: 'FinCode',

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
      title: dictionary.en.position,
      dataIndex: 'Profession',
      key: 'Profession',

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
      title: dictionary.en.email,
      dataIndex: 'Email',
      key: 'Email',

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
      dataIndex: 'CreatedDate',
      key: 'CreatedDate',
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
      title: dictionary.en.status,
      dataIndex: 'Status',
      key: 'Status',
      responsive: ['lg'],
      render: (record: string, raw: IStaffItem) => (
        <Tooltip placement="top" title="Statusu dəyiş">
          <Switch
            checked={record === dictionary.en.active}
            onChange={() => {
              const newStatusId = record === dictionary.en.active ? 2 : 1;
              if (
                typeof newStatusId === 'number' &&
                typeof raw.Id === 'number'
              ) {
                onChangeStatus(raw.Id, newStatusId);
              }
            }}
          />
        </Tooltip>
      )
    },
    {
      title: '',
      key: 'actions',

      render: (_, raw: IStaffItem) => (
        <Space>
          <Dropdown
            menu={{
              items,
              onClick: e => handleMenuClick(e, raw)
            }}
            key={raw?.Id}
            trigger={['click']}
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ];

  useEffect(() => {
    fetchPermisions();
    fetchStaffList();
  }, [refreshComponent, page]);

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
                  title: dictionary.en.users
                }
              ]}
            />
          </Space>

          <Space>
            <div>
              <Button
                onClick={() => {
                  setShowAddStaffModal(true);
                }}
                type="primary"
                loading={permissionsLoading}
                disabled={permissionsLoading}
              >
                <Space>{dictionary.en.addBtn}</Space>
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
              <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
                <Row gutter={16}>
                  <Col
                    className="gutter-row"
                    style={{ marginBottom: token.marginSM }}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                  >
                    <AppHandledInput
                      label={dictionary.en.name}
                      name="Name"
                      inputProps={{
                        id: 'name'
                      }}
                      control={control}
                      required={false}
                      inputType="text"
                      placeholder={inputPlaceholderText(dictionary.en.name)}
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
                      label={dictionary.en.surname}
                      name="Surname"
                      inputProps={{
                        id: 'surname'
                      }}
                      control={control}
                      required={false}
                      inputType="text"
                      placeholder={inputPlaceholderText(dictionary.en.surname)}
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
                      label={dictionary.en.finCode}
                      required={false}
                      name="FinCode"
                      inputProps={{
                        id: 'fincode'
                      }}
                      control={control}
                      inputType="text"
                      placeholder={inputPlaceholderText(dictionary.en.finCode)}
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
                      label={dictionary.en.position}
                      required={false}
                      name="Profession"
                      inputProps={{
                        id: 'profession'
                      }}
                      control={control}
                      inputType="text"
                      placeholder={inputPlaceholderText(dictionary.en.position)}
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
                      label={dictionary.en.contactNumber}
                      required={false}
                      name="PhoneNumber"
                      inputProps={{
                        id: 'phoneNumber'
                      }}
                      control={control}
                      inputType="text"
                      placeholder={inputPlaceholderText(
                        dictionary.en.contactNumber
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
                      label={dictionary.en.email}
                      name="Email"
                      inputProps={{
                        id: 'email'
                      }}
                      control={control}
                      required={false}
                      inputType="text"
                      placeholder={inputPlaceholderText(dictionary.en.email)}
                      errors={errors}
                      formItemProps={{
                        style: {
                          whiteSpace: 'nowrap'
                        }
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
                    <AppHandledSelect
                      label={dictionary.en.status}
                      required={false}
                      name="StatusId"
                      control={control}
                      placeholder={inputPlaceholderText(dictionary.en.status)}
                      errors={errors}
                      selectProps={{
                        allowClear: true,
                        showSearch: true,
                        id: 'StatusId',
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
      {staffData?.Data?.Datas.length ? (
        <Card bodyStyle={{ padding: 0 }}>
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
                    staffData.Data !== null ? staffData?.Data.Datas : []
                  }
                />
              </Col>
            </Row>
            <Row justify="end" style={{ padding: token.paddingXS }}>
              <Col>
                <AppPagination
                  style={{ marginTop: '20px', marginBottom: '20px' }}
                  current={page}
                  total={staffData?.Data?.TotalDataCount}
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
      {showAddStaffModal && (
        <AddStaff
          permissions={permissionsList}
          setShowAddStaffModal={setShowAddStaffModal}
          setRefreshComponent={setRefreshComponent}
          showAddStaffModal={showAddStaffModal}
        />
      )}
      {showUpdateStaffModal && selectedItem && (
        <UpdateStaff
          permissions={permissionsList}
          setShowUpdateStaffModal={setShowUpdateStaffModal}
          setRefreshComponent={setRefreshComponent}
          showUpdateStaffModal={showUpdateStaffModal}
          selectedItem={selectedItem}
        />
      )}
    </div>
  );
}

export default Staff;
