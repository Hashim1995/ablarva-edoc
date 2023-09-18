import { IGlobalResponse, selectOption } from '@/models/common';

interface ICirculationTemplateFilter {
  Name: string;
  CirculationTypeId: selectOption | null;
}

interface ICirculationTemplateItem {
  Id: number;
  Name?: string | null;
  CirculationType?: string | null;
}

interface IGetUsersResponse extends IGlobalResponse {
  Data: {
    TotalCount: number;
    Datas: selectOption[];
  };
}

interface ICycleMemberItem {
  authPersonId: number;
  memberType: number;
  order: number;
  group: number | null;
}

interface ITemplateAddForm {
  name: string;
  type: number;
  forInfos: number[];
  approve: {
    userId: number | number[] | null;
  }[];
  sign: {
    userId: number | number[] | null;
  }[];
}

interface ITemplateAddPayload {
  name: string;
  type: number;
  forInfos: number[];
  cycleMembers: ICycleMemberItem[];
}

export type {
  ICirculationTemplateFilter,
  ICirculationTemplateItem,
  IGetUsersResponse,
  ITemplateAddForm,
  ITemplateAddPayload,
  ICycleMemberItem
};
