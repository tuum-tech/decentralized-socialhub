import { HiveClient } from "@elastos/elastos-hive-js-sdk";
import { IRunScriptResponse } from "@elastos/elastos-hive-js-sdk/dist/Services/Scripting.Service";
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
        let hiveClient = await HiveService.getSessionInstance();

        if (hiveClient) profileService.hiveClient = hiveClient
        profileService.appHiveClient = await HiveService.getAppHiveClient();
        return profileService;
    }


    async getFollowings(): Promise<IFollowingResponse | undefined> {
        if (!this.hiveClient) return
        let followings  = await this.hiveClient.Scripting.RunScript<IFollowingResponse>({ "name": "get_following" });

        // let followingItems: IFollowingItem[] = [];
        // followings.get_following.items.map(async (item) => {
        //     item.followers = await this.getFollowersCount(item.did)
        //     followingItems.push(item);

        // });
        // followings.get_following.items = followingItems;

        if (followings.isSuccess)
        {
            console.log("followings :" + JSON.stringify(followings));
            return followings.response;
        }

        return
        
    }


    async resetFollowing(): Promise<any> {
        if (!this.hiveClient) return
        await this.hiveClient.Database.deleteCollection("following");
        await this.hiveClient.Database.createCollection("following");
        return this.getFollowings();
    }

    getSessionDid(): string {
        return UserService.GetUserSession().did;
    }

    async getFollowers(dids: string[]): Promise<IFollowerResponse | undefined> {

        console.log(JSON.stringify(dids));
        let followersResponse: IRunScriptResponse<IFollowerResponse> = await this.appHiveClient.Scripting.RunScript({
            "name": "get_followers",
            "params": {
                "did": dids
            }
        });

        if (followersResponse.isSuccess)
        {
            return followersResponse.response
        }
        return 
    }

    // async getFollowersCount(did: string): Promise<string> {
    //     let followersResponse: IFollowerResponse = await this.getFollowers(did);
    //     //if (followersResponse.get_followers[0].followerslength > 0)

    //     console.log("count :" + followersResponse.get_followers.items[0].followers.length.toString());
    //     return followersResponse.get_followers.items[0].followers.length.toString();
    //     //return 0
    // }


    async unfollow(did: string): Promise<any> {
        if (!this.hiveClient) return
        console.log("unfollow: " + did);

        let deleteResponse = await this.hiveClient.Database.deleteOne("following", { "did": did });
        console.log(JSON.stringify(deleteResponse));

        let followersResponse = await this.getFollowers([did]);
        let followersList: string[] = [];
        if (followersResponse && followersResponse.get_followers.items.length > 0)  // TODO: handle this better
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
        if (!this.hiveClient) return
        await this.hiveClient.Database.insertOne("following", { "did": did }, undefined);

        let followersResponse = await this.getFollowers([did]);

        let followersList: string[] = [];
        if (followersResponse && followersResponse.get_followers.items.length > 0)  // TODO: handle this better
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