import { IGlobalResponse, selectOption } from '@/models/common';
import { ILegalEntityPhoto } from '@/models/user';

interface ICirculationTemplateFilter {
  name: string;
  type: selectOption | null;
}

interface ICirculationTemplateItem {
  id: number;
  name?: string | null;
  type?: string | null;
}

interface IGetCirculationTemplatesResponse extends IGlobalResponse {
  Data: {
    Datas: ICirculationTemplateItem[];
    TotalDataCount: number;
  };
}

interface IGetUsersResponse extends IGlobalResponse {
  Data: {
    TotalCount: number;
    Datas: selectOption[];
  };
}

interface IGroupedCycleMemberItem {
  users: number[];
  memberType: number;
  group: number | null;
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

interface IGetSingleTemplateResponse extends IGlobalResponse {
  Data: ITemplateAddPayload;
}

interface ICycleMemberItemView {
  AuthorizedPersonId: number;
  name: string;
  file?: ILegalEntityPhoto | null;
  Profession: string;
  memberType: number;
  order: number;
  group: number | null;
}

interface IGroupedCycleMemberItemView {
  users: ICycleMemberItemView[];
  order: number;
}

interface IGetSingleTemplateViewResponse extends IGlobalResponse {
  Data: {
    name: string;
    type: number;
    forInfo: {
      id: number;
      name: string;
      file?: ILegalEntityPhoto | null;
    }[];
    documentApprovalCycleMembers: ICycleMemberItemView[];
  };
}

export type {
  ICirculationTemplateFilter,
  ICirculationTemplateItem,
  IGetUsersResponse,
  ITemplateAddForm,
  ITemplateAddPayload,
  ICycleMemberItem,
  IGetCirculationTemplatesResponse,
  IGetSingleTemplateResponse,
  IGroupedCycleMemberItem,
  IGetSingleTemplateViewResponse,
  ICycleMemberItemView,
  IGroupedCycleMemberItemView
};
