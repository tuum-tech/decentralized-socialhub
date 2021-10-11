import { IRunScriptResponse } from '@elastosfoundation/elastos-hive-js-sdk/dist/Services/Scripting.Service';

import { getItemsFromData } from 'src/utils/script';

import { HiveService } from './hive.service';

export class TemplateService {
  static getAllTemplates() {
    return [
      {
        value: 'crypto',
        title: 'Crypto',
        intro: 'Step into Web3'
      },
      {
        value: 'gamer',
        title: 'Gaming',
        intro: 'Interactive Dreamland'
      },
      {
        value: 'soccer',
        title: 'Athletics',
        intro: 'Wide World of Sports'
      },
      {
        value: 'education',
        title: 'Academics',
        intro: 'Classmates to Co-workers'
      }
    ];
  }

  static async setMyTemplates(
    userSession: ISessionItem,
    templates: Template[]
  ) {
    const hiveInstance = await HiveService.getSessionInstance(userSession);
    if (userSession && hiveInstance) {
      await hiveInstance.Scripting.RunScript({
        name: 'set_my_templates',
        context: {
          target_did: userSession.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: { templates, did: userSession.did }
      });
    }
  }

  static async getMyTemplates(did: string) {
    const hiveInstance = await HiveService.getAppHiveClient();
    let templates: Template[] = [];
    if (hiveInstance) {
      const res: IRunScriptResponse<PublicProfileResponse> = await hiveInstance.Scripting.RunScript(
        {
          name: 'get_my_templates',
          context: {
            target_did: did,
            target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
          }
        }
      );

      templates =
        (getItemsFromData(res, 'get_my_templates')[0] || {}).templates || [];
    }
    return templates;
  }
}
