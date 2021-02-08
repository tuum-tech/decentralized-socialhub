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

    //store and retrieve universities data from tuum-tech vault
    await client.Database.createCollection("universities")
    const fs = require('fs');

    fs.readFile('./src/data/world_universities_and_domains.json', (err, data) => {
        if (err) throw err;
        let universityList = JSON.parse(data);
        console.log(universityList[0]);
        client.Database.insertMany("universities",universityList)
    });

    await client.Scripting.SetScript({
        "name": "get_universities",
        "allowAnonymousUser": true,
        "allowAnonymousApp": true,
        "executable": {
            "type": "find",
            "name": "get_universities",
            "output": true,
            "body": {
                "collection": "universities",
                "filter": {
                    "name": { $in: "\$params.name" },
                }
            }
        }
    });

    await client.Scripting.SetScript({
        "name": "get_users",
        "allowAnonymousUser": true,
        "allowAnonymousApp": true,
        "executable": {
            "type": "find",
            "name": "get_users",
            "output": true,
            "body": {
                "collection": "users",
                "filter": {
                    "name": { $in: "\$params.name" },
                }
            }
        }
    });

    console.log("All scripts OK")
}

run();