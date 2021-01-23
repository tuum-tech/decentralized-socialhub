import { HiveClient } from "@elastos/elastos-hive-js-sdk";
import { floor, noConflict } from "lodash";
import { HiveService } from "./hive.service";


export interface IFollowingResponse {
    _status?: string;
    get_following: IGetFollowing;
}

export interface IGetFollowing {
    items: IFollowingItem[];
}

export interface IFollowingItem {
    _id?: { $oid: string };
    created?: { $date: string };
    did: string;
    modified?: { $date: string };

}

export interface IFollowerResponse {
    _status?: string;
    get_followers: IFollowerItem[];
}

export interface IFollowerItem {
    did: string;
    followers: string[];
}



export class ProfileService {

    hiveClient!: HiveClient;
    appHiveClient!: HiveClient;

    static async getProfileServiceInstance(): Promise<ProfileService> {

        let profileService: ProfileService = new ProfileService();
        profileService.hiveClient = await HiveService.getSessionInstance();
        profileService.appHiveClient = await HiveService.getAppHiveClient();
        return profileService;
    }


    async getFollowings(): Promise<IFollowingResponse> {
        let followings: IFollowingResponse = await this.hiveClient.Scripting.RunScript({ "name": "get_following" });

        return followings;
    }

    async resetFollowing(): Promise<any> {
        await this.hiveClient.Database.deleteCollection("following");
        await this.hiveClient.Database.createCollection("following");
        return this.getFollowings();
    }

    getSessionDid(): string {
        return "my_session_did";
    }

    async addFollowing(did: string): Promise<any> {
        await this.hiveClient.Database.insertOne("following", { "did": did }, undefined);
        debugger;


        let followersResponse: IFollowerResponse = await this.appHiveClient.Scripting.RunScript({
            "name": "get_followers",
            "params": {
                "did": did
            }
        });

        let followersList: string[] = [];
        if (followersResponse.get_followers.length > 0)  // TODO: handle this better
            followersList = followersResponse.get_followers[0].followers;

        followersList.push(this.getSessionDid());
        await this.appHiveClient.Scripting.RunScript({
            "name": "set_followers",
            "params": {
                "did": did,
                "followers": followersList
            }
        })

        return this.getFollowings();
    }



}