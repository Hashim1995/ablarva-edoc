import { Card, Grid, Row, Space, Typography, theme } from 'antd';
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
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();
  return (
    <Card
      loading={loading ?? false}
      style={{ width: '100%', marginBottom: token.marginSM }}
      key={Id}
      title={Name ?? dictionary.en.noDataText}
    >
      <Space size="middle" direction={!lg ? 'vertical' : 'horizontal'}>
        <Row align="middle">{Icon ?? <BiFile />}</Row>
        <Typography.Text style={{ fontSize: token.fontSizeXL }}>
          {Count ?? 0}{' '}
        </Typography.Text>
      </Space>
    </Card>
  );
}

export default StatisticsCard;
