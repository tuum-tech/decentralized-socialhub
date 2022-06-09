// import { HiveClient, Executable } from '@dchagastelles/hive-js-sdk';
// import {
//   FindExecutable,
//   UpdateExecutable,
//   DeleteExecutable,
//   InsertExecutable,
//   AggregatedExecutable
// } from '@elastosfoundation/hive-js-sdk';

// export class AppVaultScripts {
//   public async setupAssets(hiveClient: HiveClient) {
//     await hiveClient.Database.createCollection('nft_collection_assets');

//     await hiveClient.Scripting.registerScript(
//       'update_nft_collection_assets',
//       new UpdateExecutable(
//         'update_nft_collection_assets',
//         'nft_collection_assets',
//         {
//           guid: '$params.guid'
//         },
//         {
//           $set: {
//             guid: '$params.guid',
//             assets: '$params.assets'
//           }
//         },
//         {
//           upsert: true,
//           bypass_document_validation: false
//         }
//       ) as Executable,
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_nft_collection_assets',
//       new FindExecutable(
//         'get_nft_collection_assets',
//         'nft_collection_assets',
//         {
//           guid: '$params.guid'
//         },
//         null
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );
//   }

//   public async setupCommunitySpaces(hiveClient: HiveClient) {
//     await hiveClient.Database.createCollection('community_spaces');

//     await hiveClient.Scripting.registerScript(
//       'get_nft_collection_spaces',
//       new FindExecutable(
//         'get_nft_collection_spaces',
//         'community_spaces',
//         {
//           category: 'NFT Collection'
//         },
//         null
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_community_spaces',
//       new FindExecutable(
//         'get_community_spaces',
//         'community_spaces',
//         null,
//         null
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_community_space_by_names',
//       new FindExecutable(
//         'get_community_space_by_names',
//         'community_spaces',
//         {
//           name: { $in: '$params.names' }
//         },
//         null
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_community_space_by_ids',
//       new FindExecutable(
//         'get_community_space_by_ids',
//         'community_spaces',
//         {
//           guid: { $in: '$params.guids' }
//         },
//         null
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'add_community_space',
//       new UpdateExecutable(
//         'add_community_space',
//         'community_spaces',
//         {
//           guid: '$params.guid'
//         },
//         {
//           $set: {
//             guid: '$params.guid',
//             name: '$params.name',
//             owner: '$params.owner',
//             description: '$params.description',
//             category: '$params.category',
//             avatar: '$params.avatar',
//             coverPhoto: '$params.coverPhoto',
//             publicFields: '$params.publicFields',
//             tags: '$params.tags',
//             followers: '$params.followers',
//             socialLinks: '$params.socialLinks',
//             meta: '$params.meta'
//           }
//         },
//         {
//           upsert: true,
//           bypass_document_validation: false
//         }
//       ),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'follow_community_space',
//       new UpdateExecutable(
//         'follow_community_space',
//         'community_spaces',
//         {
//           guid: '$params.guid'
//         },
//         {
//           $set: {
//             followers: '$params.followers'
//           }
//         },
//         {
//           upsert: true,
//           bypass_document_validation: false
//         }
//       ),
//       undefined,
//       true,
//       true
//     );
//   }

//   public async setupSpaces(hiveClient: HiveClient) {
//     await hiveClient.Database.createCollection('spaces');

//     await hiveClient.Scripting.registerScript(
//       'get_all_spaces',
//       new FindExecutable('get_all_spaces', 'spaces', null, null).setOutput(
//         true
//       ),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_space_by_ids',
//       new FindExecutable(
//         'get_space_by_ids',
//         'spaces',
//         {
//           guid: { $in: '$params.guids' }
//         },
//         null
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_space_by_owner',
//       new FindExecutable(
//         'get_space_by_owner',
//         'spaces',
//         {
//           owner: '$params.owner'
//         },
//         null
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'add_space',
//       new UpdateExecutable(
//         'add_space',
//         'spaces',
//         {
//           guid: '$params.guid'
//         },
//         {
//           $set: {
//             owner: '$params.owner',
//             guid: '$params.guid',
//             followers: '$params.followers'
//           }
//         },
//         {
//           upsert: true,
//           bypass_document_validation: false
//         }
//       )
//     );

