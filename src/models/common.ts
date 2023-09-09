/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
interface IGlobalResponse {
  Errors: string | string[];
  IsSuccess: boolean;
}

interface ICreateResponse extends IGlobalResponse {
  Data?: {
    Message?: string | string[];
    id?: string | number;
  };
}

interface selectOption {
  value: string | number;
  label: string;
}

interface IFileServerResponse {
  id: number;
  mimeType?: string | null;
  uploadDate?: Date | string | null;
  size?: number | null;
  name?: string | null;
  fileNameOnDisk?: string | null;
  fileUrl?: string | null;
  version?: number | string;
  totalVersion?: number | string;
}

interface ICompanyDetailItem {
  Voen: string;
  Id: number;
  Name: string;
  Email?: string;
  PhoneNumber?: string;
  FounderName: string;
  CreatedDate: string | Date;
  FounderSurname: string;
  FathersName: string;
  FinCode: string;
  Status: string;
  StatusId: number;
  ActivityField?: string;
  Address?: string;
}

export enum FolderTypes {
  ContractMainFile = 1,
  ContractSecretFile,
  AdditionalFile,
  handoverFile,
  invoiceFile,
  LegalEntityProfilePhoto,
  AuthPersonProfilePhoto
}

export type {
  selectOption,
  ICreateResponse,
  ICompanyDetailItem,
  IFileServerResponse,
  IGlobalResponse
};
