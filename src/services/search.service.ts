import { HiveService } from './hive.service';
import { getItemsFromData } from '../utils/script';
import { HiveClient } from '@tuum-tech/hive-js-sdk';
import { Logger } from 'src/shared-base/logger';
import { TuumTechScriptService } from './script.service';

export interface IUniversitiesResponse {
  _status?: string;
  get_universities: IGetUniversities;
}

export interface IGetUniversities {
  items: IUniversityItem[];
}

export interface IUniversityItem {
  web_pages?: string[];
  domains?: string[];
  'state-province'?: null;
  country?: string;
  alpha_two_code?: string;
  name: string;

  did?: string;
  avatar?: string;
}

export interface IUserResponse {
  _status?: string;
  get_users_by_tutorialStep: {
    items: {
      did: string;
      name: string;
      avatar?: string;
      hiveHost: string;
    }[];
  };
}

export interface ISearchUserResponse {
  _status?: string;
  get_users_by_dids: {
    items: ISessionItem[];
  };
}
export interface IGetUsers {
  items: IUserItem[];
}

export interface IUserItem {
  did: string;
  name: string;
  avatar?: string;
  hiveHost: string;
}

export const isDID = (str: string): boolean => {
  // Following are the valid patterns:
  // did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX
  // icJ4z2DULrHEzYSvjKNJpKyhqFDxvYV7pN
  const regex = /^(did:elastos:i|i)+[a-zA-Z0-9]+$/g;
  return str != null && regex.test(str.trim());
};

export class SearchService {
  private static LOG = new Logger('SearchService');

  appHiveClient!: HiveClient;

  static async getSearchServiceAppOnlyInstance(): Promise<SearchService> {
    let searchService: SearchService = new SearchService();
    const appHiveClient = await HiveService.getApplicationHiveClient();
    if (appHiveClient) {
      searchService.appHiveClient = appHiveClient;
    }
    return searchService;
  }

  async getUniversities(
    searchString: string,
    limit: number,
    offset: number
  ): Promise<IUniversitiesResponse | undefined> {
    let params: any = {
      limit: limit,
      skip: offset
    };
    try {
      if (searchString !== null && searchString !== '') {
        params['name'] = '.*' + searchString + '.*';
        return await this.appHiveClient.Scripting.callScript(
          'get_universities_by_name',
          params,
          `${process.env.REACT_APP_APPLICATION_DID}`,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
      } else {
        return await this.appHiveClient.Scripting.callScript(
          'get_all_universities',
          params,
          `${process.env.REACT_APP_APPLICATION_DID}`,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
      }
    } catch (e) {
      SearchService.LOG.error('getUniversities: {}', e);
    }
    return;
  }

  // ID text strings within Elastos DID is an ID Sidechain address encoded
  // using Bitcoin-style Base58 and starting with the letter "i",
  // such asicJ4z2DULrHEzYSvjKNJpKyhqFDxvYV7pN. The DID text string is case sensitive.
  // https://github.com/elastos/Elastos.DID.Method/blob/master/DID/Elastos-DID-Method-Specification_en.md
  isDID(str: string): boolean {
    // did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX
    // icJ4z2DULrHEzYSvjKNJpKyhqFDxvYV7pN

    const regex = /^(did:elastos:i|i)+[a-zA-Z0-9]+$/g;
    return str != null && regex.test(str.trim());
  }

  async getUsers(
    searchString: string,
    limit: number,
    offset: number,
    userSession: ISessionItem
  ): Promise<PeopleDTO> {
    let res: PeopleDTO = {
      items: []
    };

    let params: any = {
      limit: limit,
      skip: offset
    };

    try {
      if (searchString != null && searchString !== '') {
        if (this.isDID(searchString)) {
          params['did'] = '.*' + searchString + '.*';
          params['self_did'] = [userSession.did];
          const usersResponse: any = await this.appHiveClient.Scripting.callScript(
            'get_users_by_did',
            params,
            `${process.env.REACT_APP_APPLICATION_DID}`,
            `${process.env.REACT_APP_APPLICATION_DID}`
          );
          if (usersResponse.get_users_by_did) {
            res.items = usersResponse.get_users_by_did.items;
          }
        } else {
          params['name'] = '.*' + searchString + '.*';
          params['self_did'] = [userSession.did];
          const usersResponse: any = await this.appHiveClient.Scripting.callScript(
            'get_users_by_name',
            params,
            `${process.env.REACT_APP_APPLICATION_DID}`,
            `${process.env.REACT_APP_APPLICATION_DID}`
          );
          if (usersResponse.response.get_users_by_name) {
            res.items = usersResponse.get_users_by_name.items;
          }
        }
      } else {
        params['self_did'] = [userSession.did];
        params['tutorialStep'] = [4]; // only activated users

        const usersResponse: any = await TuumTechScriptService.getUsersByTutorialStep(
          params
        );
        res.items = usersResponse;
      }
      if (res.items.length > 0) {
        res.items = res.items.filter(item => item.did !== userSession.did);
      }
    } catch (e) {
      SearchService.LOG.error('getUsers', e);
    }
    return res;
  }

  async getUsersByDIDs(
    dids: string[],
    limit: number,
    offset: number
  ): Promise<IUserResponse | undefined> {
    let params: any = {
      limit: limit,
      skip: offset
    };

    let usersResponse: IUserResponse = {
      get_users_by_tutorialStep: { items: [] }
    };

    params['dids'] = dids;
    try {
      usersResponse = await TuumTechScriptService.getUsersByDids(params);
    } catch (e) {
      SearchService.LOG.error('getUsersByDIDs: {}', e);
    }
    return usersResponse;
  }

  async searchUsersByDIDs(
    dids: string[],
    limit: number,
    offset: number
  ): Promise<ISearchUserResponse | undefined> {
    let params: any = {
      limit: limit,
      skip: offset
    };

    let usersResponse: ISearchUserResponse = {
      get_users_by_dids: { items: [] }
    };

    params['dids'] = dids;
    try {
      return await this.appHiveClient.Scripting.callScript(
        'get_users_by_dids', // get all users
        params,
        `${process.env.REACT_APP_APPLICATION_DID}`,
        `${process.env.REACT_APP_APPLICATION_DID}`
      );
    } catch (e) {
      SearchService.LOG.error('searchUsersByDIDs: {}', e);
    }
    return usersResponse;
  }

  async filterUserNameAndDids(
    searchString: string,
    dids: string[],
    limit: number,
    offset: number
  ) {
    let items: any[] = [];

    let params: any = {
      limit: limit,
      skip: offset
    };

    try {
      if (this.isDID(searchString)) {
        const filteredDids = dids.filter(item => item.includes(searchString));
        params['dids'] = filteredDids;

        items = await TuumTechScriptService.getUsersByDids(params);
      } else {
        params['name'] = '.*' + searchString + '.*';
        params['dids'] = dids;

        const usersResponse: any = await this.appHiveClient.Scripting.callScript(
          'get_users_by_name_and_dids',
          params,
          `${process.env.REACT_APP_APPLICATION_DID}`,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        items = getItemsFromData(usersResponse, 'get_users_by_name_and_dids');
      }
    } catch (e) {
      SearchService.LOG.error('filterUserNameAndDids: {}', e);
    }
    return items;
  }
}
