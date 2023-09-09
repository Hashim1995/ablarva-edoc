import { Breadcrumb, Row, Card, Typography, Col } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, RightOutlined } from '@ant-design/icons';

import { dictionary } from '@/utils/constants/dictionary';

function ReportTypes() {
  interface IReportType {
    title: string;
    path: string;
  }

  const reportTypesArr: IReportType[] = [
    {
      title: dictionary.en.generalCounts,
      path: '/reports/general-counts'
    },
    {
      title: dictionary.en.documentTypes,
      path: '/reports/document-types'
    },
    {
      title: dictionary.en.reportsByStatus,
      path: '/reports/reports-by-status'
    }
  ];

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
                title: dictionary.en.report
              }
            ]}
          />
        </Row>
      </Card>

      <Card size="small" className="box box-margin-y">
        <Typography.Text type="secondary">
          {dictionary.en.report} (3)
        </Typography.Text>
        {reportTypesArr.map((t: IReportType) => (
          <Card key={t?.path} className="box-margin-y">
            <Link to={t?.path}>
              <Row justify="space-between">
                <Col>
                  <Typography.Text> {t?.title}</Typography.Text>
                </Col>
                <Col>
                  <RightOutlined rev={undefined} />
                </Col>
              </Row>
            </Link>
          </Card>
        ))}
      </Card>
    </div>
  );
}

export default ReportTypes;
