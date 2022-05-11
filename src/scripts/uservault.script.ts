import { HiveClient } from '@elastosfoundation/elastos-hive-js-sdk';

export class UserVaultScripts {
  static async Execute(hiveClient: HiveClient) {
    try {
      if (hiveClient && hiveClient.isConnected) {
        await hiveClient.Payment.CreateFreeVault();
      }
    } catch (e) {
      console.log(`Error while creating vault: ${e}`);
    }
    try {
      console.log('Setup the uservault');
      await this.CreateCollections(hiveClient);
      console.log('Created all the collections for the uservault');
      await new Promise(f => setTimeout(f, 2000));
    } catch (e) {
      console.log(`Error while creating collections: ${e}`);
    }
    try {
      await this.SetScripts(hiveClient);
      console.log('Registered all the scripts for the uservault');
      await new Promise(f => setTimeout(f, 2000));
    } catch (e) {
      console.log(`Error while registering scripts: ${e}`);
    }
  }

  static async CreateCollections(hiveClient: HiveClient) {
    await Promise.all([
      hiveClient.Database.createCollection('templates'),
      hiveClient.Database.createCollection('public_fields'),
      hiveClient.Database.createCollection('following'),
      hiveClient.Database.createCollection('basic_profile'),
      hiveClient.Database.createCollection('education_profile'),
      hiveClient.Database.createCollection('experience_profile'),
      hiveClient.Database.createCollection('activities'),
      hiveClient.Database.createCollection('verifiable_credentials'),
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
    console.log("Registering uservault script 'set_public_fields'...");
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
    console.log(
      "Completed registration of uservault script 'set_public_fields'"
    );
  }

  static async getPublicFieldsScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getPublicFieldsScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'getPublicFieldsScriptSetter'"
    );
  }

