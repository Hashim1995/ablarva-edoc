import { IFileServerResponse, IGlobalResponse } from '@/models/common';

interface IUserData {
  Id: number;
  Name: string;
  Voen: string;
  Email: string;
  PhoneNumber: string;
  StatusId: number;
  ActivityField: string;
  Address: string;
  File: any;
  fileId?: number | null;
}

interface ImageData {
  id: number;
  folderType: number;
  mimeType: string;
  uploadDate: string; // Assuming you want to keep the date as a string
  size: number;
  name: string;
  fileNameOnDisk: string;
  fileUrl: string;
}

interface IImageDataResponse extends IGlobalResponse {
  Data: ImageData;
}

interface IGetuserDataResponse extends IGlobalResponse {
  Data: IUserData;
}

interface IPersonalImageFile extends IFileServerResponse {
  type?: number;
}

export type {
  IUserData,
  IGetuserDataResponse,
  IPersonalImageFile,
  IImageDataResponse
};
