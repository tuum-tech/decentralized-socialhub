import { IRunScriptResponse } from '@elastosfoundation/elastos-hive-js-sdk/dist/Services/Scripting.Service';
import { Guid } from 'guid-typescript';

import { getItemsFromData } from 'src/utils/script';

import { HiveService } from './hive.service';
import { SearchService } from './search.service';

export class TemplateService {
  static getAllTemplates() {
    return [
      {
        value: 'crypto',
        title: 'Crypto Enthusiast',
        intro: 'Stocks, Investors or buzz-word enthusiast'
      },
      {
        value: 'gamer',
        title: 'Computer Gaming',
        intro: 'Computers are my thing and I rule it'
      },
      {
        value: 'soccer',
        title: 'Soccer/ Football',
        intro: 'For Players & die hard fans'
      },
      {
        value: 'education',
        title: 'Academics',
        intro: 'For students, teachers, researchers'
      },
      {
        value: 'coming',
        title: 'Coming soon',
        intro: 'More templates coming soon'
      }
    ];
  }

  static async setMyTemplates(
    userSession: ISessionItem,
    templates: Template[],
    guid: Guid | null
  ) {
    const hiveInstance = await HiveService.getSessionInstance(userSession);
    if (userSession && hiveInstance) {
      await hiveInstance.Scripting.RunScript({
        name: 'update_my_templates',
        context: {
          target_did: userSession.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: { templates, did: userSession.did, guid: guid || Guid.create() }
      });
    }
  }

  static async getMyTemplates(did: string) {
    let templates: TemplatesResp;

    let searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
    let userResponse = await searchServiceLocal.searchUsersByDIDs([did], 1, 0);
    if (
      !userResponse.isSuccess ||
      !userResponse.response ||
      !userResponse.response.get_users_by_dids ||
      userResponse.response.get_users_by_dids.items.length === 0
    )
      return templates;

    const hiveInstance = await HiveService.getReadOnlyUserHiveClient(
      userResponse.response.get_users_by_dids.items[0].hiveHost
    );

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

      templates = getItemsFromData(res, 'get_my_templates')[0];
    }
    return templates;
  }
}
