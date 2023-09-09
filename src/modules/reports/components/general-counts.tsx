import { useEffect, useState } from 'react';
import { Breadcrumb, Row, Card, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { IHTTPSParams } from '@/services/adapter-config/config';
import { dictionary } from '@/utils/constants/dictionary';
import { ReportServices } from '@/services/reports-services/report-services';
import ReportsBarChart from '@/components/display/charts/bar';
import { IGetGeneralCountsListResponse } from '../models';
import YearFilter from './year-filter';

function GeneralCounts() {
  // eslint-disable-next-line no-unused-vars
  const [generalCounts, setGeneralCounts] =
    useState<IGetGeneralCountsListResponse>();
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);

  const fetcGeneralCounts = async () => {
    setLoading(true);

    const res: IGetGeneralCountsListResponse =
      await ReportServices.getInstance().getGeneralCountsList(
        [...queryParams],
        () => setLoading(false)
      );

    if (res.IsSuccess) {
      setGeneralCounts(res);
    }
    setLoading(false);
  };

  const handleSearch = (params: IHTTPSParams[]) => {
    setQueryParams(params);
    setRefreshComponent(!refreshComponent);
  };

  const handleReset = () => {
    setQueryParams([]);
    setRefreshComponent(!refreshComponent);
  };

  useEffect(() => {
    fetcGeneralCounts();
  }, [refreshComponent]);
  return (
    <div>
      <Card size="small" className="box box-margin-y">
        <Row justify="space-between">
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
                title: <Link to="/reports">{dictionary.en.report}</Link>
              },
              {
                title: dictionary.en.generalCounts
              }
            ]}
          />
        </Row>
      </Card>
      <YearFilter handleSearch={handleSearch} handleReset={handleReset} />
      <Card size="small" className="box box-margin-y">
        {loading ? (
          <Skeleton />
        ) : (
          <ReportsBarChart
            data={generalCounts?.Data.Datas}
            xKey="Month"
            yKey="Count"
            label="Say"
          />
        )}
      </Card>
    </div>
  );
}

export default GeneralCounts;
