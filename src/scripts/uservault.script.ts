import { HiveClient } from '@elastosfoundation/elastos-hive-js-sdk';

export class UserVaultScripts {
  static async Execute(hiveClient: HiveClient) {
    await Promise.all([
      this.CreateCollections(hiveClient),
      this.SetScripts(hiveClient)
    ]);
    console.log('uservaultscripts registered');
  }

  static async CreateCollections(hiveClient: HiveClient) {
    await Promise.all([
      hiveClient.Database.createCollection('following'),
      hiveClient.Database.createCollection('basic_profile'),
      hiveClient.Database.createCollection('education_profile'),
      hiveClient.Database.createCollection('experience_profile'),
      hiveClient.Database.createCollection('activities'),
      hiveClient.Database.createCollection('public_fields'),
      hiveClient.Database.createCollection('verifiable_credentials'),
      hiveClient.Database.createCollection('templates'),
      hiveClient.Database.createCollection('team_profile'),
      hiveClient.Database.createCollection('thesis_profile'),
      hiveClient.Database.createCollection('paper_profile'),
      hiveClient.Database.createCollection('license_profile'),
      hiveClient.Database.createCollection('certification_profile'),
      hiveClient.Database.createCollection('game_exp_profile'),
      hiveClient.Database.createCollection('private_spaces')
    ]);
  }

  static async setPublicTemplateScriptSetter(hiveClient: HiveClient) {
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
  }

  static async getPublicFieldsScriptSetter(hiveClient: HiveClient) {
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
  }

