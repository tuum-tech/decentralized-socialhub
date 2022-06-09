import { HiveClient } from '@elastosfoundation/elastos-hive-js-sdk';
import parallel from 'async/parallel';

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
      console.log('Creating all collections for the uservault');
      let results = await parallel({
        templates: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('templates')
            );
          }, 2000);
        },
        public_fields: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('public_fields')
            );
          }, 2000);
        },
        following: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('following')
            );
          }, 2000);
        },
        activities: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('activities')
            );
          }, 2000);
        },
        public_fibasic_profileelds: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('basic_profile')
            );
          }, 2000);
        },
        verifiable_credentials: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection(
                'verifiable_credentials'
              )
            );
          }, 2000);
        },
        education_profile: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('education_profile')
            );
          }, 2000);
        },
        experience_profile: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('experience_profile')
            );
          }, 2000);
        },
        team_profile: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('team_profile')
            );
          }, 2000);
        },
        thesis_profile: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('thesis_profile')
            );
          }, 2000);
        },
        paper_profile: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('paper_profile')
            );
          }, 2000);
        },
        license_profile: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('license_profile')
            );
          }, 2000);
        },
        certification_profile: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection(
                'certification_profile'
              )
            );
          }, 2000);
        },
        game_exp_profile: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('game_exp_profile')
            );
          }, 2000);
        },
        private_spaces: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('private_spaces')
            );
          }, 2000);
        },
        space_posts: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('space_posts')
            );
          }, 2000);
        },
        version_profile: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('version_profile')
            );
          }, 2000);
        }
      });
      for (let result in results) {
        if (result) {
          console.log(`Created collection '${result}'`);
        } else {
          console.log(`Could not create collection '${result}'`);
        }
      }
    } catch (err) {
      console.log(`Error while creating collections for the uservault: ${err}`);
    } finally {
      console.log('Finished creating all collections for the uservault');
    }

    try {
      console.log('Registering all scripts for the uservault');
      let results = await parallel({
        getMyTemplatesScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getMyTemplatesScriptSetter(hiveClient));
          }, 2000);
        },
        updateMyTemplatesScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateMyTemplatesScriptSetter(hiveClient)
            );
          }, 2000);
        },
        setPublicFieldsScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.setPublicFieldsScriptSetter(hiveClient));
          }, 2000);
        },
        getPublicFieldsScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getPublicFieldsScriptSetter(hiveClient));
          }, 2000);
        },
        getFollowingScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getFollowingScriptSetter(hiveClient));
          }, 2000);
        },
        getActivityScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getActivityScriptSetter(hiveClient));
          }, 2000);
        },
        addActivityScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.addActivityScriptSetter(hiveClient));
          }, 2000);
        },
        updateActivityScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.updateActivityScriptSetter(hiveClient));
          }, 2000);
        },
        getBasicProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getBasicProfileScriptSetter(hiveClient));
          }, 2000);
        },
        updateBasicProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateBasicProfileScriptSetter(hiveClient)
            );
          }, 2000);
        },
        addVerifiableCredentialScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.addVerifiableCredentialScriptSetter(hiveClient)
            );
          }, 2000);
        },
        removeVerifiableCredentialScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.removeVerifiableCredentialScriptSetter(hiveClient)
            );
          }, 2000);
        },
        getVerifiableCredentialScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.getVerifiableCredentialScriptSetter(hiveClient)
            );
          }, 2000);
        },
        getEducationProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.getEducationProfileScriptSetter(hiveClient)
            );
          }, 2000);
        },
        updateEducationProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateEducationProfileScriptSetter(hiveClient)
            );
          }, 2000);
        },
        removeEducationItemScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.removeEducationItemScriptSetter(hiveClient)
            );
          }, 2000);
        },

        getExperienceProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.getExperienceProfileScriptSetter(hiveClient)
            );
          }, 2000);
        },
        updateExperienceProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateExperienceProfileScriptSetter(hiveClient)
            );
          }, 2000);
        },
        removeExperienceItemScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.removeExperienceItemScriptSetter(hiveClient)
            );
          }, 2000);
        },
        getTeamProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getTeamProfileScriptSetter(hiveClient));
          }, 2000);
        },
        updateTeamProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateTeamProfileScriptSetter(hiveClient)
            );
          }, 2000);
        },
        removeTeamItemScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.removeTeamItemScriptSetter(hiveClient));
          }, 2000);
        },
        getThesisProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getThesisProfileScriptSetter(hiveClient));
          }, 2000);
        },
        updateThesisProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateThesisProfileScriptSetter(hiveClient)
            );
          }, 2000);
        },
        removeThesisProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateMyTemplatesScriptSetter(hiveClient)
            );
          }, 2000);
        },
        getPaperProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getPaperProfileScriptSetter(hiveClient));
          }, 2000);
        },

        updatePaperProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updatePaperProfileScriptSetter(hiveClient)
            );
          }, 2000);
        },
        removePaperItemScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.removePaperItemScriptSetter(hiveClient));
          }, 2000);
        },
        getLicenseProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.getLicenseProfileScriptSetter(hiveClient)
            );
          }, 2000);
        },
        updateLicenseProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateLicenseProfileScriptSetter(hiveClient)
            );
          }, 2000);
        },
        removeLicenseItemScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.removeLicenseItemScriptSetter(hiveClient)
            );
          }, 2000);
        },
        getCertificationProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.getCertificationProfileScriptSetter(hiveClient)
            );
          }, 2000);
        },
        updateCertificationProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateCertificationProfileScriptSetter(hiveClient)
            );
          }, 2000);
        },
        removeCertificationItemScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.removeCertificationItemScriptSetter(hiveClient)
            );
          }, 2000);
        },
        getGameExpProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.getGameExpProfileScriptSetter(hiveClient)
            );
          }, 2000);
        },
        updateGameExpProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateGameExpProfileScriptSetter(hiveClient)
            );
          }, 2000);
        },

        removeGameExpItemScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.removeGameExpItemScriptSetter(hiveClient)
            );
          }, 2000);
        },
        getAllSpacesScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getAllSpacesScriptSetter(hiveClient));
          }, 2000);
        },
        getSpacesByNamesScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getSpacesByNamesScriptSetter(hiveClient));
          }, 2000);
        },
        getSpacesByIdsScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getSpacesByIdsScriptSetter(hiveClient));
          }, 2000);
        },
        addSpacesScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.addSpacesScriptSetter(hiveClient));
          }, 2000);
        },
        removeSpaceScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.removeSpaceScriptSetter(hiveClient));
          }, 2000);
        },
        getSpacePostScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getSpacePostScriptSetter(hiveClient));
          }, 2000);
        },
        updateSpacePostScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.updateSpacePostScriptSetter(hiveClient));
          }, 2000);
        },
        removeSpacePost: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.removeSpacePost(hiveClient));
          }, 2000);
        },
        getVersionProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.getVersionProfileScriptSetter(hiveClient)
            );
          }, 2000);
        },
        updateVersionProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateVersionProfileScriptSetter(hiveClient)
            );
          }, 2000);
        },
        removeVersionScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.removeVersionScriptSetter(hiveClient));
          }, 2000);
        }
      });
      for (let result in results) {
        if (result) {
          console.log(
            `Completed registeration of uservault script '${result}': ${JSON.stringify(
              results[result]
            )}`
          );
        } else {
          console.log(`Could not register script '${result}'`);
        }
      }
    } catch (err) {
      console.log(`Error while registering scripts for the uservault: ${err}`);
    } finally {
      console.log('Finished registering all scripts for the uservault');
    }
  }

  static async setPublicFieldsScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'setPublicFieldsScriptSetter'..."
    );
    // scripts for public fields of profile
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'getPublicFieldsScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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

  static async getMyTemplatesScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'getMyTemplatesScriptSetter'...");
    return await hiveClient.Scripting.SetScript({
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

  static async updateMyTemplatesScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateMyTemplatesScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
  }

  static async getFollowingScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'getFollowingScriptSetter'...");
    return await hiveClient.Scripting.SetScript({
      name: 'get_following',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_following',
        output: true,
        body: {
          collection: 'following',
          options: {
            limit: '$params.limit',
            skip: '$params.skip'
          }
        }
      }
    });
  }

  static async getBasicProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getBasicProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'updateBasicProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log("Registering uservault script 'getTeamProfileScriptSetter'...");
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'updateTeamProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log("Registering uservault script 'removeTeamItemScriptSetter'...");
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'getThesisProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'updateThesisProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'removeThesisProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'getPaperProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'updatePaperProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'removePaperItemScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'getLicenseProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'updateLicenseProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'removeLicenseItemScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'getCertificationProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'updateCertificationProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'removeCertificationItemScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'getGameExpProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'updateGameExpProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'removeGameExpItemScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'getEducationProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'updateEducationProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'removeEducationItemScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'getExperienceProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'updateExperienceProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'removeExperienceItemScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log("Registering uservault script 'getActivityScriptSetter'...");
    // activies
    return await hiveClient.Scripting.SetScript({
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
    console.log("Registering uservault script 'addActivityScriptSetter'...");
    return await hiveClient.Scripting.SetScript({
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
    console.log("Registering uservault script 'updateActivityScriptSetter'...");
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'addVerifiableCredentialScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'removeVerifiableCredentialScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'getVerifiableCredentialScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
    console.log("Registering uservault script 'getAllSpacesScriptSetter'...");
    return await hiveClient.Scripting.SetScript({
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
    console.log(
      "Registering uservault script 'getSpacesByNamesScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
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
            slug: { $in: '$params.names' }
          }
        }
      }
    });
  }

  static async getSpacesByIdsScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'getSpacesByIdsScriptSetter'...");
    return await hiveClient.Scripting.SetScript({
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
  }

  static async addSpacesScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'addSpacesScriptSetter'...");
    return await hiveClient.Scripting.SetScript({
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
              slug: '$params.slug',
              description: '$params.description',
              category: '$params.category',
              avatar: '$params.avatar',
              coverPhoto: '$params.coverPhoto',
              publicFields: '$params.publicFields',
              socialLinks: '$params.socialLinks',
              tags: '$params.tags'
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
    console.log("Registering uservault script 'removeSpaceScriptSetter'...");
    return await hiveClient.Scripting.SetScript({
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

  static async getSpacePostScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'getSpacePostScriptSetter'...");
    return await hiveClient.Scripting.SetScript({
      name: 'get_space_post',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_space_post',
        output: true,
        body: {
          collection: 'space_posts',
          filter: {
            guid: '$params.guid'
          }
        }
      }
    });
  }

  static async updateSpacePostScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateSpacePostScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
      name: 'update_space_post',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'update',
        name: 'update_space_post',
        body: {
          collection: 'space_posts',
          filter: {
            guid: '$params.guid'
          },
          update: {
            $set: {
              guid: '$params.guid',
              content: '$params.content',
              comments: '$params.comments'
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

  static async removeSpacePost(hiveClient: HiveClient) {
    console.log("Registering uservault script 'removeSpacePost'...");
    return await hiveClient.Scripting.SetScript({
      name: 'remove_space_post',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'delete',
        name: 'remove_space_post',
        body: {
          collection: 'space_posts',
          filter: {
            guid: '$params.guid'
          }
        }
      }
    });
  }

  static async getVersionProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getVersionProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
      name: 'get_version_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'find',
        name: 'get_version_profile',
        output: true,
        body: {
          collection: 'version_profile'
        }
      }
    });
  }

  static async updateVersionProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateVersionProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
      name: 'update_version_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'update',
        name: 'update_version_profile',
        body: {
          collection: 'version_profile',
          filter: {
            did: '$params.did'
          },
          update: {
            $set: {
              latestVersion: '$params.latestVersion',
              did: '$params.did'
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

  static async removeVersionScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'removeVersionScriptSetter'...");
    return await hiveClient.Scripting.SetScript({
      name: 'remove_version_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'delete',
        name: 'remove_version_profile',
        body: {
          collection: 'version_profile',
          filter: {
            did: '$params.did'
          }
        }
      }
    });
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
    await hiveClient.Database.deleteCollection('space_posts');
    await hiveClient.Database.deleteCollection('version_profile');
  }
}
