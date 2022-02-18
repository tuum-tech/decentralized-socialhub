const config = require('./config.json');
const { testHelper } = require('./testsHelper');

let run = async () => {
  try {
    let client = await testHelper.getHiveInstance(
      config.app1,
      config.tuum_tech_mnemonic,
      config.hive_host,
      config.appId
    );
    client.Payment.CreateFreeVault();

    const fs = require('fs');
    await client.Database.createCollection('community_spaces');
    // ===== spaces section start =====
    await client.Database.createCollection('spaces');
    await client.Scripting.SetScript({
      name: 'add_space',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'insert',
        name: 'add_space',
        output: true,
        body: {
          collection: 'spaces',
          document: {
            owner: '$params.did',
            name: '$params.name'
          }
        }
      }
    });
    await client.Scripting.SetScript({
      name: 'get_all_spaces',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_all_spaces',
        output: true,
        body: {
          collection: 'spaces'
        }
      }
    });
    await client.Scripting.SetScript({
      name: 'remove_space',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'delete',
        name: 'remove_space',
        body: {
          collection: 'spaces',
          filter: {
            name: '$params.name',
            owner: '$params.did'
          }
        }
      }
    });
    // ===== comments section start =====
    await client.Database.createCollection('comments');
    await client.Scripting.SetScript({
      name: 'add_comment',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'insert',
        name: 'add_comment',
        output: true,
        body: {
          collection: 'comments',
          document: {
            did: '$params.did',
            githubIssueId: '$params.githubIssueId',
            comment: '$params.comment',
            createdAt: '$params.createdAt'
          }
        }
      }
    });
    await client.Scripting.SetScript({
      name: 'get_comments_by_github_issue_id',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_comments_by_github_issue_id',
        output: true,
        body: {
          collection: 'comments',
          filter: {
            githubIssueId: '$params.githubIssueId'
          },
          options: {
            limit: '$params.limit',
            skip: '$params.skip'
          }
        }
      }
    });
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
    // ===== verifications =====
    await client.Database.createCollection('verifications');
    await client.Scripting.SetScript({
      name: 'add_verification',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'insert',
        name: 'add_verification',
        output: true,
        body: {
          collection: 'verifications',
          document: {
            from_did: '$params.from_did',
            to_did: '$params.to_did',
            status: 'requested',
            category: '$params.category', // personal info
            records: '$params.records',
            feedbacks: '',
            msg: '$params.msg',
            idKey: '$params.idKey',
            guid: '$params.guid'
          }
        }
      }
    });
    await client.Scripting.SetScript({
      name: 'update_verification',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'update',
        name: 'update_verification',
        output: true,
        body: {
          collection: 'verifications',
          filter: {
            guid: '$params.guid'
          },
          update: {
            $set: {
              status: '$params.status',
              feedbacks: '$params.feedbacks',
              credential: '$params.credential'
            }
          }
        }
      }
    });
    await client.Scripting.SetScript({
      name: 'get_requests_to_me',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_requests_to_me',
        output: true,
        body: {
          collection: 'verifications',
          filter: {
            to_did: '$params.did'
          },
          options: {
            limit: '$params.limit',
            skip: '$params.skip'
          }
        }
      }
    });
    await client.Scripting.SetScript({
      name: 'get_requests_by_me',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_requests_by_me',
        output: true,
        body: {
          collection: 'verifications',
          filter: {
            from_did: '$params.did'
          },
          options: {
            limit: '$params.limit',
            skip: '$params.skip'
          }
        }
      }
    });
    await client.Scripting.SetScript({
      name: 'get_my_verified_credentials',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_my_verified_credentials',
        output: true,
        body: {
          collection: 'verifications',
          filter: {
            from_did: '$params.did',
            status: 'approved'
          },
          options: {
            limit: '$params.limit',
            skip: '$params.skip'
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
            passhash: '$params.passhash', // remove
            name: '$params.name',
            userToken: '$params.userToken',
            isDIDPublished: '$params.isDIDPublished',
            isEssentialUser: '$params.isEssentialUser',
            didPublishTime: '$params.didPublishTime',
            onBoardingCompleted: '$params.onBoardingCompleted',
            loginCred: '$params.loginCred',
            badges: '$params.badges',
            tutorialStep: '$params.tutorialStep',
            hiveHost: '$params.hiveHost',
            avatar: '$params.avatar',
            code: '$params.code',
            status: '$params.status',
            pageTemplate: '$params.pageTemplate',
            timestamp: '$params.timestamp'
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
              coverPhoto: '$params.coverPhoto',
              accountType: '$params.accountType',
              passhash: '$params.passhash',
              name: '$params.name',
              userToken: '$params.userToken',
              loginCred: '$params.loginCred',
              badges: '$params.badges',
              isDIDPublished: '$params.isDIDPublished',
              isEssentialUser: '$params.isEssentialUser',
              didPublishTime: '$params.didPublishTime',
              onBoardingCompleted: '$params.onBoardingCompleted',
              tutorialStep: '$params.tutorialStep',
              hiveHost: '$params.hiveHost',
              avatar: '$params.avatar',
              pageTemplate: '$params.pageTemplate'
            }
          }
        }
      }
    });
    await client.Scripting.SetScript({
      name: 'update_email_user',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'update',
        name: 'update_email_user',
        output: false,
        body: {
          collection: 'users',
          filter: {
            code: '$params.code',
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
              didPublishTime: '$params.didPublishTime',
              onBoardingCompleted: '$params.onBoardingCompleted',
              tutorialStep: '$params.tutorialStep',
              hiveHost: '$params.hiveHost',
              avatar: '$params.avatar'
            }
          }
        }
      }
    });
    // update verify user, called when user request update email
    await client.Scripting.SetScript({
      name: 'update_verify_user',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'update',
        name: 'update_verify_user',
        output: false,
        body: {
          collection: 'users',
          filter: {
            did: '$params.did'
          },
          update: {
            $set: {
              status: 'WAITING_CONFIRMATION',
              code: '$params.code'
            }
          }
        }
      }
    });

    await client.Scripting.SetScript({
      name: 'delete_users',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'delete',
        name: 'delete_users',
        output: true,
        body: {
          collection: 'users',
          filter: {
            did: { $in: '$params.dids' }
          },
          options: {
            limit: '$params.limit',
            skip: '$params.skip'
          }
        }
      }
    });
    await client.Scripting.SetScript({
      name: 'delete_expired_users',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'delete',
        name: 'delete_expired_users',
        output: true,
        body: {
          collection: 'users',
          filter: {
            did: '',
            timestamp: { $lt: '$params.timestamp' }
          }
        }
      }
    });
    await client.Scripting.SetScript({
      name: 'get_users_by_tutorialStep',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_users_by_tutorialStep',
        output: true,
        body: {
          collection: 'users',
          filter: {
            tutorialStep: { $in: '$params.tutorialStep' }
          },
          options: {
            limit: '$params.limit',
            skip: '$params.skip'
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
        name: 'get_users_by_dids',
        output: true,
        body: {
          collection: 'users',
          filter: {
            did: { $in: '$params.dids' }
          },
          options: {
            limit: '$params.limit',
            skip: '$params.skip'
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
        name: 'users_found',
        output: true,
        body: {
          collection: 'users',
          filter: {
            'loginCred.email': '$params.filter'
          }
        }
      }
    });
    await client.Scripting.SetScript({
      name: 'get_users_by_google',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'users_found',
        output: true,
        body: {
          collection: 'users',
          filter: {
            'loginCred.google': '$params.filter'
          }
        }
      }
    });
    await client.Scripting.SetScript({
      name: 'get_users_by_twitter',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'users_found',
        output: true,
        body: {
          collection: 'users',
          filter: {
            'loginCred.twitter': '$params.filter'
          }
        }
      }
    });
    await client.Scripting.SetScript({
      name: 'get_users_by_facebook',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'users_found',
        output: true,
        body: {
          collection: 'users',
          filter: {
            'loginCred.facebook': '$params.filter'
          }
        }
      }
    });
    await client.Scripting.SetScript({
      name: 'get_users_by_linkedin',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'users_found',
        output: true,
        body: {
          collection: 'users',
          filter: {
            'loginCred.linkedin': '$params.filter'
          }
        }
      }
    });
    await client.Scripting.SetScript({
      name: 'get_users_by_github',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'users_found',
        output: true,
        body: {
          collection: 'users',
          filter: {
            'loginCred.github': '$params.filter'
          }
        }
      }
    });
    await client.Scripting.SetScript({
      name: 'get_users_by_discord',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'users_found',
        output: true,
        body: {
          collection: 'users',
          filter: {
            'loginCred.discord': '$params.filter'
          }
        }
      }
    });
    await client.Scripting.SetScript({
      name: 'verify_email_code', // is being used in backend
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'aggregated',
        name: 'verify_email_code',
        body: [
          {
            type: 'find',
            name: 'find_code',
            output: true,
            body: {
              collection: 'users',
              filter: {
                code: '$params.code'
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
                code: '$params.code'
              },
              update: {
                $set: {
                  status: 'CONFIRMED',
                  'loginCred.email': '$params.email'
                }
              }
            }
          }
        ]
      }
    });

    await client.Scripting.SetScript({
      name: 'verify_phone_code', // is being used in backend
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'aggregated',
        name: 'verify_phone_code',
        body: [
          {
            type: 'find',
            name: 'find_code',
            output: true,
            body: {
              collection: 'users',
              filter: {
                code: '$params.code'
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
                code: '$params.code'
              },
              update: {
                $set: {
                  status: 'CONFIRMED',
                  'loginCred.phone': '$params.phone'
                }
              }
            }
          }
        ]
      }
    });

    // ===== For feedbacks ==========
    await client.Database.createCollection('feedbacks');
    await client.Scripting.SetScript({
      name: 'add_feedback',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'insert',
        name: 'add_feedback',
        output: true,
        body: {
          collection: 'feedbacks',
          document: {
            did: '$params.did',
            createdAt: '$params.createdAt',
            feedbacks: '$params.feedbacks'
          }
        }
      }
    });

    // ===== For searching on explore page =====
    await client.Scripting.SetScript({
      name: 'get_users_by_name',
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
            did: { $nin: '$params.self_did' }
          },
          options: {
            limit: '$params.limit',
            skip: '$params.skip'
          }
        }
      }
    });
    await client.Scripting.SetScript({
      name: 'get_users_by_name_and_dids',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_users_by_name_and_dids',
        output: true,
        body: {
          collection: 'users',
          filter: {
            name: { $regex: '$params.name', $options: 'i' },
            did: { $in: '$params.dids' }
          },
          options: {
            limit: '$params.limit',
            skip: '$params.skip'
          }
        }
      }
    });
    await client.Scripting.SetScript({
      name: 'get_users_by_did',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_users_by_did',
        output: true,
        body: {
          collection: 'users',
          filter: {
            did: { $regex: '$params.did', $nin: '$params.self_did' }
          },
          options: {
            limit: '$params.limit',
            skip: '$params.skip'
          }
        }
      }
    });

    // ===== For getting Profile related stats(for daily summary stats) =====
    // Get all the new users on a specific date
    await client.Scripting.SetScript({
      name: 'get_all_users',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_all_users',
        output: true,
        body: {
          collection: 'users'
        }
      }
    });
    // Get all the users according to their accountType. This can be used to get all
    // users who registered via Google, or DID or whatever.
    await client.Scripting.SetScript({
      name: 'get_users_by_account_type',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_users_by_account_type',
        output: true,
        body: {
          collection: 'users',
          filter: {
            accountType: '$params.accountType'
          }
        }
      }
    });
    // This can be used to get all the users who are not using Tuum tech vault
    await client.Scripting.SetScript({
      name: 'get_users_with_othervaultsthanyourown',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_users_with_othervaultsthanyourown',
        output: true,
        body: {
          collection: 'users',
          filter: {
            hiveHost: { $nin: '$params.hiveHost' }
          }
        }
      }
    });

    console.log('All scripts OK');
  } catch (error) {
    console.log(error);
    console.log('Failed to run appVault scripts');
  }
};

run();
