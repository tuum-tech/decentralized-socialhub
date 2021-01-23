// just adding the script for now


let info_public = await client.Database.createCollection("followers")

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
                "did": "\$params.did",
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