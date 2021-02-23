import { HiveClient } from '@elastos/elastos-hive-js-sdk';
// import { all } from 'redux-saga/effects';

export class UserVaultScripts {
  static async Execute(hiveClient: HiveClient) {
    console.log('Enter uservaultscripts');

    await this.CreateCollections(hiveClient);
    await this.SetScripts(hiveClient);
  }

  static async CreateCollections(hiveClient: HiveClient) {
    await hiveClient.Database.createCollection('following');
    await hiveClient.Database.createCollection('userdetails');
    await hiveClient.Database.createCollection('basic_profile');
    await hiveClient.Database.createCollection('education_profile');
    await hiveClient.Database.createCollection('experience_profile');
  }

  static async SetScripts(hiveClient: HiveClient) {
    await this.SetScriptGetFollowing(hiveClient);
    await this.SetScriptsForUserDetails(hiveClient);
    await this.SetScriptsForProfile(hiveClient);
  }

  static async SetScriptsForProfile(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'get_basic_profile',
      executable: {
        type: 'find',
        name: 'get_basic_profile',
        output: true,
        body: {
          collection: 'basic_profile',
        },
      },
    });

    await hiveClient.Scripting.SetScript({
      name: 'get_education_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_education_profile',
        output: true,
        body: {
          collection: 'education_profile',
        },
      },
    });

    await hiveClient.Scripting.SetScript({
      name: 'get_experience_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_experience_profile',
        output: true,
        body: {
          collection: 'experience_profile',
        },
      },
    });

    await hiveClient.Scripting.SetScript({
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
  }

  static async SetScriptGetFollowing(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'get_following',
      executable: {
        type: 'find',
        name: 'get_following',
        output: true,
        body: {
          collection: 'following',
        },
      },
    });
  }

  static async SetScriptGetBasicProfile(
    hiveClient: HiveClient,
    publicAccess = true
  ) {
    if (publicAccess === true)
      await hiveClient.Scripting.SetScript({
        name: 'get_basic_profile',
        executable: {
          type: 'find',
          name: 'get_basic_profile',
          output: true,
          body: {
            collection: 'basic_profile',
          },
        },
      });
    else
      await hiveClient.Scripting.SetScript({
        name: 'get_basic_profile',
        executable: {
          type: 'find',
          name: 'get_basic_profile',
          output: true,
          body: {
            collection: 'basic_profile',
          },
        },
        condition: {
          type: 'queryHasResults',
          name: 'verify_user_permission',
          body: {
            collection: 'basic_profile',
            filter: {
              did: '$caller_did',
            },
          },
        },
      });
  }

  static async SetGetPublicInfo(hiveClient: HiveClient) {
    hiveClient.Scripting.SetScript({
      name: 'get_public_info',
      executable: {
        type: 'find',
        name: 'get_public_info',
        output: true,
        body: {
          collection: 'following',
        },
      },
    });
  }

  static async SetScriptsForUserDetails(hiveClient: HiveClient) {
    hiveClient.Scripting.SetScript({
      name: 'add_userdetails',
      executable: {
        type: 'insert',
        name: 'add_userdetails',
        body: {
          collection: 'userdetails',
          document: {
            category: '$params.category',
            data: '$params.data',
          },
          options: { bypass_document_validation: false },
        },
      },
    });
    hiveClient.Scripting.SetScript({
      name: 'get_all_userdetails',
      executable: {
        type: 'find',
        name: 'get_all_userdetails',
        output: true,
        body: {
          collection: 'userdetails',
        },
      },
    });
    hiveClient.Scripting.SetScript({
      name: 'find_category_data',
      executable: {
        type: 'find',
        name: 'find_category_data',
        output: true,
        body: {
          collection: 'userdetails',
          filter: {
            category: '$params.category',
          },
        },
      },
    });
    hiveClient.Scripting.SetScript({
      name: 'update_category_data',
      executable: {
        type: 'update',
        name: 'update_category_data',
        output: true,
        body: {
          collection: 'userdetails',
          filter: {
            category: '$params.category',
          },
          update: {
            $set: {
              data: '$params.data',
            },
          },
        },
      },
    });
  }
}
