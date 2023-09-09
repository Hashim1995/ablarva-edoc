import { Card, Row, Space, Typography, theme } from 'antd';
import { BiFile } from 'react-icons/bi';
import React from 'react';
import { IStatisticsListItem } from '@/modules/home/models';
// import { noDataText } from '@/utils/constants/texts';
import { dictionary } from '@/utils/constants/dictionary';

function StatisticsCard({
  Id,
  Name,
  Count,
  Icon,
  loading
}: IStatisticsListItem) {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <Card
      loading={loading ?? false}
      style={{ width: '100%', marginBottom: token.marginSM }}
      key={Id}
      title={Name ?? dictionary.en.noDataText}
    >
      <Space size="middle">
        <Row align="middle">{Icon ?? <BiFile />}</Row>
        <Typography.Text style={{ fontSize: token.fontSizeXL }}>
          {Count ?? 0}{' '}
        </Typography.Text>
      </Space>
    </Card>
  );
}

export default StatisticsCard;