//     await hiveClient.Scripting.registerScript(
//       'remove_space',
//       new DeleteExecutable('remove_space', 'spaces', {
//         guid: '$params.guid'
//       }),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'follow_space',
//       new UpdateExecutable(
//         'follow_space',
//         'spaces',
//         {
//           guid: '$params.guid'
//         },
//         {
//           $set: {
//             followers: '$params.followers'
//           }
//         },
//         {
//           upsert: true,
//           bypass_document_validation: false
//         }
//       ),
//       undefined,
//       true,
//       true
//     );
//   }

//   public async setupComments(hiveClient: HiveClient) {
//     await hiveClient.Database.createCollection('comments');

//     await hiveClient.Scripting.registerScript(
//       'add_comment',
//       new InsertExecutable(
//         'add_comment',
//         'comments',
//         {
//           did: '$params.did',
//           githubIssueId: '$params.githubIssueId',
//           comment: '$params.comment',
//           createdAt: '$params.createdAt'
//         },
//         {
//           bypass_document_validation: false,
//           ordered: false
//         }
//       ),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_comments_by_github_issue_id',
//       new FindExecutable(
//         'get_comments_by_github_issue_id',
//         'comments',
//         {
//           githubIssueId: '$params.githubIssueId'
//         },
//         {
//           limit: '$params.limit',
//           skip: '$params.skip'
//         }
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );
//   }

//   public async setupFollowers(hiveClient: HiveClient) {
//     await hiveClient.Database.createCollection('followers');

//     await hiveClient.Scripting.registerScript(
//       'set_followers',
//       new UpdateExecutable(
//         'set_followers',
//         'followers',
//         {
//           did: '$params.did'
//         },
//         {
//           $set: {
//             did: '$params.did',
//             followers: '$params.followers'
//           }
//         },
//         {
//           upsert: true,
//           bypass_document_validation: false
//         }
//       ),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_followers',
//       new FindExecutable(
//         'get_followers',
//         'followers',
//         {
//           did: { $in: '$params.did' }
//         },
//         {
//           projection: {
//             _id: false,
//             created: false
//           }
//         }
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );
//   }

//   public async setupVerifications(hiveClient: HiveClient) {
//     await hiveClient.Database.createCollection('verifications');

//     await hiveClient.Scripting.registerScript(
//       'add_verification',
//       new InsertExecutable(
//         'add_verification',
//         'verifications',
//         {
//           from_did: '$params.from_did',
//           to_did: '$params.to_did',
//           status: 'requested',
//           category: '$params.category', // personal info
//           records: '$params.records',
//           feedbacks: '',
//           msg: '$params.msg',
//           idKey: '$params.idKey',
//           guid: '$params.guid'
//         },
//         {
//           bypass_document_validation: false,
//           ordered: false
//         }
//       ),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'update_verification',
//       new UpdateExecutable(
//         'update_verification',
//         'verifications',
//         {
//           guid: '$params.guid'
//         },
//         {
//           $set: {
//             status: '$params.status',
//             feedbacks: '$params.feedbacks',
//             credential: '$params.credential'
//           }
//         },
//         {
//           upsert: true,
//           bypass_document_validation: false
//         }
//       ),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_requests_to_me',
//       new FindExecutable(
//         'get_requests_to_me',
//         'verifications',
//         {
//           to_did: '$params.did'
//         },
//         {
//           limit: '$params.limit',
//           skip: '$params.skip'
//         }
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_requests_by_me',
//       new FindExecutable(
//         'get_requests_by_me',
//         'verifications',
//         {
//           from_did: '$params.did'
//         },
//         {
//           limit: '$params.limit',
//           skip: '$params.skip'
//         }
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_my_verified_credentials',
//       new FindExecutable(
//         'get_my_verified_credentials',
//         'verifications',
//         {
//           from_did: '$params.did',
//           status: 'approved'
//         },
//         {
//           limit: '$params.limit',
//           skip: '$params.skip'
//         }
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );
//   }

//   public async setupUsers(hiveClient: HiveClient) {
//     await hiveClient.Database.createCollection('users');

