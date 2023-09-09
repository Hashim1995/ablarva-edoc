import { IGlobalResponse, selectOption } from '@/models/common';

interface IReportsFilter {
  year: selectOption | null;
}

interface IReportsByStatusItem {
  Month?: string | null;
  Year: number | null;
  Pending: number | null;
  Returned: number | null;
  Approved: number | null;
  Completed: number | null;
  Assigned: number | null;
  Expired: number | null;
  Rejected: number | null;
}

interface IGetReportsListByStatusResponse extends IGlobalResponse {
  Data: {
    Datas: IReportsByStatusItem[];
    TotalDataCount: number;
  };
}

interface IGeneralCountsListItem {
  Year: number | null;
  Month: string | null;
  Count: number | null;
}

interface IGetGeneralCountsListResponse extends IGlobalResponse {
  Data: {
    Datas: IGeneralCountsListItem[];
    TotalDataCount: number;
  };
}

interface IDocumentTypesListItem {
  label: string | null;
  value: number | null;
}

interface IGetDocumentTypesListResponse extends IGlobalResponse {
  Data: IDocumentTypesListItem[];
}

export type {
  IReportsFilter,
  IGetGeneralCountsListResponse,
  IGeneralCountsListItem,
  IGetReportsListByStatusResponse,
  IReportsByStatusItem,
  IGetDocumentTypesListResponse,
  IDocumentTypesListItem
};