  static async getMyTemplatesScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'getMyTemplatesScriptSetter'...");
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
    console.log(
      "Completed registration of uservault script 'getMyTemplatesScriptSetter'"
    );
  }

  static async updateMyTemplatesScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateMyTemplatesScriptSetter'..."
    );
    await hiveClient.Scripting.SetScript({
      name: 'update_my_templates',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'update',
        name: 'update_my_templates',
        body: {
          collection: 'templates',
          filter: {
            guid: '$params.guid'
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
    console.log(
      "Completed registration of uservault script 'updateMyTemplatesScriptSetter'"
    );
  }

  static async getFollowingScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'getFollowingScriptSetter'...");
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
    console.log(
      "Completed registration of uservault script 'getFollowingScriptSetter'"
    );
  }

  static async getBasicProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getBasicProfileScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'getBasicProfileScriptSetter'"
    );
  }

  static async updateBasicProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateBasicProfileScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'updateBasicProfileScriptSetter'"
    );
  }

  static async getTeamProfileScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'getTeamProfileScriptSetter'...");
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
    console.log(
      "Completed registration of uservault script 'getTeamProfileScriptSetter'"
    );
  }

  static async updateTeamProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateTeamProfileScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'updateTeamProfileScriptSetter'"
    );
  }

  static async removeTeamItemScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'removeTeamItemScriptSetter'...");
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
    console.log(
      "Completed registration of uservault script 'removeTeamItemScriptSetter'"
    );
  }

  static async getThesisProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getThesisProfileScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'getThesisProfileScriptSetter'"
    );
  }

  static async updateThesisProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateThesisProfileScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'updateThesisProfileScriptSetter'"
    );
  }

  static async removeThesisProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'removeThesisProfileScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'removeThesisProfileScriptSetter'"
    );
  }

  static async getPaperProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getPaperProfileScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'getPaperProfileScriptSetter'"
    );
  }

  static async updatePaperProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updatePaperProfileScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'updatePaperProfileScriptSetter'"
    );
  }

  static async removePaperItemScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'removePaperItemScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'removePaperItemScriptSetter'"
    );
  }

  static async getLicenseProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getLicenseProfileScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'getLicenseProfileScriptSetter'"
    );
  }
  static async updateLicenseProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateLicenseProfileScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'updateLicenseProfileScriptSetter'"
    );
  }

  static async removeLicenseItemScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'removeLicenseItemScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'removeLicenseItemScriptSetter'"
    );
  }

  static async getCertificationProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getCertificationProfileScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'getCertificationProfileScriptSetter'"
    );
  }

  static async updateCertificationProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateCertificationProfileScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'updateCertificationProfileScriptSetter'"
    );
  }

  static async removeCertificationItemScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'removeCertificationItemScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'removeCertificationItemScriptSetter'"
    );
  }

  static async getGameExpProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getGameExpProfileScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'getGameExpProfileScriptSetter'"
    );
  }

  static async updateGameExpProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateGameExpProfileScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'updateGameExpProfileScriptSetter'"
    );
  }

  static async removeGameExpItemScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'removeGameExpItemScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'removeGameExpItemScriptSetter'"
    );
  }
  static async getEducationProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getEducationProfileScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'getEducationProfileScriptSetter'"
    );
  }

  static async updateEducationProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateEducationProfileScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'updateEducationProfileScriptSetter'"
    );
  }

  static async removeEducationItemScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'removeEducationItemScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'removeEducationItemScriptSetter'"
    );
  }

  static async getExperienceProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getExperienceProfileScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'getExperienceProfileScriptSetter'"
    );
  }

  static async updateExperienceProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateExperienceProfileScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'updateExperienceProfileScriptSetter'"
    );
  }

  static async removeExperienceItemScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'removeExperienceItemScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'removeExperienceItemScriptSetter'"
    );
  }

  static async getActivityScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'getActivityScriptSetter'...");
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
    console.log(
      "Completed registration of uservault script 'getActivityScriptSetter'"
    );
  }

  static async addActivityScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'addActivityScriptSetter'...");
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
    console.log(
      "Completed registration of uservault script 'addActivityScriptSetter'"
    );
  }

  static async updateActivityScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'updateActivityScriptSetter'...");
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
    console.log(
      "Completed registration of uservault script 'updateActivityScriptSetter'"
    );
  }

  static async addVerifiableCredentialScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'addVerifiableCredentialScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'addVerifiableCredentialScriptSetter'"
    );
  }

  static async removeVerifiableCredentialScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'removeVerifiableCredentialScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'removeVerifiableCredentialScriptSetter'"
    );
  }

  static async getVerifiableCredentialScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getVerifiableCredentialScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'getVerifiableCredentialScriptSetter'"
    );
  }

  static async getAllSpacesScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'getAllSpacesScriptSetter'...");
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
    console.log(
      "Completed registration of uservault script 'getAllSpacesScriptSetter'"
    );
  }

  static async getSpacesByNamesScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getSpacesByNamesScriptSetter'..."
    );
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
    console.log(
      "Completed registration of uservault script 'getSpacesByNamesScriptSetter'"
    );
  }

  static async getSpacesByIdsScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'getSpacesByIdsScriptSetter'...");
    await hiveClient.Scripting.SetScript({
      name: 'get_space_by_ids',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_space_by_ids',
        output: true,
        body: {
          collection: 'private_spaces',
          filter: {
            guid: { $in: '$params.guids' }
          }
        }
      }
    });
    console.log(
      "Completed registration of uservault script 'getSpacesByIdsScriptSetter'"
    );
  }

  static async addSpacesScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'addSpacesScriptSetter'...");
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
              publicFields: '$params.publicFields',
              socialLinks: '$parrams.socialLinks'
            }
          },
          options: {
            upsert: true,
            bypass_document_validation: false
          }
        }
      }
    });
    console.log(
      "Completed registration of uservault script 'addSpacesScriptSetter'"
    );
  }

  static async removeSpaceScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'removeSpaceScriptSetter'...");
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
    console.log(
      "Completed registration of uservault script 'removeSpaceScriptSetter'"
    );
  }

  static async SetScripts(hiveClient: HiveClient) {
    await Promise.all([
      this.setPublicTemplateScriptSetter(hiveClient),
      this.getPublicFieldsScriptSetter(hiveClient),
      this.getMyTemplatesScriptSetter(hiveClient),
      this.updateMyTemplatesScriptSetter(hiveClient),
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
      this.getSpacesByIdsScriptSetter(hiveClient),
      this.addSpacesScriptSetter(hiveClient),
      this.removeSpaceScriptSetter(hiveClient)
    ]);
  }

  static async Delete(hiveClient: HiveClient) {
    await hiveClient.Database.deleteCollection('templates');
    await hiveClient.Database.deleteCollection('public_fields');
    await hiveClient.Database.deleteCollection('following');
    await hiveClient.Database.deleteCollection('basic_profile');
    await hiveClient.Database.deleteCollection('education_profile');
    await hiveClient.Database.deleteCollection('experience_profile');
    await hiveClient.Database.deleteCollection('activities');
    await hiveClient.Database.deleteCollection('verifiable_credentials');
    await hiveClient.Database.deleteCollection('team_profile');
    await hiveClient.Database.deleteCollection('thesis_profile');
    await hiveClient.Database.deleteCollection('paper_profile');
    await hiveClient.Database.deleteCollection('license_profile');
    await hiveClient.Database.deleteCollection('certification_profile');
    await hiveClient.Database.deleteCollection('game_exp_profile');
    await hiveClient.Database.deleteCollection('private_spaces');
  }
}
