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
  vault_url: string;
}

export class SearchService {
  hiveClient!: HiveClient;
  appHiveClient!: HiveClient;

  static async getSearchServiceInstance(): Promise<SearchService> {
    let searchService: SearchService = new SearchService();
    let hiveClient = await HiveService.getSessionInstance();

    // searchService.hiveClient = await HiveService.getSessionInstance();
    // searchService.appHiveClient = await HiveService.getAppHiveClient();

    console.log('waqas');
    if (hiveClient) searchService.hiveClient = hiveClient;
    console.log('waqas2');
    searchService.appHiveClient = await HiveService.getAppHiveClient();
    console.log('waqas3');
    return searchService;
  }

  // static async getSearchServiceAppOnlyInstance(): Promise<SearchService> {
  //   let searchService: SearchService = new SearchService();
  //   searchService.appHiveClient = await HiveService.getAppHiveClient();
  //   return searchService;
  // }

  async getUniversities(
    name: string
  ): Promise<IRunScriptResponse<IUniversitiesResponse | undefined>> {
    let universitiesResponse: IRunScriptResponse<IUniversitiesResponse> = await this.appHiveClient.Scripting.RunScript(
      {
        name: 'get_universities',
        params: {
          name: name,
        },
      }
    );

    console.log('universities :' + JSON.stringify(universitiesResponse));
    return universitiesResponse;
    // if (universitiesResponse.isSuccess) {
    //   return universitiesResponse.response;
    // }
    // return;
  }

  getSessionDid(): string {
    return UserService.GetUserSession().did;
  }

  async getUsers(
    name: string
  ): Promise<IRunScriptResponse<IUserResponse | undefined>> {
    console.log(JSON.stringify(name));
    console.log('apphiveclient');
    console.log(this.appHiveClient);

    let usersResponse: IRunScriptResponse<IUserResponse> = await this.appHiveClient.Scripting.RunScript(
      {
        name: 'get_users_by_name',
        params: {
          name: '.*' + name + '.*',
        },
      }
    );

    console.log('users :' + JSON.stringify(usersResponse));

    if (usersResponse.isSuccess) {
      return usersResponse;
    }
    return usersResponse.error;
  }
}