//     await hiveClient.Scripting.registerScript(
//       'add_user',
//       new InsertExecutable(
//         'add_user',
//         'users',
//         {
//           did: '$params.did',
//           accountType: '$params.accountType',
//           passhash: '$params.passhash', // remove
//           name: '$params.name',
//           userToken: '$params.userToken',
//           isDIDPublished: '$params.isDIDPublished',
//           isEssentialUser: '$params.isEssentialUser',
//           didPublishTime: '$params.didPublishTime',
//           onBoardingCompleted: '$params.onBoardingCompleted',
//           loginCred: '$params.loginCred',
//           badges: '$params.badges',
//           tutorialStep: '$params.tutorialStep',
//           hiveHost: '$params.hiveHost',
//           avatar: '$params.avatar',
//           code: '$params.code',
//           status: '$params.status',
//           pageTemplate: '$params.pageTemplate',
//           timestamp: '$params.timestamp'
//         },
//         {
//           bypass_document_validation: false,
//           ordered: false
//         }
//       ),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'update_user',
//       new UpdateExecutable(
//         'update_user',
//         'users',
//         {
//           code: '$params.code',
//           did: '$params.did',
//           status: 'CONFIRMED'
//         },
//         {
//           $set: {
//             did: '$params.did',
//             coverPhoto: '$params.coverPhoto',
//             accountType: '$params.accountType',
//             passhash: '$params.passhash',
//             name: '$params.name',
//             userToken: '$params.userToken',
//             loginCred: '$params.loginCred',
//             badges: '$params.badges',
//             isDIDPublished: '$params.isDIDPublished',
//             isEssentialUser: '$params.isEssentialUser',
//             didPublishTime: '$params.didPublishTime',
//             onBoardingCompleted: '$params.onBoardingCompleted',
//             tutorialStep: '$params.tutorialStep',
//             hiveHost: '$params.hiveHost',
//             avatar: '$params.avatar',
//             pageTemplate: '$params.pageTemplate'
//           }
//         },
//         {
//           upsert: true,
//           bypass_document_validation: false
//         }
//       ).setOutput(false),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'update_email_user',
//       new UpdateExecutable(
//         'update_email_user',
//         'users',
//         {
//           code: '$params.code',
//           status: 'CONFIRMED'
//         },
//         {
//           $set: {
//             did: '$params.did',
//             accountType: '$params.accountType',
//             passhash: '$params.passhash',
//             name: '$params.name',
//             userToken: '$params.userToken',
//             loginCred: '$params.loginCred',
//             isDIDPublished: '$params.isDIDPublished',
//             didPublishTime: '$params.didPublishTime',
//             onBoardingCompleted: '$params.onBoardingCompleted',
//             tutorialStep: '$params.tutorialStep',
//             hiveHost: '$params.hiveHost',
//             avatar: '$params.avatar'
//           }
//         },
//         {
//           upsert: true,
//           bypass_document_validation: false
//         }
//       ).setOutput(false),
//       undefined,
//       true,
//       true
//     );

//     // update verify user, called when user request update email
//     await hiveClient.Scripting.registerScript(
//       'update_verify_user',
//       new UpdateExecutable(
//         'update_verify_user',
//         'users',
//         {
//           did: '$params.did'
//         },
//         {
//           $set: {
//             status: 'WAITING_CONFIRMATION',
//             code: '$params.code'
//           }
//         },
//         {
//           upsert: true,
//           bypass_document_validation: false
//         }
//       ).setOutput(false),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'delete_users',
//       new DeleteExecutable('delete_users', 'users', {
//         did: { $in: '$params.dids' }
//       }).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'delete_expired_users',
//       new DeleteExecutable('delete_expired_users', 'users', {
//         did: '',
//         timestamp: { $lt: '$params.timestamp' }
//       }).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_users_by_tutorialStep',
//       new FindExecutable(
//         'get_users_by_tutorialStep',
//         'users',
//         {
//           tutorialStep: { $in: '$params.tutorialStep' }
//         },
//         {
//           limit: '$params.limit',
//           skip: '$params.skip'
//         }
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_users_by_dids',
//       new FindExecutable(
//         'get_users_by_dids',
//         'users',
//         {
//           did: { $in: '$params.dids' }
//         },
//         {
//           limit: '$params.limit',
//           skip: '$params.skip'
//         }
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_users_by_email',
//       new FindExecutable(
//         'users_found',
//         'users',
//         {
//           'loginCred.email': '$params.filter'
//         },
//         null
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_users_by_google',
//       new FindExecutable(
//         'users_found',
//         'users',
//         {
//           'loginCred.google': '$params.filter'
//         },
//         null
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_users_by_twitter',
//       new FindExecutable(
//         'users_found',
//         'users',
//         {
//           'loginCred.twitter': '$params.filter'
//         },
//         null
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_users_by_facebook',
//       new FindExecutable(
//         'users_found',
//         'users',
//         {
//           'loginCred.facebook': '$params.filter'
//         },
//         null
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_users_by_linkedin',
//       new FindExecutable(
//         'users_found',
//         'users',
//         {
//           'loginCred.linkedin': '$params.filter'
//         },
//         null
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_users_by_github',
//       new FindExecutable(
//         'users_found',
//         'users',
//         {
//           'loginCred.github': '$params.filter'
//         },
//         null
//       ).setOutput(true)
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_users_by_discord',
//       new FindExecutable(
//         'users_found',
//         'users',
//         {
//           'loginCred.discord': '$params.filter'
//         },
//         null
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'verify_email_code', // is being used in backend
//       new AggregatedExecutable('verify_email_code', [
//         new FindExecutable(
//           'find_code',
//           'users',
//           {
//             code: '$params.code'
//           },
//           null
//         ).setOutput(true),
//         new UpdateExecutable(
//           'update_status',
//           'users',
//           {
//             code: '$params.code'
//           },
//           {
//             $set: {
//               status: 'CONFIRMED',
//               'loginCred.email': '$params.email'
//             }
//           },
//           null
//         ).setOutput(false)
//       ]),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'verify_phone_code', // is being used in backend
//       new AggregatedExecutable('verify_phone_code', [
//         new FindExecutable(
//           'find_code',
//           'users',
//           {
//             code: '$params.code'
//           },
//           null
//         ).setOutput(true),
//         new UpdateExecutable(
//           'update_status',
//           'users',
//           {
//             code: '$params.code'
//           },
//           {
//             $set: {
//               status: 'CONFIRMED',
//               'loginCred.phone': '$params.phone'
//             }
//           },
//           null
//         ).setOutput(false)
//       ]),
//       undefined,
//       true,
//       true
//     );

