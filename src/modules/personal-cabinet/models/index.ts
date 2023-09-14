interface IPersonalData {
  Name?: string;
  Surname?: string;
  FathersName?: string;
  FinCode?: string;
  Profession?: string;
  Email?: string;
  PhoneNumber?: string;
  fileId?: number | string | null;
  File: any;
}

export type { IPersonalData };
