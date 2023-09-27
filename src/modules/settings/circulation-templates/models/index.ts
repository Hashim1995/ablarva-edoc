import { IGlobalResponse, selectOption } from '@/models/common';
import { ILegalEntityPhoto } from '@/models/user';

interface ICirculationTemplateFilter {
  name: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  status: number | null;
}

interface ICirculationTemplateItem {
  id: number;
  name?: string | null;
  createdBy?: string | null;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  status?: number;
}

interface IGetCirculationTemplatesResponse extends IGlobalResponse {
  Data: {
    Datas: ICirculationTemplateItem[];
    TotalDataCount: number;
  };
}

interface IDeleteTemplateResponse extends IGlobalResponse {
  Data?: {
    Message?: string | string[];
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
  group: number | null;
}

interface ICycleMemberItem {
  authPersonId: number;
  order: number;
  group: number | null;
}

interface ITemplateAddForm {
  name: string;
  forInfos: number[];
  approve: {
    userId: number[];
  }[];
  forSigns: number[];
}

interface ITemplateAddPayload {
  name: string;
  forInfos: number[];
  forSigns: number[];
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
  IGroupedCycleMemberItemView,
  IDeleteTemplateResponse
};