//     // ===== For searching on explore page =====
//     await hiveClient.Scripting.registerScript(
//       'get_users_by_name',
//       new FindExecutable(
//         'get_users_by_name',
//         'users',
//         {
//           name: { $regex: '$params.name', $options: 'i' },
//           did: { $nin: '$params.self_did' }
//         },
//         {
//           limit: '$params.limit',
//           skip: '$params.skip'
//         }
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_users_by_name_and_dids',
//       new FindExecutable(
//         'get_users_by_name_and_dids',
//         'users',
//         {
//           name: { $regex: '$params.name', $options: 'i' },
//           did: { $in: '$params.dids' }
//         },
//         {
//           limit: '$params.limit',
//           skip: '$params.skip'
//         }
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     await hiveClient.Scripting.registerScript(
//       'get_users_by_did',
//       new FindExecutable(
//         'get_users_by_did',
//         'users',
//         {
//           did: { $regex: '$params.did', $nin: '$params.self_did' }
//         },
//         {
//           limit: '$params.limit',
//           skip: '$params.skip'
//         }
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     // ===== For getting Profile related stats(for daily summary stats) =====
//     // Get all the new users on a specific date
//     await hiveClient.Scripting.registerScript(
//       'get_all_users',
//       new FindExecutable('get_all_users', 'users', null, null).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     // Get all the users according to their accountType. This can be used to get all
//     // users who registered via Google, or DID or whatever.
//     await hiveClient.Scripting.registerScript(
//       'get_users_by_account_type',
//       new FindExecutable(
//         'get_users_by_account_type',
//         'users',
//         {
//           accountType: '$params.accountType'
//         },
//         null
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );

//     // This can be used to get all the users who are not using Tuum tech vault
//     await hiveClient.Scripting.registerScript(
//       'get_users_with_othervaultsthanyourown',
//       new FindExecutable(
//         'get_users_with_othervaultsthanyourown',
//         'users',
//         {
//           hiveHost: { $nin: '$params.hiveHost' }
//         },
//         null
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );
//   }

//   public async setupFeedbacks(hiveClient: HiveClient) {
//     await hiveClient.Database.createCollection('feedbacks');

//     await hiveClient.Scripting.registerScript(
//       'add_feedback',
//       new InsertExecutable(
//         'add_feedback',
//         'feedbacks',
//         {
//           did: '$params.did',
//           createdAt: '$params.createdAt',
//           feedbacks: '$params.feedbacks'
//         },
//         null
//       ).setOutput(true),
//       undefined,
//       true,
//       true
//     );
//   }

//   public async Execute(hiveClient: HiveClient) {
//     await hiveClient.VaultSubscription.subscribe();
//     this.setupCommunitySpaces(hiveClient);
//     this.setupAssets(hiveClient);
//     this.setupSpaces(hiveClient);
//     this.setupComments(hiveClient);
//     this.setupFollowers(hiveClient);
//     this.setupVerifications(hiveClient);
//     this.setupUsers(hiveClient);
//     this.setupFeedbacks(hiveClient);
//   }
// }
