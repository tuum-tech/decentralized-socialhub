const { HiveClient, OptionsBuilder } = require("@elastos/elastos-hive-js-sdk");
const { ElastosClient } = require("@elastosfoundation/elastos-js-sdk")
const config = require("./config.json");
const { testHelper } = require("./testsHelper")



let run = async () => {

    let client = await testHelper.getHiveInstance(config.app1, config.tuum_tech_mnemonic, config.hive_host, config.appId)
    client.Payment.CreateFreeVault();

    await client.Database.createCollection("followers")
    await client.Scripting.SetScript({
        "name": "set_followers",
        "executable": {
            "type": "update",
            "name": "set_followers",
            "body": {
                "collection": "followers",
                "filter": {
                    "did": "\$params.did",
                },
                "update": {
                    "\$set": {
                        "did": "\$params.did",
                        "followers": "\$params.followers",
                    }
                },
                "options": {
                    "upsert": true,
                    "bypass_document_validation": false
                }
            }
        }
    })

    await client.Scripting.SetScript({
        "name": "get_followers",
        "executable": {
            "type": "find",
            "name": "get_followers",
            "output": true,
            "body": {
                "collection": "followers",
                "filter": {
                    "did": { $in: "\$params.did" },
                },
                "options": {
                    "projection": {
                        "_id": false,
                        "created": false
                    }
                }
            }
        }
    });



    console.log("All scripts OK")
}

run();