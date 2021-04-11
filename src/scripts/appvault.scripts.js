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

  const fs = require('fs');

  // ===== followers section start =====
  await client.Database.createCollection('followers');
  await client.Scripting.SetScript({
    name: 'set_followers',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'update',
      name: 'set_followers',
      body: {
        collection: 'followers',
        filter: {
          did: '$params.did'
        },
        update: {
          $set: {
            did: '$params.did',
            followers: '$params.followers'
          }
        },
        options: {
          upsert: true,
          bypass_document_validation: false
        }
      }
    }
  });
  await client.Scripting.SetScript({
    name: 'get_followers',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'find',
      name: 'get_followers',
      output: true,
      body: {
        collection: 'followers',
        filter: {
          did: { $in: '$params.did' }
        },
        options: {
          projection: {
            _id: false,
            created: false
          }
        }
      }
    }
  });

  // ===== users section start =====
  await client.Database.createCollection('users');
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
          did: '$params.did',
          accountType: '$params.accountType',
          passhash: '$params.passhash',
          name: '$params.name',
          userToken: '$params.userToken',
          isDIDPublished: '$params.isDIDPublished',
          onBoardingCompleted: '$params.onBoardingCompleted',
          loginCred: '$params.loginCred',
          tutorialStep: '$params.tutorialStep',
          hiveHost: '$params.hiveHost',
          avatar: '$params.avatar',
          code: '$params.code',
          status: '$params.status'
        }
      }
    }
  });
  await client.Scripting.SetScript({
    name: 'update_user',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'update',
      name: 'update_user',
      body: {
        collection: 'users',
        filter: {
          did: '$params.did'
        },
        update: {
          $set: {
            name: '$params.name',
            'loginCred.email': '$params.email'
          }
        },
        options: {
          upsert: true,
          bypass_document_validation: false
        }
      }
    }
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
          did: '$params.did'
        }
      }
    }
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
          did: '$params.did'
        }
      }
    }
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
          'loginCred.email': '$params.email'
        }
      }
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
              code: '$params.code',
              status: 'WAITING_CONFIRMATION'
            }
          }
        },
        {
          type: 'update',
          name: 'update_status',
          output: false,
          body: {
            collection: 'users',
            filter: {
              code: '$params.code',
              status: 'WAITING_CONFIRMATION'
            },
            update: {
              $set: {
                status: 'CONFIRMED'
              }
            }
          }
        }
      ]
    }
  });
  await client.Scripting.SetScript({
    name: 'update_user_did_info',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'update',
      name: 'update_user_did_info',
      output: false,
      body: {
        collection: 'users',
        filter: {
          code: '$params.code',
          did: '$params.did',
          status: 'CONFIRMED'
        },
        update: {
          $set: {
            did: '$params.did',
            accountType: '$params.accountType',
            passhash: '$params.passhash',
            name: '$params.name',
            userToken: '$params.userToken',
            loginCred: '$params.loginCred',
            isDIDPublished: '$params.isDIDPublished',
            onBoardingCompleted: '$params.onBoardingCompleted',
            tutorialStep: '$params.tutorialStep',
            hiveHost: '$params.hiveHost',
            avatar: '$params.avatar'
          }
        }
      }
    }
  });

  //For searching on explore page
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
        filter: {
          did: { $nin: '$params.self_did' }
        },
        options: {
          limit: 150, //'$params.limit',
          skip: 0 //'$params.skip',
        }
      }
    }
  });

  //For searching on explore page
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
          did: { $nin: '$params.self_did' }
        },
        options: {
          limit: 150, //'$params.limit',
          skip: 0 //'$params.skip',
        }
      }
    }
  });

  //For searching on explore page
  //This seems redundant to get_user_by_did but needed for now as the name in executable is different
  //TODO: Remove it and use `get_user_by_did` instead and handle the result with appropriate output name
  await client.Scripting.SetScript({
    name: 'get_users_by_did',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'find',
      name: 'get_users',
      output: true,
      body: {
        collection: 'users',
        filter: {
          did: { $regex: '$params.did', $nin: '$params.self_did' }
        },
        options: {
          limit: 150, //'$params.limit',
          skip: 0 //'$params.skip',
        }
      }
    }
  });

  await client.Scripting.SetScript({
    name: 'get_users_by_dids',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'find',
      name: 'get_users',
      output: true,
      body: {
        collection: 'users',
        filter: {
          did: { $in: '$params.dids' }
        },
        options: {
          limit: 150, //'$params.limit',
          skip: 0 //'$params.skip',
        }
      }
    }
  });

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
          skip: 0 //'$params.skip',
        }
      }
    }
  });

  await client.Scripting.SetScript({
    name: 'get_universities_by_name',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'find',
      name: 'get_universities',
      output: true,
      body: {
        collection: 'universities',
        filter: {
          name: { $regex: '$params.name', $options: 'i' }
        },
        options: {
          limit: 150, //'$params.limit',
          skip: 0 //'$params.skip',
        }
      }
    }
  });

  console.log('All scripts OK');
};

run();
