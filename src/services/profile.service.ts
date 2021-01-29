import { HiveClient } from "@elastos/elastos-hive-js-sdk";
import { floor, noConflict } from "lodash";
import { HiveService } from "./hive.service";
import { UserService } from "./user.service";


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
    followers?: string;
}

export interface IFollowerResponse {
    _status?: string;
    get_followers: IGetFollowersBody;
}

export interface IGetFollowersBody {
    items: IFollowerItem[];
}

export interface IFollowerItem {
    did: string;
    name: string;
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

    static async getProfileServiceAppOnlyInstance(): Promise<ProfileService> {

        let profileService: ProfileService = new ProfileService();
        profileService.appHiveClient = await HiveService.getAppHiveClient();
        return profileService;
    }


    async getFollowings(): Promise<IFollowingResponse> {
        let followings: IFollowingResponse = await this.hiveClient.Scripting.RunScript({ "name": "get_following" });

        // let followingItems: IFollowingItem[] = [];
        // followings.get_following.items.map(async (item) => {
        //     item.followers = await this.getFollowersCount(item.did)
        //     followingItems.push(item);

        // });
        // followings.get_following.items = followingItems;

        console.log("followings :" + JSON.stringify(followings));
        return followings;
    }

    async resetFollowing(): Promise<any> {
        await this.hiveClient.Database.deleteCollection("following");
        await this.hiveClient.Database.createCollection("following");
        return this.getFollowings();
    }

    getSessionDid(): string {
        return UserService.GetUserSession().did;
    }

    async getFollowers(dids: string[]): Promise<IFollowerResponse> {
        console.log(JSON.stringify(dids));
        let followersResponse: IFollowerResponse = await this.appHiveClient.Scripting.RunScript({
            "name": "get_followers",
            "params": {
                "did": dids
            }
        });

        return followersResponse

    }

    // async getFollowersCount(did: string): Promise<string> {
    //     let followersResponse: IFollowerResponse = await this.getFollowers(did);
    //     //if (followersResponse.get_followers[0].followerslength > 0)

    //     console.log("count :" + followersResponse.get_followers.items[0].followers.length.toString());
    //     return followersResponse.get_followers.items[0].followers.length.toString();
    //     //return 0
    // }


    async unfollow(did: string): Promise<any> {
        console.log("unfollow: " + did);

        let deleteResponse = await this.hiveClient.Database.deleteOne("following", { "did": did });
        console.log(JSON.stringify(deleteResponse));

        let followersResponse: IFollowerResponse = await this.getFollowers([did]);

        let followersList: string[] = [];
        if (followersResponse.get_followers.items.length > 0)  // TODO: handle this better
            followersList = followersResponse.get_followers.items[0].followers;

        followersList = followersList.filter(item => item !== did);

        let uniqueItems = [...new Set(followersList)]; // distinct
        await this.appHiveClient.Scripting.RunScript({
            "name": "set_followers",
            "params": {
                "did": did,
                "followers": uniqueItems
            }
        })

        return this.getFollowings();

    }

    async addFollowing(did: string): Promise<any> {
        await this.hiveClient.Database.insertOne("following", { "did": did }, undefined);

        let followersResponse: IFollowerResponse = await this.getFollowers([did]);

        let followersList: string[] = [];
        if (followersResponse.get_followers.items.length > 0)  // TODO: handle this better
            followersList = followersResponse.get_followers.items[0].followers;

        followersList.push(this.getSessionDid());

        let uniqueItems = [...new Set(followersList)]; // distinct
        await this.appHiveClient.Scripting.RunScript({
            "name": "set_followers",
            "params": {
                "did": did,
                "followers": uniqueItems
            }
        })

        return this.getFollowings();
    }



}