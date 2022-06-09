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

    let timeOutInMilliseconds = 2000;
    try {
      console.log('Creating all collections for the uservault');
      let results = await parallel({
        templates: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('templates')
            );
          }, timeOutInMilliseconds);
        },
        public_fields: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('public_fields')
            );
          }, timeOutInMilliseconds);
        },
        following: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('following')
            );
          }, timeOutInMilliseconds);
        },
        activities: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('activities')
            );
          }, timeOutInMilliseconds);
        },
        public_fibasic_profileelds: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('basic_profile')
            );
          }, timeOutInMilliseconds);
        },
        verifiable_credentials: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection(
                'verifiable_credentials'
              )
            );
          }, timeOutInMilliseconds);
        },
        education_profile: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('education_profile')
            );
          }, timeOutInMilliseconds);
        },
        experience_profile: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('experience_profile')
            );
          }, timeOutInMilliseconds);
        },
        team_profile: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('team_profile')
            );
          }, timeOutInMilliseconds);
        },
        thesis_profile: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('thesis_profile')
            );
          }, timeOutInMilliseconds);
        },
        paper_profile: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('paper_profile')
            );
          }, timeOutInMilliseconds);
        },
        license_profile: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('license_profile')
            );
          }, timeOutInMilliseconds);
        },
        certification_profile: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection(
                'certification_profile'
              )
            );
          }, timeOutInMilliseconds);
        },
        game_exp_profile: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('game_exp_profile')
            );
          }, timeOutInMilliseconds);
        },
        private_spaces: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('private_spaces')
            );
          }, timeOutInMilliseconds);
        },
        space_posts: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('space_posts')
            );
          }, timeOutInMilliseconds);
        },
        version_profile: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await hiveClient.Database.createCollection('version_profile')
            );
          }, timeOutInMilliseconds);
        }
      });
      for (let result in results) {
        if (result) {
          console.log(
            `Created collection '${result}': ${JSON.stringify(results[result])}`
          );
        } else {
          console.log(
            `Could not create collection '${result}': ${JSON.stringify(
              results[result]
            )}`
          );
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
          }, timeOutInMilliseconds);
        },
        updateMyTemplatesScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateMyTemplatesScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        setPublicFieldsScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.setPublicFieldsScriptSetter(hiveClient));
          }, timeOutInMilliseconds);
        },
        getPublicFieldsScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getPublicFieldsScriptSetter(hiveClient));
          }, timeOutInMilliseconds);
        },
        getFollowingScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getFollowingScriptSetter(hiveClient));
          }, timeOutInMilliseconds);
        },
        getActivityScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getActivityScriptSetter(hiveClient));
          }, timeOutInMilliseconds);
        },
        addActivityScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.addActivityScriptSetter(hiveClient));
          }, timeOutInMilliseconds);
        },
        updateActivityScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.updateActivityScriptSetter(hiveClient));
          }, timeOutInMilliseconds);
        },
        getBasicProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getBasicProfileScriptSetter(hiveClient));
          }, timeOutInMilliseconds);
        },
        updateBasicProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateBasicProfileScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        addVerifiableCredentialScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.addVerifiableCredentialScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        removeVerifiableCredentialScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.removeVerifiableCredentialScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        getVerifiableCredentialScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.getVerifiableCredentialScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        getEducationProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.getEducationProfileScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        updateEducationProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateEducationProfileScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        removeEducationItemScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.removeEducationItemScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },

        getExperienceProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.getExperienceProfileScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        updateExperienceProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateExperienceProfileScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        removeExperienceItemScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.removeExperienceItemScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        getTeamProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getTeamProfileScriptSetter(hiveClient));
          }, timeOutInMilliseconds);
        },
        updateTeamProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateTeamProfileScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        removeTeamItemScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.removeTeamItemScriptSetter(hiveClient));
          }, timeOutInMilliseconds);
        },
        getThesisProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getThesisProfileScriptSetter(hiveClient));
          }, timeOutInMilliseconds);
        },
        updateThesisProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateThesisProfileScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        removeThesisProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateMyTemplatesScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        getPaperProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getPaperProfileScriptSetter(hiveClient));
          }, timeOutInMilliseconds);
        },

        updatePaperProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updatePaperProfileScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        removePaperItemScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.removePaperItemScriptSetter(hiveClient));
          }, timeOutInMilliseconds);
        },
        getLicenseProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.getLicenseProfileScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        updateLicenseProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateLicenseProfileScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        removeLicenseItemScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.removeLicenseItemScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        getCertificationProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.getCertificationProfileScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        updateCertificationProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateCertificationProfileScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        removeCertificationItemScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.removeCertificationItemScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        getGameExpProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.getGameExpProfileScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        updateGameExpProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateGameExpProfileScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },

        removeGameExpItemScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.removeGameExpItemScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        getAllSpacesScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getAllSpacesScriptSetter(hiveClient));
          }, timeOutInMilliseconds);
        },
        getSpacesByNamesScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getSpacesByNamesScriptSetter(hiveClient));
          }, timeOutInMilliseconds);
        },
        getSpacesByIdsScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getSpacesByIdsScriptSetter(hiveClient));
          }, timeOutInMilliseconds);
        },
        addSpacesScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.addSpacesScriptSetter(hiveClient));
          }, timeOutInMilliseconds);
        },
        removeSpaceScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.removeSpaceScriptSetter(hiveClient));
          }, timeOutInMilliseconds);
        },
        getSpacePostScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.getSpacePostScriptSetter(hiveClient));
          }, timeOutInMilliseconds);
        },
        updateSpacePostScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.updateSpacePostScriptSetter(hiveClient));
          }, timeOutInMilliseconds);
        },
        removeSpacePost: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.removeSpacePost(hiveClient));
          }, timeOutInMilliseconds);
        },
        getVersionProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.getVersionProfileScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        updateVersionProfileScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(
              null,
              await this.updateVersionProfileScriptSetter(hiveClient)
            );
          }, timeOutInMilliseconds);
        },
        removeVersionScriptSetter: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.removeVersionScriptSetter(hiveClient));
          }, timeOutInMilliseconds);
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
          console.log(
            `Could not register script '${result}': ${JSON.stringify(
              results[result]
            )}`
          );
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
          collection: 'version_profile',
          options: {
            sort: { latestVersion: -1 },
            limit: '$params.limit',
            skip: '$params.skip'
          }
        }
      }
    });
  }

  static async updateVersionProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateVersionProfileScriptSetter'..."
    );
    return await hiveClient.Scripting.SetScript({
      name: 'add_version_profile',
      allowAnonymousUser: true,
      allowAnonymousApp: true,
      executable: {
        type: 'insert',
        name: 'add_version_profile',
        output: true,
        body: {
          collection: 'version_profile',
          document: {
            latestVersion: '$params.latestVersion',
            releaseNotes: '$params.releaseNotes',
            videoUpdateUrl: '$params.videoUpdateUrl'
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
            latestVersion: '$params.latestVersion'
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
