import { HiveClient } from '@elastos/elastos-hive-js-sdk';
import { floor, noConflict } from 'lodash';
import { HiveService } from './hive.service';
import { UserService } from './user.service';
import { IRunScriptResponse } from '@elastos/elastos-hive-js-sdk/dist/Services/Scripting.Service';

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

//Get users from tuum-tech vault
export interface IUserResponse {
  _status?: string;
  get_users: IGetUsers;
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

export class SearchService {
  hiveClient!: HiveClient;
  appHiveClient!: HiveClient;

  static async getSearchServiceInstance(): Promise<SearchService> {
    let searchService: SearchService = new SearchService();
    let hiveClient = await HiveService.getSessionInstance();

    if (hiveClient) searchService.hiveClient = hiveClient;
    searchService.appHiveClient = await HiveService.getAppHiveClient();
    return searchService;
  }

  static async getSearchServiceAppOnlyInstance(): Promise<SearchService> {
    let searchService: SearchService = new SearchService();
    searchService.appHiveClient = await HiveService.getAppHiveClient();
    return searchService;
  }

  async getUniversities(
    searchString: string,
    limit: number,
    offset: number
  ): Promise<IRunScriptResponse<IUniversitiesResponse | undefined>> {
    let params: any = {
      limit: limit,
      skip: offset,
    };

    let universitiesResponse: IRunScriptResponse<IUniversitiesResponse>;

    if (searchString != null && searchString != '') {
      params['name'] = '.*' + searchString + '.*';

      universitiesResponse = await this.appHiveClient.Scripting.RunScript({
        name: 'get_universities_by_name',
        params: params,
        context: {
          target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
          target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`,
        },
      });
    } else {
      universitiesResponse = await this.appHiveClient.Scripting.RunScript({
        name: 'get_all_universities',
        params: params,
        context: {
          target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
          target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`,
        },
      });
    }

    console.log('universities :' + JSON.stringify(universitiesResponse));
    return universitiesResponse;
  }

  getSessionDid(): string {
    return UserService.GetUserSession().did;
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
    offset: number
  ): Promise<IRunScriptResponse<IUserResponse | undefined>> {
    let params: any = {
      limit: limit,
      skip: offset,
    };

    let usersResponse: IRunScriptResponse<IUserResponse>;

    if (searchString != null && searchString != '') {
      if (this.isDID(searchString)) {
        params['did'] = '.*' + searchString + '.*';

        usersResponse = await this.appHiveClient.Scripting.RunScript({
          name: 'get_users_by_did',
          params: params,
          context: {
            target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
            target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`,
          },
        });
      } else {
        params['name'] = '.*' + searchString + '.*';

        usersResponse = await this.appHiveClient.Scripting.RunScript({
          name: 'get_users_by_name',
          params: params,
          context: {
            target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
            target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`,
          },
        });
      }
    } else {
      usersResponse = await this.appHiveClient.Scripting.RunScript({
        name: 'get_all_users',
        params: params,
        context: {
          target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
          target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`,
        },
      });
    }

    console.log('users :' + JSON.stringify(usersResponse));

    if (usersResponse.isSuccess) {
      return usersResponse;
    }
    return usersResponse.error;
  }
}
