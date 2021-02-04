import { HiveClient } from "@elastos/elastos-hive-js-sdk";

export class UserVaultScripts {

    static async Execute(hiveClient: HiveClient) {
        console.log("Enter uservaultscripts")

        

        await this.CreateCollections(hiveClient);
        await this.SetScripts(hiveClient);
    }

    static async CreateCollections(hiveClient: HiveClient) {
        await hiveClient.Database.createCollection("following");
    }

    static async SetScripts(hiveClient: HiveClient) {
        await this.SetScriptGetFollowing(hiveClient);
    }

    static async SetScriptGetFollowing(hiveClient: HiveClient) {
        hiveClient.Scripting.SetScript({
            "name": "get_following",
            "executable": {
                "type": "find",
                "name": "get_following",
                "output": true,
                "body": {
                    "collection": "following"
                }
            }
        });
    }

    static async SetGetPublicInfo(hiveClient: HiveClient) {
        hiveClient.Scripting.SetScript({
            "name": "get_public_info",
            "executable": {
                "type": "find",
                "name": "get_public_info",
                "output": true,
                "body": {
                    "collection": "following"
                }
            }
        });
    }
}