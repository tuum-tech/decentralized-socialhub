import { HiveClient } from "@elastos/elastos-hive-js-sdk";
import { noConflict } from "lodash";
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



export class ProfileService {

    hiveClient!: HiveClient;

    static async getProfileServiceInstance(): Promise<ProfileService> {

        let profileService: ProfileService = new ProfileService();
        let hiveClient = await HiveService.getSessionInstance();
        profileService.hiveClient = hiveClient;

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

    async addFollowing(did: string): Promise<any> {
        await this.hiveClient.Database.insertOne("following", { "did": did }, undefined);
        return this.getFollowings();
    }



}