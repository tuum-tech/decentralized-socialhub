import { HiveClient } from '@elastosfoundation/elastos-hive-js-sdk';
import parallel from 'async/parallel';

export class UserVaultScripts {
  static timeOutInMilliseconds: number = 200;
  static async Execute(hiveClient: HiveClient) {
    try {
      if (hiveClient && hiveClient.isConnected) {
        await hiveClient.Payment.CreateFreeVault();
      }
    } catch (e) {
      console.log(`Error while creating vault: ${e}`);
    }

    try {
      console.log('Setting up the uservault');
      let results = await parallel({
        templates: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.setupTemplates(hiveClient));
          }, this.timeOutInMilliseconds);
        },
        public_fields: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.setupPublicFields(hiveClient));
          }, this.timeOutInMilliseconds);
        },
        following: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.setupFollowing(hiveClient));
          }, this.timeOutInMilliseconds);
        },
        basic_profile: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.setupBasicProfile(hiveClient));
          }, this.timeOutInMilliseconds);
        },
        team_profile: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.setupTeamProfile(hiveClient));
          }, this.timeOutInMilliseconds);
        },
        thesis_profile: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.setupThesisProfile(hiveClient));
          }, this.timeOutInMilliseconds);
        },
        paper_profile: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.setupPaperProfile(hiveClient));
          }, this.timeOutInMilliseconds);
        },
        license_profile: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.setupLicenseProfile(hiveClient));
          }, this.timeOutInMilliseconds);
        },
        certification_profile: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.setupCertificationProfile(hiveClient));
          }, this.timeOutInMilliseconds);
        },
        game_exp_profile: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.setupGameExpProfile(hiveClient));
          }, this.timeOutInMilliseconds);
        },
        education_profile: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.setupEducationProfile(hiveClient));
          }, this.timeOutInMilliseconds);
        },
        experience_profile: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.setupExperienceProfile(hiveClient));
          }, this.timeOutInMilliseconds);
        },
        activities: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.setupActivity(hiveClient));
          }, this.timeOutInMilliseconds);
        },
        verifiable_credentials: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.setupVerifiableCredentials(hiveClient));
          }, this.timeOutInMilliseconds);
        },
        private_spaces: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.setupSpaces(hiveClient));
          }, this.timeOutInMilliseconds);
        },
        space_posts: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.setupSpacePosts(hiveClient));
          }, this.timeOutInMilliseconds);
        },
        version_profile: (callback: any) => {
          setTimeout(async () => {
            callback(null, await this.setupVersionProfile(hiveClient));
          }, this.timeOutInMilliseconds);
        }
      });
      for (let result in results) {
        if (result) {
          console.log(`Created collection '${result}'`);
          if (results[result].getScript)
            console.log(
              `Created getScript ${JSON.stringify(results[result].getScript)}`
            );
          if (results[result].addScript)
            console.log(
              `Created addScript ${JSON.stringify(results[result].addScript)}`
            );
          if (results[result].setScript)
            console.log(
              `Created setScript ${JSON.stringify(results[result].setScript)}`
            );
          if (results[result].removeScript)
            console.log(
              `Created removeScript ${JSON.stringify(
                results[result].removeScript
              )}`
            );
        } else {
          console.log(
            `Could not setup collection '${result}' and its scripts: ${JSON.stringify(
              results[result]
            )}`
          );
        }
      }
    } catch (err) {
      console.log(`Error while setting up the uservault: ${err}`);
    } finally {
      console.log('Finished setting up the uservault');
    }
  }

  static async setupTemplates(hiveClient: HiveClient) {
    const getMyTemplatesScriptSetter = async (hiveClient: HiveClient) => {
      console.log(
        "Registering uservault script 'getMyTemplatesScriptSetter'..."
      );
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
    };
    const updateMyTemplatesScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    let collection = await hiveClient.Database.createCollection('templates');
    await new Promise(f => setTimeout(f, this.timeOutInMilliseconds));
    let getScript = await getMyTemplatesScriptSetter(hiveClient);
    let setScript = await updateMyTemplatesScriptSetter(hiveClient);
    return {
      collection,
      getScript,
      setScript
    };
  }

  static async setupPublicFields(hiveClient: HiveClient) {
    const getPublicFieldsScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const setPublicFieldsScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    let collection = await hiveClient.Database.createCollection(
      'public_fields'
    );
    await new Promise(f => setTimeout(f, this.timeOutInMilliseconds));
    let getScript = await getPublicFieldsScriptSetter(hiveClient);
    let setScript = await setPublicFieldsScriptSetter(hiveClient);
    return {
      collection,
      getScript,
      setScript
    };
  }

  static async setupFollowing(hiveClient: HiveClient) {
    const getFollowingScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    let collection = await hiveClient.Database.createCollection('following');
    await new Promise(f => setTimeout(f, this.timeOutInMilliseconds));
    let getScript = await getFollowingScriptSetter(hiveClient);
    return {
      collection,
      getScript
    };
  }

  static async setupBasicProfile(hiveClient: HiveClient) {
    const getBasicProfileScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const updateBasicProfileScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    let collection = await hiveClient.Database.createCollection(
      'basic_profile'
    );
    await new Promise(f => setTimeout(f, this.timeOutInMilliseconds));
    let getScript = await getBasicProfileScriptSetter(hiveClient);
    let setScript = await updateBasicProfileScriptSetter(hiveClient);
    return {
      collection,
      getScript,
      setScript
    };
  }

  static async setupTeamProfile(hiveClient: HiveClient) {
    const getTeamProfileScriptSetter = async (hiveClient: HiveClient) => {
      console.log(
        "Registering uservault script 'getTeamProfileScriptSetter'..."
      );
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
    };
    const updateTeamProfileScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const removeTeamItemScriptSetter = async (hiveClient: HiveClient) => {
      console.log(
        "Registering uservault script 'removeTeamItemScriptSetter'..."
      );
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
    };
    let collection = await hiveClient.Database.createCollection('team_profile');
    await new Promise(f => setTimeout(f, this.timeOutInMilliseconds));
    let getScript = await getTeamProfileScriptSetter(hiveClient);
    let setScript = await updateTeamProfileScriptSetter(hiveClient);
    let removeScript = await removeTeamItemScriptSetter(hiveClient);
    return {
      collection,
      getScript,
      setScript,
      removeScript
    };
  }

  static async setupThesisProfile(hiveClient: HiveClient) {
    const getThesisProfileScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const updateThesisProfileScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const removeThesisProfileScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    let collection = await hiveClient.Database.createCollection(
      'thesis_profile'
    );
    await new Promise(f => setTimeout(f, this.timeOutInMilliseconds));
    let getScript = await getThesisProfileScriptSetter(hiveClient);
    let setScript = await updateThesisProfileScriptSetter(hiveClient);
    let removeScript = await removeThesisProfileScriptSetter(hiveClient);
    return {
      collection,
      getScript,
      setScript,
      removeScript
    };
  }

  static async setupPaperProfile(hiveClient: HiveClient) {
    const getPaperProfileScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const updatePaperProfileScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const removePaperItemScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    let collection = await hiveClient.Database.createCollection(
      'paper_profile'
    );
    await new Promise(f => setTimeout(f, this.timeOutInMilliseconds));
    let getScript = await getPaperProfileScriptSetter(hiveClient);
    let setScript = await updatePaperProfileScriptSetter(hiveClient);
    let removeScript = await removePaperItemScriptSetter(hiveClient);
    return {
      collection,
      getScript,
      setScript,
      removeScript
    };
  }

  static async setupLicenseProfile(hiveClient: HiveClient) {
    const getLicenseProfileScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const updateLicenseProfileScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const removeLicenseItemScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    let collection = await hiveClient.Database.createCollection(
      'license_profile'
    );
    await new Promise(f => setTimeout(f, this.timeOutInMilliseconds));
    let getScript = await getLicenseProfileScriptSetter(hiveClient);
    let setScript = await updateLicenseProfileScriptSetter(hiveClient);
    let removeScript = await removeLicenseItemScriptSetter(hiveClient);
    return {
      collection,
      getScript,
      setScript,
      removeScript
    };
  }

  static async setupCertificationProfile(hiveClient: HiveClient) {
    const getCertificationProfileScriptSetter = async (
      hiveClient: HiveClient
    ) => {
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
    };
    const updateCertificationProfileScriptSetter = async (
      hiveClient: HiveClient
    ) => {
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
    };
    const removeCertificationItemScriptSetter = async (
      hiveClient: HiveClient
    ) => {
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
    };
    let collection = await hiveClient.Database.createCollection(
      'certification_profile'
    );
    await new Promise(f => setTimeout(f, this.timeOutInMilliseconds));
    let getScript = await getCertificationProfileScriptSetter(hiveClient);
    let setScript = await updateCertificationProfileScriptSetter(hiveClient);
    let removeScript = await removeCertificationItemScriptSetter(hiveClient);
    return {
      collection,
      getScript,
      setScript,
      removeScript
    };
  }

  static async setupGameExpProfile(hiveClient: HiveClient) {
    const getGameExpProfileScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const updateGameExpProfileScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const removeGameExpItemScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    let collection = await hiveClient.Database.createCollection(
      'game_exp_profile'
    );
    await new Promise(f => setTimeout(f, this.timeOutInMilliseconds));
    let getScript = await getGameExpProfileScriptSetter(hiveClient);
    let setScript = await updateGameExpProfileScriptSetter(hiveClient);
    let removeScript = await removeGameExpItemScriptSetter(hiveClient);
    return {
      collection,
      getScript,
      setScript,
      removeScript
    };
  }

  static async setupEducationProfile(hiveClient: HiveClient) {
    const getEducationProfileScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const updateEducationProfileScriptSetter = async (
      hiveClient: HiveClient
    ) => {
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
    };
    const removeEducationItemScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    let collection = await hiveClient.Database.createCollection(
      'education_profile'
    );
    await new Promise(f => setTimeout(f, this.timeOutInMilliseconds));
    let getScript = await getEducationProfileScriptSetter(hiveClient);
    let setScript = await updateEducationProfileScriptSetter(hiveClient);
    let removeScript = await removeEducationItemScriptSetter(hiveClient);
    return {
      collection,
      getScript,
      setScript,
      removeScript
    };
  }

  static async setupExperienceProfile(hiveClient: HiveClient) {
    const getExperienceProfileScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const updateExperienceProfileScriptSetter = async (
      hiveClient: HiveClient
    ) => {
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
    };
    const removeExperienceItemScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    let collection = await hiveClient.Database.createCollection(
      'experience_profile'
    );
    await new Promise(f => setTimeout(f, this.timeOutInMilliseconds));
    let getScript = await getExperienceProfileScriptSetter(hiveClient);
    let setScript = await updateExperienceProfileScriptSetter(hiveClient);
    let removeScript = await removeExperienceItemScriptSetter(hiveClient);
    return {
      collection,
      getScript,
      setScript,
      removeScript
    };
  }

  static async setupActivity(hiveClient: HiveClient) {
    const getActivityScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const addActivityScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const updateActivityScriptSetter = async (hiveClient: HiveClient) => {
      console.log(
        "Registering uservault script 'updateActivityScriptSetter'..."
      );
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
    };
    let collection = await hiveClient.Database.createCollection('activities');
    await new Promise(f => setTimeout(f, this.timeOutInMilliseconds));
    let getScript = await getActivityScriptSetter(hiveClient);
    let addScript = await addActivityScriptSetter(hiveClient);
    let setScript = await updateActivityScriptSetter(hiveClient);
    return {
      collection,
      getScript,
      addScript,
      setScript
    };
  }

  static async setupVerifiableCredentials(hiveClient: HiveClient) {
    const getVerifiableCredentialScriptSetter = async (
      hiveClient: HiveClient
    ) => {
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
    };
    const addVerifiableCredentialScriptSetter = async (
      hiveClient: HiveClient
    ) => {
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
    };
    const removeVerifiableCredentialScriptSetter = async (
      hiveClient: HiveClient
    ) => {
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
    };

    let collection = await hiveClient.Database.createCollection(
      'verifiable_credentials'
    );
    await new Promise(f => setTimeout(f, this.timeOutInMilliseconds));
    let getScript = await getVerifiableCredentialScriptSetter(hiveClient);
    let addScript = await addVerifiableCredentialScriptSetter(hiveClient);
    let removeScript = await removeVerifiableCredentialScriptSetter(hiveClient);
    return {
      collection,
      getScript,
      addScript,
      removeScript
    };
  }

  static async setupSpaces(hiveClient: HiveClient) {
    const getAllSpacesScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const getSpacesByNamesScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const getSpacesByIdsScriptSetter = async (hiveClient: HiveClient) => {
      console.log(
        "Registering uservault script 'getSpacesByIdsScriptSetter'..."
      );
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
    };
    const addSpacesScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const removeSpaceScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    let collection = await hiveClient.Database.createCollection(
      'private_spaces'
    );
    await new Promise(f => setTimeout(f, this.timeOutInMilliseconds));
    let getScript = {
      getAll: await getAllSpacesScriptSetter(hiveClient),
      getByName: await getSpacesByNamesScriptSetter(hiveClient),
      getById: await getSpacesByIdsScriptSetter(hiveClient)
    };
    let addScript = await addSpacesScriptSetter(hiveClient);
    let removeScript = await removeSpaceScriptSetter(hiveClient);
    return {
      collection,
      getScript,
      addScript,
      removeScript
    };
  }

  static async setupSpacePosts(hiveClient: HiveClient) {
    const getSpacePostScriptSetter = async (hiveClient: HiveClient) => {
      console.log("Registering uservault script 'getSpacePostScriptSetter'...");
      return await hiveClient.Scripting.SetScript({
        name: 'get_space_posts',
        allowAnonymousUser: true,
        allowAnonymousApp: true,
        executable: {
          type: 'find',
          name: 'get_space_posts',
          output: true,
          body: {
            collection: 'space_posts',
            filter: {
              guid: { $in: '$params.guids' }
            }
          }
        }
      });
    };
    const updateSpacePostScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const removeSpacePost = async (hiveClient: HiveClient) => {
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
    };

    let collection = await hiveClient.Database.createCollection('space_posts');
    await new Promise(f => setTimeout(f, this.timeOutInMilliseconds));
    let getScript = await getSpacePostScriptSetter(hiveClient);
    let setScript = await updateSpacePostScriptSetter(hiveClient);
    let removeScript = await removeSpacePost(hiveClient);
    return {
      collection,
      getScript,
      setScript,
      removeScript
    };
  }

  static async setupVersionProfile(hiveClient: HiveClient) {
    const getVersionProfileScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const updateVersionProfileScriptSetter = async (hiveClient: HiveClient) => {
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
    };
    const removeVersionScriptSetter = async (hiveClient: HiveClient) => {
      console.log(
        "Registering uservault script 'removeVersionScriptSetter'..."
      );
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
    };

    let collection = await hiveClient.Database.createCollection(
      'version_profile'
    );
    await new Promise(f => setTimeout(f, this.timeOutInMilliseconds));
    let getScript = await getVersionProfileScriptSetter(hiveClient);
    let setScript = await updateVersionProfileScriptSetter(hiveClient);
    let removeScript = await removeVersionScriptSetter(hiveClient);
    return {
      collection,
      getScript,
      setScript,
      removeScript
    };
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
