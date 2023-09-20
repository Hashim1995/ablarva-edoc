/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */

import { IGlobalResponse } from '@/models/common';
import {
  IGetCirculationTemplatesResponse,
  IGetUsersResponse,
  ITemplateAddPayload
} from '@/modules/settings/circulation-templates/models';
import {
  ErrorCallBack,
  HttpUtil,
  IHTTPSParams
  //   IHTTPSParams
} from '../adapter-config/config';

export class CirculationTemplateServies {
  // eslint-disable-next-line no-use-before-define
  private static instance: CirculationTemplateServies | null;

  private constructor() {}

  public static getInstance(): CirculationTemplateServies {
    if (!this.instance) {
      CirculationTemplateServies.instance = new CirculationTemplateServies();
    }
    return CirculationTemplateServies.instance!;
  }

  public async addTemplate(
    body: ITemplateAddPayload,
    onError?: ErrorCallBack
  ): Promise<IGlobalResponse> {
    const res = await HttpUtil.post('/documentapprovalcycle', body, onError);
    return res;
  }

  public async getUsers(onError?: ErrorCallBack): Promise<IGetUsersResponse> {
    const res = await HttpUtil.get(
      '/legalentity/authorizedpersonsfordocumentcycle',
      null,
      false,
      onError
    );
    return res;
  }

  public async getTemplateList(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IGetCirculationTemplatesResponse> {
    const res = await HttpUtil.get(
      '/documentapprovalcycle/getall',
      params,
      false,
      onError
    );
    return res;
  }
}
