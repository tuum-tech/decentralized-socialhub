import { HiveClient } from "@elastos/elastos-hive-js-sdk";
import { all } from "redux-saga/effects";

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
        await hiveClient.Scripting.SetScript({
            "name": "get_following",
            "allowAnonymousUser": true,
            "allowAnonymousApp": true,
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


    static async SetScriptGetBasicProfile(hiveClient: HiveClient, publicAccess = true) {
        if (publicAccess === true)
            await hiveClient.Scripting.SetScript({
                "name": "get_basic_profile",
                "executable": {
                    "type": "find",
                    "name": "get_basic_profile",
                    "output": true,
                    "body": {
                        "collection": "basic_profile"
                    }
                }
            });
        else
            await hiveClient.Scripting.SetScript({
                "name": "get_basic_profile",
                "allowAnonymousUser": false,
                "allowAnonymousApp": false,
                "executable": {
                    "type": "find",
                    "name": "get_basic_profile",
                    "output": true,
                    "body": {
                        "collection": "basic_profile"
                    }
                },
                "condition": {
                    "type": "queryHasResults",
                    "name": "verify_user_permission",
                    "body": {
                        "collection": "basic_profile",
                        "filter": {
                            "did": "\$caller_did",
                        }
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