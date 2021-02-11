const { HiveClient, OptionsBuilder } = require('@elastos/elastos-hive-js-sdk');
const { ElastosClient } = require('@elastosfoundation/elastos-js-sdk');
const config = require('./config.json');
const { testHelper } = require('./testsHelper');

let run = async () => {
  let client = await testHelper.getHiveInstance(
    config.app1,
    config.tuum_tech_mnemonic,
    config.hive_host,
    config.appId
  );
  client.Payment.CreateFreeVault();

  await client.Database.createCollection('followers');
  await client.Scripting.SetScript({
    name: 'set_followers',
    executable: {
      type: 'update',
      name: 'set_followers',
      body: {
        collection: 'followers',
        filter: {
          did: '$params.did',
        },
        update: {
          '$set': {
            did: '$params.did',
            followers: '$params.followers',
          },
        },
        options: {
          upsert: true,
          bypass_document_validation: false,
        },
      },
    },
  });

  await client.Scripting.SetScript({
    name: 'get_followers',
    executable: {
      type: 'find',
      name: 'get_followers',
      output: true,
      body: {
        collection: 'followers',
        filter: {
          did: { $in: '$params.did' },
        },
        options: {
          projection: {
            _id: false,
            created: false,
          },
        },
      },
    },
  });

  // userrecord scripts on tuum vault
  await client.Database.createCollection('userrecords');
  await client.Scripting.SetScript({
    name: 'add_userrecord',
    executable: {
      type: 'insert',
      name: 'add_userrecord',
      body: {
        collection: 'userrecords',
        document: {
          username: '$params.username',
          did: '$params.did',
          vaulturl: '$params.vaulturl',
          migrated: false,
        },
      },
    },
  });
  await client.Scripting.SetScript({
    name: 'get_userrecord',
    executable: {
      type: 'find',
      name: 'get_userrecord',
      output: true,
      body: {
        collection: 'userrecords',
        filter: {
          did: '$params.did',
        },
      },
    },
  });
  await client.Scripting.SetScript({
    name: 'migrate_userrecord',
    executable: {
      type: 'update',
      name: 'migrate_userrecord',
      output: true,
      body: {
        collection: 'userrecords',
        filter: {
          did: '$params.did',
        },
        update: {
          '$set': {
            migrated: true,
          },
        },
      },
    },
  });
  console.log('All scripts OK');
};

run();
