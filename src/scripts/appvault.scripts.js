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

  // ===== followers section start =====
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
          $set: {
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
  // ===== followers section end =====

  const fs = require('fs');

  // ===== users section start =====
  await client.Database.createCollection('users');

  fs.readFile('./src/data/dummy_users.json', (err, data) => {
    if (err) throw err;
    let dummyUsersList = JSON.parse(data);
    console.log(dummyUsersList[0]);
    client.Database.insertMany('users', dummyUsersList);
  });

  await client.Scripting.SetScript({
    name: 'add_user',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'insert',
      name: 'add_user',
      output: true,
      body: {
        collection: 'users',
        document: {
          firstName: '$params.firstName',
          lastName: '$params.lastName',
          name: '$params.full_name',
          email: '$params.email',
          status: '$params.status',
          code: '$params.code',
          did: '$params.did',
          hiveHost: '$params.hiveHost',
          accountType: '$params.accountType',
          userToken: '$params.userToken',
        },
      },
    },
  });
  await client.Scripting.SetScript({
    name: 'delete_user_by_did',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'delete',
      name: 'delete_user_by_did',
      output: true,
      body: {
        collection: 'users',
        filter: {
          did: '$params.did',
        },
      },
    },
  });
  await client.Scripting.SetScript({
    name: 'get_user_by_did',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'find',
      name: 'get_user_by_did',
      output: true,
      body: {
        collection: 'users',
        filter: {
          did: '$params.did',
        },
      },
    },
  });
  await client.Scripting.SetScript({
    name: 'get_users_by_email',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'find',
      name: 'get_users_by_email',
      output: true,
      body: {
        collection: 'users',
        filter: {
          email: '$params.email',
        },
      },
    },
  });
  await client.Scripting.SetScript({
    name: 'verify_code',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'aggregated',
      name: 'find_and_update_code',
      body: [
        {
          type: 'find',
          name: 'find_code',
          output: true,
          body: {
            collection: 'users',
            filter: {
              code: '$params.code',
              status: 'WAITING_CONFIRMATION',
            },
          },
        },
        {
          type: 'update',
          name: 'update_status',
          output: false,
          body: {
            collection: 'users',
            filter: {
              code: '$params.code',
              status: 'WAITING_CONFIRMATION',
            },
            update: {
              $set: {
                status: 'CONFIRMED',
              },
            },
          },
        },
      ],
    },
  });
  await client.Scripting.SetScript({
    name: 'get_all_universities',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'find',
      name: 'get_universities',
      output: true,
      body: {
        collection: 'universities',
        options: {
          limit: 150, //'$params.limit',
          skip: 0, //'$params.skip',
        },
      },
    },
  });

  await client.Scripting.SetScript({
    name: 'get_universities_by_name',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'find',
      name: 'get_users_by_name',
      output: true,
      body: {
        collection: 'users',
        filter: {
          name: { $regex: '$params.name', $options: 'i' },
        },
        options: {
          limit: 150, //'$params.limit',
          skip: 0, //'$params.skip',
        },
      },
    },
  });
  // ===== users section end =====

  // ===== universities section start =====
  //store and retrieve universities data from tuum-tech vault
  await client.Database.deleteCollection('universities');
  await client.Database.createCollection('universities');

  fs.readFile('./src/data/world_universities_and_domains.json', (err, data) => {
    if (err) throw err;
    let universityList = JSON.parse(data);
    console.log(universityList[0]);
    client.Database.insertMany('universities', universityList);
  });

  await client.Scripting.SetScript({
    name: 'get_all_users',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'find',
      name: 'get_users',
      output: true,
      body: {
        collection: 'users',
        options: {
          limit: 150, //'$params.limit',
          skip: 0, //'$params.skip',
        },
      },
    },
  });

  await client.Scripting.SetScript({
    name: 'get_users_by_name',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'find',
      name: 'get_users',
      output: true,
      body: {
        collection: 'users',
        filter: {
          name: { $regex: '$params.name', $options: 'i' },
        },
        options: {
          limit: 150, //'$params.limit',
          skip: 0, //'$params.skip',
        },
      },
    },
  });

  await client.Scripting.SetScript({
    name: 'get_users_by_did',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'find',
      name: 'get_universities',
      output: true,
      body: {
        collection: 'universities',
        filter: {
          did: { $regex: '$params.did' },
        },
        options: {
          limit: 150, //'$params.limit',
          skip: 0, //'$params.skip',
        },
      },
    },
  });
  // ===== universities section end =====
  console.log('All scripts OK');
};

run();
