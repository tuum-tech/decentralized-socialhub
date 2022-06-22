import {
  DeleteExecutable,
  Executable,
  FindExecutable,
  InsertExecutable,
  UpdateExecutable,
  HiveClient
} from '@tuum-tech/hive-js-sdk/';
import parallel from 'async/parallel';

export class UserVaultScripts {
  static async Execute(hiveClient: HiveClient) {
    try {
      if (hiveClient && hiveClient.isConnected) {
        await hiveClient.VaultSubscription.subscribe();
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
        // setPublicFieldsScriptSetter: (callback: any) => {
        //   setTimeout(async () => {
        //     callback(null, await this.setPublicFieldsScriptSetter(hiveClient));
        //   }, timeOutInMilliseconds);
        // },
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
      hiveClient.Database.createCollection('private_spaces'),
      hiveClient.Database.createCollection('space_posts'),
      hiveClient.Database.createCollection('version_profile')
    ]);
  }

  static async setPublicTemplateScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'set_public_fields'...");
    // scripts for public fields of profile

    let executable = new UpdateExecutable(
      'set_public_fields',
      'public_fields',
      {
        did: '$params.did'
      },
      {
        $set: {
          fields: '$params.fields'
        }
      },
      {
        upsert: true,
        bypass_document_validation: false
      }
    );

