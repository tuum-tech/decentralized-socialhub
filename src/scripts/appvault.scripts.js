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

  // user scripts on tuum vault
  // TODO: possibility of consolidate user et userrecords collection in a sinigle collection
  await client.Database.createCollection('user');
  await client.Scripting.SetScript({
    name: 'get_users',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'find',
      name: 'get_users',
      output: true,
      body: {
        collection: 'users',
        filter: {
          email: '\$params.email',
        },
      },
    }
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
          first_name: '\$params.first_name',
          last_name: '\$params.last_name',
          email: '\$params.email',
          status: '\$params.status',
          code: '\$params.code',
        },
      },
    }
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
              code: '\$params.code',
              status: 'WAITING_CONFIRMATION'
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
              code: '\$params.code',
              status: 'WAITING_CONFIRMATION'
            },
            update: {
              $set: {
                status: 'CONFIRMED',
              },
            },
          },
        },
      ]
    }
  });

  console.log('All scripts OK');
};

run();
