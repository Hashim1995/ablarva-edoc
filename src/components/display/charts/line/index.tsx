import React from 'react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Status } from '@/modules/home/constants/variables';
import { IReportsByStatusItem } from '@/modules/reports/models';

interface IProps {
  data?: IReportsByStatusItem[];
  dataKey?: string;
}

function ReportsLineChart({ data, dataKey }: IProps) {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={dataKey} />
          <YAxis />
          <Tooltip
            formatter={(value, name) => [
              value,
              Status.find(t => t.dataKey === name)?.label
            ]}
          />
          <Legend
            formatter={value => Status.find(t => t.dataKey === value)?.label}
          />
          {Status.map(t => (
            <Line
              key={t.dataKey}
              type="monotone"
              dataKey={t.dataKey}
              stroke={t.color}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ReportsLineChart;
