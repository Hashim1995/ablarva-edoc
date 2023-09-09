import { IGlobalResponse } from '@/models/common';

interface INotificationsListItem {
  ContractId?: number;
  Id: number;
  DocumentCode?: string;
  CreatedDate: string | Date;
  DocumentId: number;
  Title?: string;
  Message?: string;
  SenderLegal?: string;
  ReceiverLegal?: string;
  SenderAuthPerson?: string;
  IsRead: boolean;
}

interface IGetNotificationsListResponse extends IGlobalResponse {
  Data: {
    Datas: INotificationsListItem[];
    TotalDataCount: number;
    unReadCount: number;
  };
}

interface IReadNotificationPayload {
  Id: number;
}

export type {
  INotificationsListItem,
  IGetNotificationsListResponse,
  IReadNotificationPayload
};
