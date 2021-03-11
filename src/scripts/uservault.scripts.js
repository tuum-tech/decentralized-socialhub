// const { HiveClient, OptionsBuilder } = require('../dist/HiveClient');
// const { ElastosClient } = require('@elastosfoundation/elastos-js-sdk');
// const config = require('./config.json');
// const { testHelper } = require('./testsHelper');
const { HiveClient, OptionsBuilder } = require('@elastos/elastos-hive-js-sdk');
const { ElastosClient } = require('@elastosfoundation/elastos-js-sdk');
const config = require('./config.json');
const { testHelper } = require('./testsHelper');

let run = async () => {
  let client = await testHelper.getHiveInstance(
    config.app1,
    config.dchagastelles,
    config.hive_host,
    config.appId
  );
  //await client.Database.deleteCollection("info_public")
  client.Payment.CreateFreeVault();
  let following = await client.Database.createCollection('following');
  following.insertOne({
    did: 'did:elastos:insTmxdDDuS9wHHfeYD1h5C2onEHh3D8Vq',
  });
  await client.Scripting.SetScript({
    name: 'get_following',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'find',
      name: 'get_following',
      output: true,
      body: {
        collection: 'following',
      },
    },
  });

  await client.Scripting.SetScript({
    name: 'get_full_profile',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'aggregated',
      name: 'get_full_profile',
      body: [
        {
          type: 'find',
          name: 'get_basic',
          output: true,
          body: {
            collection: 'basic_profile',
          },
        },
        {
          type: 'find',
          name: 'get_education_profile',
          output: true,
          body: {
            collection: 'education_profile',
          },
        },
        {
          type: 'find',
          name: 'get_experience_profile',
          output: true,
          body: {
            collection: 'experience_profile',
          },
        },
      ],
    },
  });

  console.log('All scripts OK');
};
run();
