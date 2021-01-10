import { HiveClient } from "@elastos/elastos-hive-js-sdk";
import { noConflict } from "lodash";
import { HiveService } from "./hive.service";


export class ProfileService {

    hiveClient!: HiveClient;

    static async getProfileServiceInstance(): Promise<ProfileService> {

        let profileService: ProfileService = new ProfileService();
        profileService.hiveClient = await HiveService.getSessionInstance("");;
        return profileService;
    }

    async registerScripts() {

        await this.hiveClient.Database.createCollection("following");

        await this.hiveClient.Scripting.SetScript({
            "name": "get_following",
            "executable": {
                "type": "find",
                "name": "get_following",
                "output": true,
                "body": [{
                    "collection": "following"
                }]
            }
        });
    }

    async addFollowing(did: string) {
        let response = await this.hiveClient.Database.insertOne("following", { "did": did }, undefined);
    }



}