  static async setMyTemplatesScriptSet(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'set_my_templates',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'update',
        name: 'set_my_templates',
        output: true,
        body: {
          collection: 'templates',
          filter: {
            did: '$params.did'
          },
          update: {
            $set: {
              templates: '$params.templates'
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

  static async getMyTemplatesScriptSet(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'get_my_templates',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_my_templates',
        output: true,
        body: {
          collection: 'templates'
        }
      }
    });
  }

  static async getFollowingScriptSetter(hiveClient: HiveClient) {
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
  }

  static async getBasicProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async updateBasicProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async getTeamProfileScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'get_team_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_team_profile',
        output: true,
        body: {
          collection: 'team_profile'
        }
      }
    });
  }

  static async updateTeamProfileScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'update_team_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'update',
        name: 'update_team_profile',
        body: {
          collection: 'team_profile',
          filter: {
            guid: '$params.guid'
          },
          update: {
            $set: {
              guid: '$params.guid',
              name: '$params.name',
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
  }

  static async removeTeamItemScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'remove_team_item',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'delete',
        name: 'remove_team_item',
        body: {
          collection: 'team_profile',
          filter: {
            guid: '$params.guid'
          }
        }
      }
    });
  }

  static async getThesisProfileScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'get_thesis_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_thesis_profile',
        output: true,
        body: {
          collection: 'thesis_profile'
        }
      }
    });
  }

  static async updateThesisProfileScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'update_thesis_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'update',
        name: 'update_thesis_profile',
        body: {
          collection: 'thesis_profile',
          filter: {
            guid: '$params.guid'
          },
          update: {
            $set: {
              guid: '$params.guid',
              title: '$params.title',
              publish: '$params.publish',
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
  }

  static async removeThesisProfileScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'remove_thesis_item',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'delete',
        name: 'remove_thesis_item',
        body: {
          collection: 'thesis_profile',
          filter: {
            guid: '$params.guid'
          }
        }
      }
    });
  }

  static async getPaperProfileScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'get_paper_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_paper_profile',
        output: true,
        body: {
          collection: 'paper_profile'
        }
      }
    });
  }

  static async updatePaperProfileScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'update_paper_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'update',
        name: 'update_paper_profile',
        body: {
          collection: 'paper_profile',
          filter: {
            guid: '$params.guid'
          },
          update: {
            $set: {
              guid: '$params.guid',
              title: '$params.title',
              publish: '$params.publish',
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
  }

  static async removePaperItemScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'remove_paper_item',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'delete',
        name: 'remove_paper_item',
        body: {
          collection: 'paper_profile',
          filter: {
            guid: '$params.guid'
          }
        }
      }
    });
  }

  static async getLicenseProfileScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'get_license_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_license_profile',
        output: true,
        body: {
          collection: 'license_profile'
        }
      }
    });
  }
  static async updateLicenseProfileScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'update_license_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'update',
        name: 'update_license_profile',
        body: {
          collection: 'license_profile',
          filter: {
            guid: '$params.guid'
          },
          update: {
            $set: {
              guid: '$params.guid',
              title: '$params.title',
              acknowledger: '$params.acknowledger',
              awardDate: '$params.awardDate',
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
  }

  static async removeLicenseItemScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'remove_license_item',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'delete',
        name: 'remove_license_item',
        body: {
          collection: 'license_profile',
          filter: {
            guid: '$params.guid'
          }
        }
      }
    });
  }

  static async getCertificationProfileScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'get_certification_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_certification_profile',
        output: true,
        body: {
          collection: 'certification_profile'
        }
      }
    });
  }

  static async updateCertificationProfileScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'update_certification_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'update',
        name: 'update_certification_profile',
        body: {
          collection: 'certification_profile',
          filter: {
            guid: '$params.guid'
          },
          update: {
            $set: {
              guid: '$params.guid',
              title: '$params.title',
              acknowledger: '$params.acknowledger',
              awardDate: '$params.awardDate',
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
  }

  static async removeCertificationItemScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'remove_certification_item',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'delete',
        name: 'remove_certification_item',
        body: {
          collection: 'certification_profile',
          filter: {
            guid: '$params.guid'
          }
        }
      }
    });
  }

  static async getGameExpProfileScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'get_game_exp_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_game_exp_profile',
        output: true,
        body: {
          collection: 'game_exp_profile'
        }
      }
    });
  }

  static async updateGameExpProfileScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'update_game_exp_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'update',
        name: 'update_game_exp_profile',
        body: {
          collection: 'game_exp_profile',
          filter: {
            guid: '$params.guid'
          },
          update: {
            $set: {
              guid: '$params.guid',
              name: '$params.name',
              like: '$params.like',
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
  }

  static async removeGameExpItemScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'remove_game_exp_item',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'delete',
        name: 'remove_game_exp_item',
        body: {
          collection: 'game_exp_profile',
          filter: {
            guid: '$params.guid'
          }
        }
      }
    });
  }
  static async getEducationProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async updateEducationProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async removeEducationItemScriptSetter(hiveClient: HiveClient) {
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
  }

  static async getExperienceProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async updateExperienceProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async removeExperienceItemScriptSetter(hiveClient: HiveClient) {
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
  }

  static async getActivityScriptSetter(hiveClient: HiveClient) {
    // activies
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
  }

  static async addActivityScriptSetter(hiveClient: HiveClient) {
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
  }

  static async updateActivityScriptSetter(hiveClient: HiveClient) {
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

  static async addVerifiableCredentialScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'add_verifiablecredential',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'update',
        name: 'add_verifiablecredential',
        body: {
          collection: 'verifiable_credentials',
          filter: {
            id: '$params.id'
          },
          update: {
            $set: {
              id: '$params.id',
              vc: '$params.vc'
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

  static async removeVerifiableCredentialScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'remove_verifiablecredential',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'delete',
        name: 'remove_verifiablecredential',
        body: {
          collection: 'verifiable_credentials',
          filter: {
            id: '$params.id'
          }
        }
      }
    });
  }

  static async getVerifiableCredentialScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'get_verifiable_credentials',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_verifiable_credentials',
        output: true,
        body: {
          collection: 'verifiable_credentials'
        }
      }
    });
  }

  static async getAllSpacesScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'get_all_spaces',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_all_spaces',
        output: true,
        body: {
          collection: 'private_spaces'
        }
      }
    });
  }

  static async getSpacesByNamesScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'get_space_by_names',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_space_by_names',
        output: true,
        body: {
          collection: 'private_spaces',
          filter: {
            name: { $in: '$params.names' }
          }
        }
      }
    });
  }

  static async addSpacesScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'add_space',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'update',
        name: 'add_space',
        body: {
          collection: 'private_spaces',
          filter: {
            guid: '$params.guid'
          },
          update: {
            $set: {
              guid: '$params.guid',
              name: '$params.name',
              description: '$params.description',
              category: '$params.category',
              avatar: '$params.avatar',
              coverPhoto: '$params.coverPhoto',
              publicFields: '$params.publicFields'
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

  static async removeSpaceScriptSetter(hiveClient: HiveClient) {
    await hiveClient.Scripting.SetScript({
      name: 'remove_space',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'delete',
        name: 'remove_space',
        body: {
          collection: 'private_spaces',
          filter: {
            guid: '$params.guid'
          }
        }
      }
    });
  }

  static async SetScripts(hiveClient: HiveClient) {
    // templates

    await Promise.all([
      this.getMyTemplatesScriptSet(hiveClient),
      this.setMyTemplatesScriptSet(hiveClient),
      this.setPublicTemplateScriptSetter(hiveClient),
      this.getPublicFieldsScriptSetter(hiveClient),
      this.getFollowingScriptSetter(hiveClient),
      this.getBasicProfileScriptSetter(hiveClient),
      this.updateBasicProfileScriptSetter(hiveClient),
      this.getTeamProfileScriptSetter(hiveClient),
      this.updateTeamProfileScriptSetter(hiveClient),
      this.removeTeamItemScriptSetter(hiveClient),
      this.getThesisProfileScriptSetter(hiveClient),
      this.updateThesisProfileScriptSetter(hiveClient),
      this.removeThesisProfileScriptSetter(hiveClient),
      this.getPaperProfileScriptSetter(hiveClient),
      this.updatePaperProfileScriptSetter(hiveClient),
      this.removePaperItemScriptSetter(hiveClient),
      this.getLicenseProfileScriptSetter(hiveClient),
      this.updateLicenseProfileScriptSetter(hiveClient),
      this.removeLicenseItemScriptSetter(hiveClient),
      this.getCertificationProfileScriptSetter(hiveClient),
      this.updateCertificationProfileScriptSetter(hiveClient),
      this.removeCertificationItemScriptSetter(hiveClient),
      this.getGameExpProfileScriptSetter(hiveClient),
      this.updateGameExpProfileScriptSetter(hiveClient),
      this.removeGameExpItemScriptSetter(hiveClient),
      this.getEducationProfileScriptSetter(hiveClient),
      this.updateEducationProfileScriptSetter(hiveClient),
      this.removeEducationItemScriptSetter(hiveClient),
      this.getExperienceProfileScriptSetter(hiveClient),
      this.updateExperienceProfileScriptSetter(hiveClient),
      this.removeExperienceItemScriptSetter(hiveClient),
      this.getActivityScriptSetter(hiveClient),
      this.addActivityScriptSetter(hiveClient),
      this.updateActivityScriptSetter(hiveClient),
      this.addVerifiableCredentialScriptSetter(hiveClient),
      this.removeVerifiableCredentialScriptSetter(hiveClient),
      this.getVerifiableCredentialScriptSetter(hiveClient),
      this.getAllSpacesScriptSetter(hiveClient),
      this.getSpacesByNamesScriptSetter(hiveClient),
      this.addSpacesScriptSetter(hiveClient),
      this.removeSpaceScriptSetter(hiveClient)
    ]);
  }

  static async Delete(hiveClient: HiveClient) {
    await hiveClient.Database.deleteCollection('following');
    await hiveClient.Database.deleteCollection('basic_profile');
    await hiveClient.Database.deleteCollection('education_profile');
    await hiveClient.Database.deleteCollection('experience_profile');
    await hiveClient.Database.deleteCollection('activities');
    await hiveClient.Database.deleteCollection('public_fields');
    await hiveClient.Database.deleteCollection('verifiable_credentials');
    await hiveClient.Database.deleteCollection('templates');
    await hiveClient.Database.deleteCollection('team_profile');
    await hiveClient.Database.deleteCollection('thesis_profile');
    await hiveClient.Database.deleteCollection('paper_profile');
    await hiveClient.Database.deleteCollection('license_profile');
    await hiveClient.Database.deleteCollection('certification_profile');
    await hiveClient.Database.deleteCollection('game_exp_profile');
    await hiveClient.Database.deleteCollection('private_spaces');
  }
}
