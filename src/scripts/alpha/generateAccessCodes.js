const { HiveClient, OptionsBuilder } = require('@elastos/elastos-hive-js-sdk');
const { ElastosClient } = require('@elastosfoundation/elastos-js-sdk');
const config = require('../config.json');
const { testHelper } = require('../testsHelper');
const maillist = require("./emails.json");


let run = async () => {
    let client = await testHelper.getHiveInstance(
        config.app1,
        config.tuum_tech_mnemonic,
        config.hive_host,
        config.appId
    );
    client.Payment.CreateFreeVault();


    let collection = await client.Database.createCollection("accessemails")
    let emails = []

    maillist.emails.forEach(email => {
        let code = generateCode()
        emails.push({ "email": email, "accesscode": code, "isUsed": false })
    });

    await collection.insertMany(emails)
    
    console.log("generated codes", emails)

}

let generateCode = () => {
    let result = '';
    let characters = 'BCDEFGHJKLMNPQRSTUVWXYZ';
    for (var i = 0; i < 7; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

run();