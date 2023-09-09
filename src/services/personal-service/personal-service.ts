/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */

import { IGlobalResponse } from '@/models/common';
import {
  IGetuserDataResponse,
  IImageDataResponse,
  IUserData
} from '@/modules/personal/models';

import { ErrorCallBack, HttpUtil } from '../adapter-config/config';

export class PersonalServies {
  // eslint-disable-next-line no-use-before-define
  private static instance: PersonalServies | null;

  private constructor() {}

  public static getInstance(): PersonalServies {
    if (!this.instance) {
      PersonalServies.instance = new PersonalServies();
    }
    return PersonalServies.instance!;
  }

  public async updateUserData(
    body: Partial<IUserData>,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.put(`/`, body, onError);
    return res;
  }

  public async postUserImage(
    folderType: number,
    payload: any,
    onError?: ErrorCallBack
  ): Promise<IImageDataResponse> {
    const res = await HttpUtil.post(
      `/fileupload/${folderType}`,
      payload,
      onError
    );
    return res;
  }

  public async getUserData(
    onError?: ErrorCallBack
  ): Promise<IGetuserDataResponse> {
    const res = await HttpUtil.get('/signed', null, false, onError);
    return res;
  }
}
