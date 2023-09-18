/* eslint-disable no-unused-vars */
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
  Table,
  Tooltip,
  Typography,
  theme
} from 'antd';
import { HomeOutlined, UndoOutlined, MoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AppHandledInput from '@/components/forms/input/handled-input';
import { IHTTPSParams } from '@/services/adapter-config/config';
import AppHandledSelect from '@/components/forms/select/handled-select';
import {
  inputPlaceholderText,
  selectPlaceholderText
} from '@/utils/constants/texts';
import { SubmitHandler, useForm } from 'react-hook-form';
import { convertFormDataToQueryParams } from '@/utils/functions/functions';
import { circulationTypeOptions } from '@/utils/constants/options';
import AppEmpty from '@/components/display/empty';
import AppPagination from '@/components/display/pagination';
import { ColumnsType } from 'antd/es/table';
import { CirculationTemplateServies } from '@/services/circulation-template-services/circulation-template-service';
import { selectOption } from '@/models/common';
import {
  ICirculationTemplateFilter,
  ICirculationTemplateItem,
  IGetUsersResponse
} from '../models';
import AddTemplate from '../modals/add-template';

function CirculationTemplates() {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ICirculationTemplateFilter>({
    mode: 'onChange',
    defaultValues: {
      Name: '',
      CirculationTypeId: null
    }
  });

  const { useToken } = theme;
  const { token } = useToken();

  const [page, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<selectOption[]>([]);
  // const [templateData, setTemplateData] = useState<IGetCirculationTemplatesResponse>();
  const [selectedItem, setSelectedItem] = useState<ICirculationTemplateItem>();
  const [showTemplateUpdateModal, setShowTemplateUpdateModal] =
    useState<boolean>(false);
  const [showAddTemplateModal, setShowTemplateAddModal] =
    useState<boolean>(false);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);

  const items: MenuProps['items'] = [
    {
      label: <Typography.Text>{dictionary.en.editBtn}</Typography.Text>,
      key: '0'
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

  const handleMenuClick = (e: any, raw: any) => {
    if (e?.key === '0') {
      setSelectedItem(raw);
      setShowTemplateUpdateModal(true);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    const res: IGetUsersResponse =
      await CirculationTemplateServies.getInstance().getUsers();
    setUsersList(res.Data.Datas);
    setUsersLoading(false);
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

  const data = [
    {
      Id: 1,
      CirculationType: 'Ardıcıl',
      Name: 'Rəhbər'
    },
    {
      Id: 2,
      CirculationType: 'Paralel',
      Name: 'Çoxsaylı'
    }
  ];

  const columns: ColumnsType<ICirculationTemplateItem> = [
    {
      title: dictionary.en.templateName,
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
      title: dictionary.en.circulationType,
      dataIndex: 'CirculationType',
      key: 'CirculationType',

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
      title: '',
      key: 'actions',

      render: (_, raw: ICirculationTemplateItem) => (
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
    fetchUsers();
  }, []);

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
                      name="Name"
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
                      label={dictionary.en.circulationType}
                      required={false}
                      name="CirculationTypeId"
                      control={control}
                      placeholder={inputPlaceholderText(
                        dictionary.en.circulationType
                      )}
                      errors={errors}
                      selectProps={{
                        allowClear: true,
                        showSearch: true,
                        id: 'circulationTypeId',
                        placeholder: selectPlaceholderText(
                          dictionary.en.circulationType
                        ),
                        className: 'w-full',
                        options: circulationTypeOptions
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
      {data.length ? (
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
                  dataSource={data !== null ? data : []}
                />
              </Col>
            </Row>
            <Row justify="end" style={{ padding: token.paddingXS }}>
              <Col>
                <AppPagination
                  style={{ marginTop: '20px', marginBottom: '20px' }}
                  current={page}
                  total={2}
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
    </div>
  );
}

export default CirculationTemplates;
