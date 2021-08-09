import { HiveClient } from '@elastosfoundation/elastos-hive-js-sdk';

export class UserVaultScripts {
  static async Execute(hiveClient: HiveClient) {
    await this.CreateCollections(hiveClient);
    await this.SetScripts(hiveClient);
    console.log('uservaultscripts registered');
  }

  static async CreateCollections(hiveClient: HiveClient) {
    await hiveClient.Database.createCollection('following');
    await hiveClient.Database.createCollection('basic_profile');
    await hiveClient.Database.createCollection('education_profile');
    await hiveClient.Database.createCollection('experience_profile');
    await hiveClient.Database.createCollection('activities');
    await hiveClient.Database.createCollection('public_fields');
  }

  static async SetScripts(hiveClient: HiveClient) {
    // scripts for public fields of profile
    await hiveClient.Scripting.SetScript({
      name: 'set_public_fields',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'update',
        name: 'set_public_fields',
        body: {
          collection: 'public_fields',
          filter: {
            did: '$params.did'
          },
          update: {
            $set: {
              fields: '$params.fields'
            }
          },
          options: {
            upsert: true,
            bypass_document_validation: false
          }
        }
      }
    });
    await hiveClient.Scripting.SetScript({
      name: 'get_public_fields',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_public_fields',
        output: true,
        body: {
          collection: 'public_fields'
        }
      }
    });

    // scripts for following users managmeent
    await hiveClient.Scripting.SetScript({
      name: 'get_following',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_following',
        output: true,
        body: {
          collection: 'following'
        }
      }
    });

    // scripts for profile management
    await hiveClient.Scripting.SetScript({
      name: 'get_basic_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_basic_profile',
        output: true,
        body: {
          collection: 'basic_profile'
        }
      }
    });
    await hiveClient.Scripting.SetScript({
      name: 'update_basic_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'update',
        name: 'update_basic_profile',
        body: {
          collection: 'basic_profile',
          filter: {
            did: '$params.did'
          },
          update: {
            $set: {
              about: '$params.about'
            }
          },
          options: {
            upsert: true,
            bypass_document_validation: false
          }
        }
      }
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
          collection: 'education_profile'
        }
      }
    });
    await hiveClient.Scripting.SetScript({
      name: 'update_education_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'update',
        name: 'update_education_profile',
        body: {
          collection: 'education_profile',
          filter: {
            guid: '$params.guid'
          },
          update: {
            $set: {
              guid: '$params.guid',
              program: '$params.program',
              institution: '$params.institution',
              start: '$params.start',
              end: '$params.end',
              still: '$params.still',
              description: '$params.description'
            }
          },
          options: {
            upsert: true,
            bypass_document_validation: false
          }
        }
      }
    });
    await hiveClient.Scripting.SetScript({
      name: 'remove_education_item',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'delete',
        name: 'remove_education_item',
        body: {
          collection: 'education_profile',
          filter: {
            guid: '$params.guid'
          }
        }
      }
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
          collection: 'experience_profile'
        }
      }
    });
    await hiveClient.Scripting.SetScript({
      name: 'update_experience_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'update',
        name: 'update_experience_profile',
        body: {
          collection: 'experience_profile',
          filter: {
            guid: '$params.guid'
          },
          update: {
            $set: {
              guid: '$params.guid',
              title: '$params.title',
              institution: '$params.institution',
              start: '$params.start',
              end: '$params.end',
              still: '$params.still',
              description: '$params.description'
            }
          },
          options: {
            upsert: true,
            bypass_document_validation: false
          }
        }
      }
    });
    await hiveClient.Scripting.SetScript({
      name: 'remove_experience_item',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'delete',
        name: 'remove_experience_item',
        body: {
          collection: 'experience_profile',
          filter: {
            guid: '$params.guid'
          }
        }
      }
    });

    await hiveClient.Scripting.SetScript({
      name: 'get_activity',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_activity',
        output: true,
        body: {
          collection: 'activities'
        }
      }
    });
    await hiveClient.Scripting.SetScript({
      name: 'add_activity',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'insert',
        name: 'add_activity',
        output: true,
        body: {
          collection: 'activities',
          document: {
            guid: '$params.guid',
            did: '$params.did',
            message: '$params.message',
            read: '$params.read',
            createdAt: '$params.createdAt',
            updatedAt: '$params.updatedAt'
          }
        }
      }
    });
    await hiveClient.Scripting.SetScript({
      name: 'update_activity',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'update',
        name: 'update_activity',
        body: {
          collection: 'activities',
          filter: {
            guid: '$params.guid'
          },
          update: {
            $set: {
              read: '$params.read',
              updatedAt: '$params.updatedAt'
            }
          },
          options: {
            upsert: true,
            bypass_document_validation: false
          }
        }
      }
    });
  }

  static async Delete(hiveClient: HiveClient) {
    await hiveClient.Database.deleteCollection('following');
    await hiveClient.Database.deleteCollection('basic_profile');
    await hiveClient.Database.deleteCollection('education_profile');
    await hiveClient.Database.deleteCollection('experience_profile');
    await hiveClient.Database.deleteCollection('activities');
    await hiveClient.Database.deleteCollection('public_fields');
  }
}
