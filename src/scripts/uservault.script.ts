import {
  DeleteExecutable,
  Executable,
  FindExecutable,
  InsertExecutable,
  UpdateExecutable
} from '@elastosfoundation/hive-js-sdk/';
import { HiveClient } from 'src/shared-base/api/hiveclient';

export class UserVaultScripts {
  static async Execute(hiveClient: HiveClient) {
    try {
      await Promise.all([
        this.CreateCollections(hiveClient),
        this.SetScripts(hiveClient)
      ]);
      console.log('uservaultscripts registered');
    } catch (e) {
      console.log(`Error: ${e}`);
    }
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
    let executable = new UpdateExecutable(
      'set_public_fields',
      'public_fields',
      { did: '$params.did' },
      { $set: { fields: '$params.fields' } },
      { upsert: true, bypass_document_validation: false }
    );
    // scripts for public fields of profile
    await hiveClient.Scripting.registerScript(
      'set_public_fields',
      executable,
      undefined,
      true,
      true
    );
  }

  static async getPublicFieldsScriptSetter(hiveClient: HiveClient) {
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
  }

  static async updateMyTemplatesScriptSet(hiveClient: HiveClient) {
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
  }

  static async getMyTemplatesScriptSet(hiveClient: HiveClient) {
    let executable = new FindExecutable(
      'get_my_templates',
      'templates',
      null,
      null
    );
    (executable as Executable).setOutput(true);
    await hiveClient.Scripting.registerScript(
      'get_my_templates',
      executable,
      undefined,
      true,
      true
    );
  }

  static async getFollowingScriptSetter(hiveClient: HiveClient) {
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
  }

  static async getBasicProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async updateBasicProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async getTeamProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async updateTeamProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async removeTeamItemScriptSetter(hiveClient: HiveClient) {
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
  }

  static async getThesisProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async updateThesisProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async removeThesisProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async getPaperProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async updatePaperProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async removePaperItemScriptSetter(hiveClient: HiveClient) {
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
  }

  static async getLicenseProfileScriptSetter(hiveClient: HiveClient) {
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
  }
  static async updateLicenseProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async removeLicenseItemScriptSetter(hiveClient: HiveClient) {
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
  }

  static async getCertificationProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async updateCertificationProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async removeCertificationItemScriptSetter(hiveClient: HiveClient) {
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
  }

  static async getGameExpProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async updateGameExpProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async removeGameExpItemScriptSetter(hiveClient: HiveClient) {
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
  }
  static async getEducationProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async updateEducationProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async removeEducationItemScriptSetter(hiveClient: HiveClient) {
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
  }

  static async getExperienceProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async updateExperienceProfileScriptSetter(hiveClient: HiveClient) {
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
  }

  static async removeExperienceItemScriptSetter(hiveClient: HiveClient) {
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
  }

  static async getActivityScriptSetter(hiveClient: HiveClient) {
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
  }

  static async addActivityScriptSetter(hiveClient: HiveClient) {
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
  }

  static async updateActivityScriptSetter(hiveClient: HiveClient) {
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
  }

  static async addVerifiableCredentialScriptSetter(hiveClient: HiveClient) {
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
  }

  static async removeVerifiableCredentialScriptSetter(hiveClient: HiveClient) {
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
  }

  static async getVerifiableCredentialScriptSetter(hiveClient: HiveClient) {
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
  }

  static async getAllSpacesScriptSetter(hiveClient: HiveClient) {
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
  }

  static async getSpacesByNamesScriptSetter(hiveClient: HiveClient) {
    let executable = new FindExecutable(
      'get_space_by_names',
      'private_spaces',
      {
        name: {
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
  }

  static async getSpacesByIdsScriptSetter(hiveClient: HiveClient) {
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
    let executable = new UpdateExecutable(
      'add_space',
      'private_spaces',
      { guid: '$params.guid' },
      {
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
      { upsert: true, bypass_document_validation: false }
    );
    await hiveClient.Scripting.registerScript(
      'add_space',
      executable,
      undefined,
      true,
      true
    );
  }

  static async removeSpaceScriptSetter(hiveClient: HiveClient) {
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
  }

  static async SetScripts(hiveClient: HiveClient) {
    // templates

    await Promise.all([
      this.getMyTemplatesScriptSet(hiveClient),
      this.updateMyTemplatesScriptSet(hiveClient),
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
      this.getSpacesByIdsScriptSetter(hiveClient),
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
