import { HiveClient } from "@elastos/elastos-hive-js-sdk";
import { floor, noConflict } from "lodash";
import { HiveService } from "./hive.service";
import { UserService } from "./user.service";

export interface IUniversitiesResponse {
    _status?: string;
    get_universities: IGetUniversities;
}

export interface IGetUniversities {
    items: IUniversityItem[];
}

export interface IUniversityItem {
    web_pages?: string[],
    domains?: string[],
    "state-province"?: null,
    country?: string,
    alpha_two_code?: string,
    name: string  
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
        searchService.hiveClient = await HiveService.getSessionInstance();
        searchService.appHiveClient = await HiveService.getAppHiveClient();
        return searchService;
    }


    async getUniversities(name: string): Promise<IUniversitiesResponse> {
        let universitiesResponse: IUniversitiesResponse = await this.appHiveClient.Scripting.RunScript({
            "name": "get_universities",
            "params": {
                "name": name
            }
        });

        console.log("universities :" + JSON.stringify(universitiesResponse));
        return universitiesResponse;
    }

    getSessionDid(): string {
        return UserService.GetUserSession().did;
    }

    async getUsers(name: string): Promise<IUserResponse> {
        console.log(JSON.stringify(name));
        let usersResponse: IUserResponse = await this.appHiveClient.Scripting.RunScript({
            "name": "get_users",
            "params": {
                "name": name
            }
        });

        console.log("users :" + JSON.stringify(usersResponse));
        return usersResponse;
    }
}