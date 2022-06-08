import { Logger } from 'src/shared-base/logger';
import { Guid } from 'guid-typescript';

import { getItemsFromData } from 'src/utils/script';
import { HiveService } from './hive.service';
import { SearchService } from './search.service';

export class TemplateService {
  private static LOG = new Logger('TemplateService');

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
    const hiveInstance = await HiveService.getHiveClient(userSession);
    if (userSession && hiveInstance) {
      try {
        await hiveInstance.Scripting.callScript(
          'update_my_templates',
          { templates, did: userSession.did },
          userSession.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
      } catch (e) {
        TemplateService.LOG.error('setMyTemplates: {}', e);
      }
    }
  }

  static async getMyTemplates(did: string) {
    let templates: TemplatesResp;

    let searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
    let userResponse = await searchServiceLocal.searchUsersByDIDs([did], 1, 0);
    if (
      !userResponse ||
      !userResponse.get_users_by_dids ||
      userResponse.get_users_by_dids.items.length === 0
    ) {
      return templates;
    }

    // TODO: we can't have AnonymousClients anymore

    const hiveInstance = await HiveService.getApplicationHiveClient(
      userResponse.get_users_by_dids.items[0].hiveHost
    );

    //const hiveInstance = await HiveService.getApplicationHiveClient();

    if (hiveInstance) {
      try {
        const res: PublicProfileResponse = await hiveInstance.Scripting.callScript(
          'get_my_templates',
          {},
          did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        templates =
          (getItemsFromData(res, 'get_my_templates')[0] || {}).templates || [];
      } catch (e) {
        TemplateService.LOG.error('getMyTemplates: {}', e);
      }
    }
    return templates;
  }
}
