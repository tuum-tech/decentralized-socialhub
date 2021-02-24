const { HiveClient, OptionsBuilder } = require('@elastos/elastos-hive-js-sdk');
const { ElastosClient } = require('@elastosfoundation/elastos-js-sdk');
const config = require('../config.json');
const { testHelper } = require('../testsHelper');



let run = async () => {
    let client = await testHelper.getHiveInstance(
        config.tuum_tech_mnemonic,
        config.tuum_tech_mnemonic,
        config.hive_host,
        config.appId
      );
      client.Payment.CreateFreeVault();

      
      await createRequestEmailScript(client);
      await createAccessCodeScripts(client);

      console.log("all scripts ok")
      
}


let createRequestEmailScript = async (client) =>{
    let collection = await client.Database.createCollection("requestaccess")
    await collection.insertOne(
        {
            "email": ""
        },
        {
            "upsert": true,
            "bypass_document_validation": true
        }
    )

    await client.Scripting.SetScript({
        "name": "email_request_access",
        "allowAnonymousUser": true,
        "allowAnonymousApp": true,
        "executable": {
            "type": "aggregated",
            "name": "add_and_return_request",
            "body": [
                {
                    "type": "update",
                    "name": "add_request_access",
                    "body": {
                        "collection": "requestaccess",
                        "filter": {
                            "email": "\$params.email"
                        },
                        "update": {
                            "\$set": {
                                "email": "\$params.email"
                            }
                        },
                        "options": {
                            "upsert": true,
                            "bypass_document_validation": true
                        }
                    }
                },
                {
                    "type": "find",
                    "name": "get_request_access",
                    "output": true,
                    "body": {
                        "collection": "requestaccess",
                        "filter": {
                            "email": "\$params.email"
                        },
                        "options": {
                            "projection": { "_id": false },
                            "sort": { "created": -1 },
                            "limit": 1
                        }
                    }
                }
            ]
        }
    })
}

let createAccessCodeScripts = async (client) =>{
    await client.Scripting.SetScript({
        "name": "get_requestcode_status",
        "allowAnonymousUser": true,
        "allowAnonymousApp": true,
        "executable": {
            "type": "find",
            "name": "requeststatus",
            "output": true,
            "body":
            {
                "collection": "accessemails",
                "filter": {
                    "accesscode": "\$params.accesscode"
                },
                "options": {
                    "projection": { "_id": false, "accesscode": false, "created": false, "modified": false, "email": false },
                    "sort": { "created": -1 },
                    "limit": 1
                }
            }
        }
    })


    await client.Scripting.SetScript({
        "name": "user_access_code",
        "allowAnonymousUser": true,
        "allowAnonymousApp": true,
        "executable": {
            "type": "aggregated",
            "name": "update_and_return_access",
            "body": [
                {
                    "type": "update",
                    "name": "use_and_return",
                    "body": {
                        "collection": "accessemails",
                        "filter": {
                            "accesscode": "\$params.accesscode",
                        },
                        "update": {
                            "\$set": {
                                "did": "\$params.did",
                                "isUsed": true
                            }
                        },
                        "options": {
                            "upsert": false,
                            "bypass_document_validation": false
                        }
                    }
                },
                {
                    "type": "find",
                    "name": "get_access_code",
                    "output": false,
                    "body": {
                        "collection": "accessemails",
                        "filter": {
                            "accesscode": "\$params.accesscode"
                        },
                        "options": {
                            "projection": { "_id": false, "accesscode": false, created: false, email: false },
                            "sort": { "created": -1, },
                            "limit": 1
                        }
                    }
                }
            ]
        },
        "condition": {
            "type": "queryHasResults",
            "name": "verify_user_permission",
            "body": {
                "collection": "accessemails",
                "filter": {
                    "accesscode": "\$params.accesscode",
                    "isUsed": false
                }
            }
        }

    })
}
run();