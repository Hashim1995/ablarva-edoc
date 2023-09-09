import { IconType } from 'antd/es/notification/interface';
import React from 'react';
import { IGlobalResponse } from '@/models/common';

interface IStatisticsListItem {
  Id?: number | null;
  Name?: string | null;
  Count?: number | null;
  loading?: boolean | null;
  Icon?: React.ReactNode | IconType | null;
}

interface IGetStatisticsListResponse extends IGlobalResponse {
  Data: {
    Datas: IStatisticsListItem[];
    TotalDataCount: number;
  };
}

export type { IStatisticsListItem, IGetStatisticsListResponse };
