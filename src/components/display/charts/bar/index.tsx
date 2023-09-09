import React from 'react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  IGeneralCountsListItem,
  IDocumentTypesListItem
} from '@/modules/reports/models';

interface IProps {
  data?: IGeneralCountsListItem[] | IDocumentTypesListItem[];
  xKey: string;
  yKey: string;
  label?: string | null;
}

function ReportsBarChart({ data, xKey, yKey, label }: IProps) {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip
            formatter={(value, name) => [
              value,
              label !== undefined ? label : name
            ]}
          />
          <Bar maxBarSize={100} dataKey={yKey} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ReportsBarChart;
