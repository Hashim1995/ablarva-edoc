import { useEffect, useState } from 'react';
import { Breadcrumb, Row, Card, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { IHTTPSParams } from '@/services/adapter-config/config';
import { dictionary } from '@/utils/constants/dictionary';
import { ReportServices } from '@/services/reports-services/report-services';
import { IGetReportsListByStatusResponse } from '@/modules/reports/models';
import ReportsLineChart from '@/components/display/charts/line';
import YearFilter from './year-filter';

function ReportsByStatus() {
  const [reports, setReports] = useState<IGetReportsListByStatusResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);

  const fetchReports = async () => {
    setLoading(true);

    const res: IGetReportsListByStatusResponse =
      await ReportServices.getInstance().getYearlyReportsListByStatus(
        [...queryParams],
        () => setLoading(false)
      );

    if (res.IsSuccess) {
      setReports(res);
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
    fetchReports();
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
                title: dictionary.en.reportsByStatus
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
          <ReportsLineChart data={reports?.Data.Datas} dataKey={'Month'} />
        )}
      </Card>
    </div>
  );
}

export default ReportsByStatus;