    await hiveClient.Scripting.registerScript(
      'set_public_fields',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'set_public_fields'"
    );
  }

  static async getPublicFieldsScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getPublicFieldsScriptSetter'..."
    );
    let executable = new FindExecutable(
      'get_public_fields',
      'public_fields',
      null,
      null
    );
    (executable as Executable).setOutput(true);
    await hiveClient.Scripting.registerScript(
      'get_public_fields',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'getPublicFieldsScriptSetter'"
    );
  }

  static async getMyTemplatesScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'getMyTemplatesScriptSetter'...");

    let executable = new FindExecutable(
      'get_my_templates',
      'templates',
      null,
      null
    );
    await hiveClient.Scripting.registerScript(
      'get_my_templates',
      executable,
      undefined,
      true,
      true
    );

    console.log(
      "Completed registration of uservault script 'getMyTemplatesScriptSetter'"
    );
  }

  static async updateMyTemplatesScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateMyTemplatesScriptSetter'..."
    );
    let executable = new UpdateExecutable(
      'update_my_templates',
      'templates',
      { did: '$params.did' },
      { $set: { templates: '$params.templates' } },
      { upsert: true, bypass_document_validation: false }
    );
    await hiveClient.Scripting.registerScript(
      'update_my_templates',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'updateMyTemplatesScriptSetter'"
    );
  }

  static async getFollowingScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'getFollowingScriptSetter'...");
    let executable = new FindExecutable(
      'get_following',
      'following',
      null,
      null
    );
    (executable as Executable).setOutput(true);
    await hiveClient.Scripting.registerScript(
      'get_following',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'getFollowingScriptSetter'"
    );
  }

  static async getBasicProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getBasicProfileScriptSetter'..."
    );
    let executable = new FindExecutable(
      'get_basic_profile',
      'basic_profile',
      null,
      null
    );
    (executable as Executable).setOutput(true);
    await hiveClient.Scripting.registerScript(
      'get_basic_profile',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'getBasicProfileScriptSetter'"
    );
  }

  static async updateBasicProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateBasicProfileScriptSetter'..."
    );
    let executable = new UpdateExecutable(
      'update_basic_profile',
      'basic_profile',
      { did: '$params.did' },
      { $set: { about: '$params.about' } },
      { upsert: true, bypass_document_validation: false }
    );
    await hiveClient.Scripting.registerScript(
      'update_basic_profile',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'updateBasicProfileScriptSetter'"
    );
  }

  static async getTeamProfileScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'getTeamProfileScriptSetter'...");
    let executable = new FindExecutable(
      'get_team_profile',
      'team_profile',
      null,
      null
    );
    (executable as Executable).setOutput(true);
    await hiveClient.Scripting.registerScript(
      'get_team_profile',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'getTeamProfileScriptSetter'"
    );
  }

  static async updateTeamProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateTeamProfileScriptSetter'..."
    );
    let executable = new UpdateExecutable(
      'update_team_profile',
      'team_profile',
      { guid: '$params.guid' },
      {
        $set: {
          guid: '$params.guid',
          name: '$params.name',
          start: '$params.start',
          end: '$params.end',
          still: '$params.still',
          description: '$params.description'
        }
      },
      { upsert: true, bypass_document_validation: false }
    );
    await hiveClient.Scripting.registerScript(
      'update_team_profile',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'updateTeamProfileScriptSetter'"
    );
  }

  static async removeTeamItemScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'removeTeamItemScriptSetter'...");
    let executable = new DeleteExecutable('remove_team_item', 'team_profile', {
      guid: '$params.guid'
    });
    await hiveClient.Scripting.registerScript(
      'remove_team_item',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'removeTeamItemScriptSetter'"
    );
  }

  static async getThesisProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getThesisProfileScriptSetter'..."
    );
    let executable = new FindExecutable(
      'get_thesis_profile',
      'thesis_profile',
      null,
      null
    );
    (executable as Executable).setOutput(true);
    await hiveClient.Scripting.registerScript(
      'get_thesis_profile',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'getThesisProfileScriptSetter'"
    );
  }

  static async updateThesisProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateThesisProfileScriptSetter'..."
    );
    let executable = new UpdateExecutable(
      'update_thesis_profile',
      'thesis_profile',
      { guid: '$params.guid' },
      {
        $set: {
          guid: '$params.guid',
          title: '$params.title',
          publish: '$params.publish',
          still: '$params.still',
          description: '$params.description'
        }
      },
      { upsert: true, bypass_document_validation: false }
    );
    await hiveClient.Scripting.registerScript(
      'update_thesis_profile',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'updateThesisProfileScriptSetter'"
    );
  }

  static async removeThesisProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'removeThesisProfileScriptSetter'..."
    );
    let executable = new DeleteExecutable(
      'remove_thesis_item',
      'thesis_profile',
      { guid: '$params.guid' }
    );
    await hiveClient.Scripting.registerScript(
      'remove_thesis_item',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'removeThesisProfileScriptSetter'"
    );
  }

  static async getPaperProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getPaperProfileScriptSetter'..."
    );
    let executable = new FindExecutable(
      'get_paper_profile',
      'paper_profile',
      null,
      null
    );
    (executable as Executable).setOutput(true);
    await hiveClient.Scripting.registerScript(
      'get_paper_profile',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'getPaperProfileScriptSetter'"
    );
  }

  static async updatePaperProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updatePaperProfileScriptSetter'..."
    );
    let executable = new UpdateExecutable(
      'update_paper_profile',
      'paper_profile',
      { guid: '$params.guid' },
      {
        $set: {
          guid: '$params.guid',
          title: '$params.title',
          publish: '$params.publish',
          still: '$params.still',
          description: '$params.description'
        }
      },
      { upsert: true, bypass_document_validation: false }
    );
    await hiveClient.Scripting.registerScript(
      'update_paper_profile',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'updatePaperProfileScriptSetter'"
    );
  }

  static async removePaperItemScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'removePaperItemScriptSetter'..."
    );
    let executable = new DeleteExecutable(
      'remove_paper_item',
      'paper_profile',
      { guid: '$params.guid' }
    );
    await hiveClient.Scripting.registerScript(
      'remove_paper_item',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'removePaperItemScriptSetter'"
    );
  }

  static async getLicenseProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getLicenseProfileScriptSetter'..."
    );
    let executable = new FindExecutable(
      'get_license_profile',
      'license_profile',
      null,
      null
    );
    (executable as Executable).setOutput(true);
    await hiveClient.Scripting.registerScript(
      'get_license_profile',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'getLicenseProfileScriptSetter'"
    );
  }
  static async updateLicenseProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateLicenseProfileScriptSetter'..."
    );
    let executable = new UpdateExecutable(
      'update_license_profile',
      'license_profile',
      { guid: '$params.guid' },
      {
        $set: {
          guid: '$params.guid',
          title: '$params.title',
          acknowledger: '$params.acknowledger',
          awardDate: '$params.awardDate',
          description: '$params.description'
        }
      },
      { upsert: true, bypass_document_validation: false }
    );
    await hiveClient.Scripting.registerScript(
      'update_license_profile',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'updateLicenseProfileScriptSetter'"
    );
  }

  static async removeLicenseItemScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'removeLicenseItemScriptSetter'..."
    );
    let executable = new DeleteExecutable(
      'remove_license_item',
      'license_profile',
      { guid: '$params.guid' }
    );
    await hiveClient.Scripting.registerScript(
      'remove_license_item',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'removeLicenseItemScriptSetter'"
    );
  }

  static async getCertificationProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getCertificationProfileScriptSetter'..."
    );
    let executable = new FindExecutable(
      'get_certification_profile',
      'certification_profile',
      null,
      null
    );
    (executable as Executable).setOutput(true);
    await hiveClient.Scripting.registerScript(
      'get_certification_profile',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'getCertificationProfileScriptSetter'"
    );
  }

  static async updateCertificationProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateCertificationProfileScriptSetter'..."
    );
    let executable = new UpdateExecutable(
      'update_certification_profile',
      'certification_profile',
      { guid: '$params.guid' },
      {
        $set: {
          guid: '$params.guid',
          title: '$params.title',
          acknowledger: '$params.acknowledger',
          awardDate: '$params.awardDate',
          description: '$params.description'
        }
      },
      { upsert: true, bypass_document_validation: false }
    );
    await hiveClient.Scripting.registerScript(
      'update_certification_profile',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'updateCertificationProfileScriptSetter'"
    );
  }

  static async removeCertificationItemScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'removeCertificationItemScriptSetter'..."
    );
    let executable = new DeleteExecutable(
      'remove_certification_item',
      'certification_profile',
      { guid: '$params.guid' }
    );
    await hiveClient.Scripting.registerScript(
      'remove_certification_item',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'removeCertificationItemScriptSetter'"
    );
  }

  static async getGameExpProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getGameExpProfileScriptSetter'..."
    );
    let executable = new FindExecutable(
      'get_game_exp_profile',
      'game_exp_profile',
      null,
      null
    );
    (executable as Executable).setOutput(true);
    await hiveClient.Scripting.registerScript(
      'get_game_exp_profile',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'getGameExpProfileScriptSetter'"
    );
  }

  static async updateGameExpProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateGameExpProfileScriptSetter'..."
    );
    let executable = new UpdateExecutable(
      'update_game_exp_profile',
      'game_exp_profile',
      { guid: '$params.guid' },
      {
        $set: {
          guid: '$params.guid',
          name: '$params.name',
          like: '$params.like',
          description: '$params.description'
        }
      },
      { upsert: true, bypass_document_validation: false }
    );
    await hiveClient.Scripting.registerScript(
      'update_game_exp_profile',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'updateGameExpProfileScriptSetter'"
    );
  }

  static async removeGameExpItemScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'removeGameExpItemScriptSetter'..."
    );
    let executable = new DeleteExecutable(
      'remove_game_exp_item',
      'game_exp_profile',
      { guid: '$params.guid' }
    );
    await hiveClient.Scripting.registerScript(
      'remove_game_exp_item',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'removeGameExpItemScriptSetter'"
    );
  }

  static async getEducationProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getEducationProfileScriptSetter'..."
    );
    let executable = new FindExecutable(
      'get_education_profile',
      'education_profile',
      null,
      null
    );
    (executable as Executable).setOutput(true);
    await hiveClient.Scripting.registerScript(
      'get_education_profile',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'getEducationProfileScriptSetter'"
    );
  }

  static async updateEducationProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateEducationProfileScriptSetter'..."
    );
    let executable = new UpdateExecutable(
      'update_education_profile',
      'education_profile',
      { guid: '$params.guid' },
      {
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
      { upsert: true, bypass_document_validation: false }
    );
    await hiveClient.Scripting.registerScript(
      'update_education_profile',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'updateEducationProfileScriptSetter'"
    );
  }

  static async removeEducationItemScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'removeEducationItemScriptSetter'..."
    );
    let executable = new DeleteExecutable(
      'remove_education_item',
      'education_profile',
      { guid: '$params.guid' }
    );
    await hiveClient.Scripting.registerScript(
      'remove_education_item',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'removeEducationItemScriptSetter'"
    );
  }

  static async getExperienceProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getExperienceProfileScriptSetter'..."
    );
    let executable = new FindExecutable(
      'get_experience_profile',
      'experience_profile',
      null,
      null
    );
    (executable as Executable).setOutput(true);
    await hiveClient.Scripting.registerScript(
      'get_experience_profile',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'getExperienceProfileScriptSetter'"
    );
  }

  static async updateVersionProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateVersionProfileScriptSetter'..."
    );

    let executable = new InsertExecutable(
      'add_version_profile',
      'version_profile',
      {
        latestVersion: '$params.latestVersion',
        releaseNotes: '$params.releaseNotes',
        videoUpdateUrl: '$params.videoUpdateUrl'
      },
      {}
    );

    await hiveClient.Scripting.registerScript(
      'add_version_profile',
      executable,
      undefined,
      true,
      true
    );

    console.log(
      "Completed registration of uservault script 'updateVersionProfileScriptSetter'"
    );
  }

  static async removeVersionScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'removeVersionScriptSetter'...");

    let executable = new DeleteExecutable(
      'remove_version_profile',
      'version_profile',
      {
        did: '$params.did'
      }
    );
    await hiveClient.Scripting.registerScript(
      'remove_version_profile',
      executable,
      undefined,
      true,
      true
    );

    console.log(
      "Completed registration of uservault script 'removeVersionScriptSetter'"
    );
  }

  static async updateExperienceProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateExperienceProfileScriptSetter'..."
    );
    let executable = new UpdateExecutable(
      'update_experience_profile',
      'experience_profile',
      { guid: '$params.guid' },
      {
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
      { upsert: true, bypass_document_validation: false }
    );
    await hiveClient.Scripting.registerScript(
      'update_experience_profile',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'updateExperienceProfileScriptSetter'"
    );
  }

  static async removeExperienceItemScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'removeExperienceItemScriptSetter'..."
    );
    let executable = new DeleteExecutable(
      'remove_experience_item',
      'experience_profile',
      { guid: '$params.guid' }
    );
    await hiveClient.Scripting.registerScript(
      'remove_experience_item',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'removeExperienceItemScriptSetter'"
    );
  }

  static async getActivityScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'getActivityScriptSetter'...");
    let executable = new FindExecutable(
      'get_activity',
      'activities',
      null,
      null
    );
    (executable as Executable).setOutput(true);
    await hiveClient.Scripting.registerScript(
      'get_activity',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'getActivityScriptSetter'"
    );
  }

  static async addActivityScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'addActivityScriptSetter'...");
    let executable = new InsertExecutable(
      'add_activity',
      'activities',
      {
        guid: '$params.guid',
        did: '$params.did',
        message: '$params.message',
        read: '$params.read',
        createdAt: '$params.createdAt',
        updatedAt: '$params.updatedAt'
      },
      { bypass_document_validation: false, ordered: false }
    );
    await hiveClient.Scripting.registerScript(
      'add_activity',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'addActivityScriptSetter'"
    );
  }

  static async updateActivityScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'updateActivityScriptSetter'...");
    let executable = new UpdateExecutable(
      'update_activity',
      'activities',
      { guid: '$params.guid' },
      {
        $set: {
          read: '$params.read',
          updatedAt: '$params.updatedAt'
        }
      },
      { upsert: true, bypass_document_validation: false }
    );
    await hiveClient.Scripting.registerScript(
      'update_activity',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'updateActivityScriptSetter'"
    );
  }

  static async addVerifiableCredentialScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'addVerifiableCredentialScriptSetter'..."
    );
    let executable = new UpdateExecutable(
      'add_verifiablecredential',
      'verifiable_credentials',
      { id: '$params.id' },
      {
        $set: {
          id: '$params.id',
          vc: '$params.vc'
        }
      },
      { upsert: true, bypass_document_validation: false }
    );
    await hiveClient.Scripting.registerScript(
      'add_verifiablecredential',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'addVerifiableCredentialScriptSetter'"
    );
  }

  static async removeVerifiableCredentialScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'removeVerifiableCredentialScriptSetter'..."
    );
    let executable = new DeleteExecutable(
      'remove_verifiablecredential',
      'verifiable_credentials',
      { id: '$params.id' }
    );
    await hiveClient.Scripting.registerScript(
      'remove_verifiablecredential',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'removeVerifiableCredentialScriptSetter'"
    );
  }

  static async getVerifiableCredentialScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getVerifiableCredentialScriptSetter'..."
    );
    let executable = new FindExecutable(
      'get_verifiable_credentials',
      'verifiable_credentials',
      null,
      null
    );
    (executable as Executable).setOutput(true);
    await hiveClient.Scripting.registerScript(
      'get_verifiable_credentials',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'getVerifiableCredentialScriptSetter'"
    );
  }

  static async getAllSpacesScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'getAllSpacesScriptSetter'...");
    let executable = new FindExecutable(
      'get_all_spaces',
      'private_spaces',
      null,
      null
    );
    (executable as Executable).setOutput(true);
    await hiveClient.Scripting.registerScript(
      'get_all_spaces',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'getAllSpacesScriptSetter'"
    );
  }

  static async getSpacesByNamesScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getSpacesByNamesScriptSetter'..."
    );
    let executable = new FindExecutable(
      'get_space_by_names',
      'private_spaces',
      {
        slug: {
          $in: '$params.names'
        }
      },
      null
    );
    (executable as Executable).setOutput(true);
    await hiveClient.Scripting.registerScript(
      'get_space_by_names',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'getSpacesByNamesScriptSetter'"
    );
  }

  static async getSpacesByIdsScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'getSpacesByIdsScriptSetter'...");
    let executable = new FindExecutable(
      'get_space_by_ids',
      'private_spaces',
      { guid: { $in: '$params.guid' } },
      null
    );

    await hiveClient.Scripting.registerScript(
      'get_space_by_ids',
      executable,
      undefined,
      true,
      true
    );
  }
  static async addSpacesScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'addSpacesScriptSetter'...");

    let executable = new UpdateExecutable(
      'add_space',
      'private_spaces',
      {
        guid: '$params.guid'
      },
      {
        $set: {
          guid: '$params.guid',
          name: '$params.name',
          slug: '$params.slug',
          description: '$params.description',
          category: '$params.category',
          avatar: '$params.avatar',
          coverPhoto: '$params.coverPhoto',
          publicFields: '$params.publicFields',
          socialLinks: '$parrams.socialLinks',
          tags: '$param.tags'
        }
      },
      { upsert: true, bypass_document_validation: false }
    );

    await hiveClient.Scripting.registerScript(
      'add_space',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'addSpacesScriptSetter'"
    );
  }

  static async removeSpaceScriptSetter(hiveClient: HiveClient) {
    console.log("Registering uservault script 'removeSpaceScriptSetter'...");
    let executable = new DeleteExecutable('remove_space', 'private_spaces', {
      guid: '$params.guid'
    });
    await hiveClient.Scripting.registerScript(
      'remove_space',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'removeSpaceScriptSetter'"
    );
  }

  static async getSpacePostScriptSetter(hiveClient: HiveClient) {
    let executable = new FindExecutable(
      'get_space_post',
      'space_posts',
      { guid: '$params.guid' },
      null
    );

    await hiveClient.Scripting.registerScript(
      'get_space_post',
      executable,
      undefined,
      true,
      true
    );
  }

  static async updateSpacePostScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'updateSpacePostScriptSetter'..."
    );
    let executable = new UpdateExecutable(
      'update_space_post',
      'space_posts',
      { guid: '$params.guid' },
      {
        $set: {
          guid: '$params.guid',
          content: '$params.content',
          comments: '$params.comments'
        }
      },
      { upsert: true, bypass_document_validation: false }
    );
    await hiveClient.Scripting.registerScript(
      'update_space_post',
      executable,
      undefined,
      true,
      true
    );
    console.log(
      "Completed registration of uservault script 'updateSpacePostScriptSetter'"
    );
  }

  static async removeSpacePost(hiveClient: HiveClient) {
    console.log("Registering uservault script 'removeSpacePost'...");
    let executable = new DeleteExecutable('remove_space_post', 'space_posts', {
      guid: '$params.guid'
    });
    await hiveClient.Scripting.registerScript(
      'remove_space',
      executable,
      undefined,
      true,
      true
    );
    console.log("Completed registration of uservault script 'removeSpacePost'");
  }

  static async getVersionProfileScriptSetter(hiveClient: HiveClient) {
    console.log(
      "Registering uservault script 'getVersionProfileScriptSetter'..."
    );

    let executable = new FindExecutable(
      'get_version_profile',
      'version_profile',
      {},
      {
        sort: { latestVersion: -1 },
        limit: '$params.limit',
        skip: '$params.skip'
      }
    );
    console.log(
      "Completed registration of uservault script 'getVersionProfileScriptSetter'"
    );

    return await hiveClient.Scripting.registerScript(
      'get_version_profile',
      executable,
      undefined,
      true,
      true
    );
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
