import { useState, useEffect } from 'react';
import { Card, Col, Grid, Row, Skeleton, theme } from 'antd';
import { BiFile } from 'react-icons/bi';
import StatisticsCard from '@/components/display/cards/statistics';
import ReportsLineChart from '@/components/display/charts/line';
import { StatisticsServies } from '@/services/statistics-services/statistics-services';
import { ReportServices } from '@/services/reports-services/report-services';
import { IGetReportsListByStatusResponse } from '@/modules/reports/models';
import { IGetStatisticsListResponse, IStatisticsListItem } from '../models';

function Home() {
  const { useToken } = theme;
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();

  const { token } = useToken();
  const [statsLoading, setStatsLoading] = useState(false);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [statsList, setStatsList] = useState<IGetStatisticsListResponse>();
  const [reportsList, setReportsList] =
    useState<IGetReportsListByStatusResponse>();

  const fetchStatsList = async () => {
    setStatsLoading(true);

    const res: IGetStatisticsListResponse =
      await StatisticsServies.getInstance().getStatisticsList([]);

    if (res.IsSuccess) {
      setStatsList(res);
      setStatsLoading(false);
    }
    setStatsLoading(false);
  };

  const fetchReportsList = async () => {
    setReportsLoading(true);

    const res: IGetReportsListByStatusResponse =
      await ReportServices.getInstance().getYearlyReportsListByStatus([]);

    if (res.IsSuccess) {
      setReportsList(res);
      setReportsLoading(false);
    }
    setReportsLoading(false);
  };

  useEffect(() => {
    fetchStatsList();
    fetchReportsList();
  }, []);

  return (
    <div>
      {statsLoading ? (
        <Card size="small" className="box box-margin-y">
          <Skeleton />
        </Card>
      ) : (
        <Row gutter={16}>
          {statsList?.Data.Datas.map((t: IStatisticsListItem) => (
            <Col style={{ width: lg ? '20%' : '33%' }}>
              <StatisticsCard
                Id={t.Id}
                key={t.Id}
                Name={t.Name}
                Count={t.Count}
                loading={statsLoading}
                Icon={
                  <BiFile
                    style={{
                      fontSize: token.fontSizeXL,
                      color: token.colorPrimary
                    }}
                  />
                }
              />
            </Col>
          ))}
        </Row>
      )}
      {/* 
      <AppFileUpload
        listType="picture-card"
        accept='.pdf'
        getValues={e => console.log(e)}
      /> */}

      {reportsLoading ? (
        <Card size="small" className="box box-margin-y">
          <Skeleton />
        </Card>
      ) : (
        <Card size="small" className="box box-margin-y">
          <ReportsLineChart data={reportsList?.Data.Datas} dataKey={'Month'} />
        </Card>
      )}
    </div>
  );
}

export default Home;
