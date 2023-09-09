import {
  Row,
  Card,
  Collapse,
  Col,
  Space,
  Tooltip,
  Button,
  Typography,
  Form
} from 'antd';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UndoOutlined } from '@ant-design/icons';
import { IHTTPSParams } from '@/services/adapter-config/config';
import { convertFormDataToQueryParams } from '@/utils/functions/functions';
import { dictionary } from '@/utils/constants/dictionary';
import AppHandledSelect from '@/components/forms/select/handled-select';
import {
  inputPlaceholderText,
  selectPlaceholderText
} from '@/utils/constants/texts';
import { IReportsFilter } from '../models';
import { currentYearOption, year } from '../constants/static-options';

interface IProps {
  // eslint-disable-next-line no-unused-vars
  handleSearch: (params: IHTTPSParams[]) => void;
  handleReset: () => void;
}

function YearFilter({ handleSearch, handleReset }: IProps) {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<IReportsFilter>({
    mode: 'onChange',
    defaultValues: {
      year: currentYearOption
    }
  });

  const { Text } = Typography;

  const onSubmit: SubmitHandler<IReportsFilter> = async (
    data: IReportsFilter
  ) => {
    const queryParamsData: IHTTPSParams[] =
      convertFormDataToQueryParams<IReportsFilter>(data);
    handleSearch(queryParamsData);
  };

  return (
    <Card size="small" className="box box-margin-y ">
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
            <Row gutter={16} align="bottom" justify="space-between">
              <Col className="gutter-row" span={6}>
                <AppHandledSelect
                  label={dictionary.en.year}
                  name="year"
                  control={control}
                  required={false}
                  placeholder={inputPlaceholderText(dictionary.en.year)}
                  errors={errors}
                  selectProps={{
                    allowClear: true,
                    showSearch: true,
                    id: 'year',
                    placeholder: selectPlaceholderText(dictionary.en.year),
                    className: 'w-full',
                    options: year
                  }}
                />
              </Col>
              <Col>
                <Space size="small">
                  <Tooltip title={dictionary.en.resetTxt}>
                    <Button
                      onClick={() => {
                        reset();
                        handleReset();
                      }}
                      type="dashed"
                      icon={<UndoOutlined rev={undefined} />}
                    />
                  </Tooltip>
                  <Button type="primary" htmlType="submit">
                    {dictionary.en.searchTxt}
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Collapse.Panel>
      </Collapse>
    </Card>
  );
}

export default YearFilter;
