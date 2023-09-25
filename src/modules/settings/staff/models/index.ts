import { IGlobalResponse, selectOption } from '@/models/common';

interface IStaffItem {
  Id: number;
  Name?: string | null;
  Surname?: string | null;
  FathersName?: string | null;
  Profession?: string | null;
  FinCode?: string | null;
  CreatedDate?: string | null;
  Email?: string | null;
  PhoneNumber?: string | null;
  Permission?: selectOption | selectOption[] | null;
  PermissionId?: number | null;
  Status?: string | null;
  LegalEntity?: string | null;
  IsFounder?: boolean | null;
  File?: any;
}

interface IStaffFilter {
  Name: string;
  Surname: string;
  FinCode: string;
  PhoneNumber: string;
  Profession: string;
  Email: string;
  StatusId: selectOption | null;
}

interface IGetStaffResponse extends IGlobalResponse {
  Data: {
    Datas: IStaffItem[];
    TotalDataCount: number;
  };
}

interface IGetSingleStaffResponse extends IGlobalResponse {
  Data: IStaffItem;
}

interface IStaffStatus {
  StatusId: number;
}

interface IAddStaffForm {
  Name?: string;
  Surname?: string;
  FathersName?: string;
  FinCode?: string;
  Profession?: string;
  Email?: string;
  PhoneNumber?: string;
  Permission?: (number | string)[] | null;
  Permissions?: (number | string)[] | null;
  fileId?: number | string | null;
}

interface IGetPermissionResponse extends IGlobalResponse {
  TotalCount: number;
  Data: selectOption[];
}

interface IUpdateStaff {
  Email: string;
  PhoneNumber: string;
  Profession: string;
  PermissionId: number;
}

type PartialStaff = Partial<IAddStaffForm>;

export type {
  IStaffFilter,
  IStaffItem,
  IGetStaffResponse,
  IStaffStatus,
  IAddStaffForm,
  IGetPermissionResponse,
  IGetSingleStaffResponse,
  IUpdateStaff,
  PartialStaff
};
