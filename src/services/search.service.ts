import { IRunScriptResponse } from '@elastosfoundation/elastos-hive-js-sdk/dist/Services/Scripting.Service';
import { HiveClient } from '@elastosfoundation/elastos-hive-js-sdk';

import { HiveService } from './hive.service';
import { getItemsFromData } from '../utils/script';

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
  appHiveClient!: HiveClient;

  static async getSearchServiceAppOnlyInstance(): Promise<SearchService> {
    let searchService: SearchService = new SearchService();
    const appHiveClient = await HiveService.getAppHiveClient();
    if (appHiveClient) {
      searchService.appHiveClient = appHiveClient;
    }
    return searchService;
  }

  async getUniversities(
    searchString: string,
    limit: number,
    offset: number
  ): Promise<IRunScriptResponse<IUniversitiesResponse | undefined>> {
    let params: any = {
      limit: limit,
      skip: offset
    };

    let universitiesResponse: IRunScriptResponse<IUniversitiesResponse>;

    if (searchString !== null && searchString !== '') {
      params['name'] = '.*' + searchString + '.*';

      universitiesResponse = await this.appHiveClient.Scripting.RunScript({
        name: 'get_universities_by_name',
        params: params,
        context: {
          target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
          target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
        }
      });
    } else {
      universitiesResponse = await this.appHiveClient.Scripting.RunScript({
        name: 'get_all_universities',
        params: params,
        context: {
          target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
          target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
        }
      });
    }

    return universitiesResponse;
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

    if (searchString != null && searchString !== '') {
      if (this.isDID(searchString)) {
        params['did'] = '.*' + searchString + '.*';
        params['self_did'] = [userSession.did];

        const usersResponse: any = await this.appHiveClient.Scripting.RunScript(
          {
            name: 'get_users_by_did',
            params: params,
            context: {
              target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
              target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
            }
          }
        );
        if (
          usersResponse &&
          usersResponse.response &&
          usersResponse.response.get_users_by_did
        ) {
          res.items = usersResponse.response.get_users_by_did.items;
        }
      } else {
        params['name'] = '.*' + searchString + '.*';
        params['self_did'] = [userSession.did];

        const usersResponse: any = await this.appHiveClient.Scripting.RunScript(
          {
            name: 'get_users_by_name',
            params: params,
            context: {
              target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
              target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
            }
          }
        );
        if (
          usersResponse &&
          usersResponse.response &&
          usersResponse.response.get_users_by_name
        ) {
          res.items = usersResponse.response.get_users_by_name.items;
        }
      }
    } else {
      // Scenario 1
      params['onBoardingInfoType'] = 1;
      params['onBoardingInfoStep'] = 5;
      let usersResponse: any = await this.appHiveClient.Scripting.RunScript({
        name: 'get_users_by_onBoardingInfo',
        params: params,
        context: {
          target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
          target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
        }
      });
      if (
        usersResponse &&
        usersResponse.response &&
        usersResponse.response.get_users_by_onBoardingInfo
      ) {
        res.items = res.items.concat(
          usersResponse.response.get_users_by_onBoardingInfo.items
        );
      }

      // Scenario 2
      params['onBoardingInfoType'] = 2;
      params['onBoardingInfoStep'] = 3;
      usersResponse = await this.appHiveClient.Scripting.RunScript({
        name: 'get_users_by_onBoardingInfo',
        params: params,
        context: {
          target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
          target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
        }
      });
      if (
        usersResponse &&
        usersResponse.response &&
        usersResponse.response.get_users_by_onBoardingInfo
      ) {
        res.items = res.items.concat(
          usersResponse.response.get_users_by_onBoardingInfo.items
        );
      }

      // Scenario 3
      params['onBoardingInfoType'] = 0;
      params['onBoardingInfoStep'] = 4;
      usersResponse = await this.appHiveClient.Scripting.RunScript({
        name: 'get_users_by_onBoardingInfo',
        params: params,
        context: {
          target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
          target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
        }
      });
      if (
        usersResponse &&
        usersResponse.response &&
        usersResponse.response.get_users_by_onBoardingInfo
      ) {
        res.items = res.items.concat(
          usersResponse.response.get_users_by_onBoardingInfo.items
        );
      }
    }
    if (res.items.length > 0) {
      res.items = res.items.filter(item => item.did !== userSession.did);
    }

    return res;
  }

  async getUsersByDIDs(
    dids: string[],
    limit: number,
    offset: number
  ): Promise<IRunScriptResponse<ISearchUserResponse>> {
    let params: any = {
      limit: limit,
      skip: offset
    };

    let usersResponse: IRunScriptResponse<ISearchUserResponse>;

    params['dids'] = dids;
    usersResponse = await this.appHiveClient.Scripting.RunScript({
      name: 'get_users_by_dids', // get all users
      params: params,
      context: {
        target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
        target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
      }
    });
    if (usersResponse.error) {
      throw usersResponse.error;
    }
    if (usersResponse.isSuccess) {
      return usersResponse;
    }

    return {
      isSuccess: false,
      response: { get_users_by_dids: { items: [] } }
    };
  }

  // TODO: duplicated function, need to remove
  async searchUsersByDIDs(
    dids: string[],
    limit: number,
    offset: number
  ): Promise<IRunScriptResponse<ISearchUserResponse | undefined>> {
    let params: any = {
      limit: limit,
      skip: offset
    };

    let usersResponse: IRunScriptResponse<ISearchUserResponse> = {
      isSuccess: false,
      response: { get_users_by_dids: { items: [] } }
    };

    params['dids'] = dids;
    usersResponse = await this.appHiveClient.Scripting.RunScript({
      name: 'get_users_by_dids', // get all users
      params: params,
      context: {
        target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
        target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
      }
    });
    if (usersResponse.isSuccess) {
      return usersResponse;
    }
    return usersResponse.error;
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

    if (this.isDID(searchString)) {
      const filteredDids = dids.filter(item => item.includes(searchString));
      params['dids'] = filteredDids;
      const usersResponse: any = await this.appHiveClient.Scripting.RunScript({
        name: 'get_users_by_dids',
        params,
        context: {
          target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
          target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
        }
      });
      items = getItemsFromData(usersResponse, 'get_users_by_dids');
    } else {
      params['name'] = '.*' + searchString + '.*';
      params['dids'] = dids;

      const usersResponse: any = await this.appHiveClient.Scripting.RunScript({
        name: 'get_users_by_name_and_dids',
        params: params,
        context: {
          target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
          target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
        }
      });
      items = getItemsFromData(usersResponse, 'get_users_by_name_and_dids');
    }

    return items;
  }
}
