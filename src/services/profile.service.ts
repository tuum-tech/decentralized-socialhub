import { Guid } from 'guid-typescript';
import { IRunScriptResponse } from '@elastosfoundation/elastos-hive-js-sdk/dist/Services/Scripting.Service';
import { DIDDocument } from '@elastosfoundation/did-js-sdk/';
import { ActivityResponse } from 'src/pages/ActivityPage/types';
import { VerificationService } from 'src/services/verification.service';
import request, { BaseplateResp } from 'src/baseplate/request';

import { showNotify } from 'src/utils/notify';
import { getItemsFromData } from 'src/utils/script';

import { DidDocumentService } from './diddocument.service';
import { HiveService } from './hive.service';
import { UserService } from './user.service';
import { DidService } from './did.service.new';
import { SearchService } from './search.service';
import { DidcredsService, CredentialType } from './didcreds.service';

export class ProfileService {
  static didDocument: any = null;

  static getVerifiers = async (
    x: any,
    type: string,
    userSession: ISessionItem
  ) => {
    if (userSession.did === '') {
      return [];
    }
    if (ProfileService.didDocument === null) {
      ProfileService.didDocument = await ProfileService.getDidDocument(
        userSession
      );
    }

    const vService = new VerificationService();
    return await vService.getCredentialVerifiers(
      x,
      type,
      ProfileService.didDocument
    );
  };

  static getVerifierFromVc = async (vc: any) => {
    let verifier = {
      name: '',
      did: ''
    };
    if (!vc) return verifier;

    if (vc.issuer !== '') {
      const searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
      let verifiersRes: any = await searchServiceLocal.getUsersByDIDs(
        [vc.issuer],
        100,
        0
      );
      let verifiers = getItemsFromData(verifiersRes, 'get_users_by_dids');
      verifiers = verifiers.map((v: any) => {
        return {
          name: v.name,
          did: v.did
        };
      });
      if (verifiers.length > 0) {
        verifier = verifiers[0];
      }
    }

    return verifier;
  };

  static getDidDocument = async (
    userSession: ISessionItem
  ): Promise<DIDDocument> => {
    let document = await DidDocumentService.getUserDocument(userSession);
    return document;
  };

  static async getPublicFields(did: string): Promise<string[]> {
    let fields: string[] = [];
    let searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
    let userResponse = await searchServiceLocal.searchUsersByDIDs([did], 1, 0);

    if (
      !userResponse.isSuccess ||
      !userResponse.response ||
      !userResponse.response.get_users_by_dids ||
      userResponse.response.get_users_by_dids.items.length <= 0
    )
      return fields;

    const hiveInstance = await HiveService.getReadOnlyUserHiveClient(
      userResponse.response!.get_users_by_dids.items[0].hiveHost
    );

    if (hiveInstance) {
      const res: IRunScriptResponse<PublicProfileResponse> = await hiveInstance.Scripting.RunScript(
        {
          name: 'get_public_fields',
          context: {
            target_did: did,
            target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
          }
        }
      );

      fields =
        (getItemsFromData(res, 'get_public_fields')[0] || {}).fields || [];
    }
    return fields;
  }

  static async updatePublicFields(fields: string[], userSession: ISessionItem) {
    let userService = new UserService(await DidService.getInstance());
    const prevFields = await this.getPublicFields(userSession.did);
    // Is wallet removed
    if (prevFields.includes('wallet') && !fields.includes('wallet')) {
      await userService.updateSession({
        ...userSession,
        wallets: {}
      });
    }
    // Is wallet added
    if (!prevFields.includes('wallet') && fields.includes('wallet')) {
      let wallets: any = {};
      const key1 = CredentialType.EIDAddress.toLowerCase();
      const key2 = CredentialType.ESCAddress.toLowerCase();
      const key3 = CredentialType.ETHAddress.toLowerCase();
      const address1 = await DidcredsService.getCredentialValue(
        userSession,
        key1
      );
      const address2 = await DidcredsService.getCredentialValue(
        userSession,
        key2
      );
      const address3 = await DidcredsService.getCredentialValue(
        userSession,
        key3
      );
      if (address1) wallets[key1] = address1;
      if (address2) wallets[key2] = address2;
      if (address3) wallets[key3] = address3;
      await userService.updateSession({
        ...userSession,
        wallets
      });
    }
    const hiveInstance = await HiveService.getSessionInstance(userSession);
    if (userSession && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'set_public_fields',
        context: {
          target_did: userSession.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: { fields, did: userSession.did }
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Public profile fields are successfuly saved', 'success');
      }
    }
  }

  static async getFullProfile(
    did: string,
    userSession: ISessionItem
  ): Promise<ProfileDTO> {
    let nameCredential = {
      name: userSession.name,
      verifiers: [] as any[]
    };
    let emailCredential = {
      email: '',
      verifiers: [] as any[]
    };
    let basicDTO: any = {};
    let versionDTO: Version = {
      latestVersion: ''
    };
    let educationDTO: EducationDTO = {
      items: [],
      isEnabled: true
    };
    let experienceDTO: ExperienceDTO = {
      items: [],
      isEnabled: true
    };
    let teamDTO: TeamDTO = {
      items: [],
      isEnabled: true
    };
    let thesisDTO: ThesisDTO = {
      items: [],
      isEnabled: true
    };
    let paperDTO: PaperDTO = {
      items: [],
      isEnabled: true
    };
    let licenseDTO: LicenseDTO = {
      items: [],
      isEnabled: true
    };
    let certificationDTO: CertificationDTO = {
      items: [],
      isEnabled: true
    };
    let gameExpDTO: GameExpDTO = {
      items: [],
      isEnabled: true
    };
    let gamerTagDTO: GamerTagDTO = {
      items: [],
      isEnabled: true
    };
    let searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
    let userResponse = await searchServiceLocal.searchUsersByDIDs([did], 1, 0);
    if (
      userResponse.isSuccess &&
      userResponse.response &&
      userResponse.response.get_users_by_dids &&
      userResponse.response!.get_users_by_dids.items.length > 0
    ) {
      const hiveInstance = await HiveService.getReadOnlyUserHiveClient(
        userResponse.response!.get_users_by_dids.items[0].hiveHost
      );

      if (hiveInstance) {
        const versionRes: IRunScriptResponse<VersionProfileResponse> = await hiveInstance.Scripting.RunScript(
          {
            name: 'get_version_profile',
            context: {
              target_did: did,
              target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
            }
          }
        );
        const versionPData = getItemsFromData(
          versionRes,
          'get_version_profile'
        );
        versionDTO = versionPData[0];

        const bpRes: IRunScriptResponse<BasicProfileResponse> = await hiveInstance.Scripting.RunScript(
          {
            name: 'get_basic_profile',
            context: {
              target_did: did,
              target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
            }
          }
        );

        const gbPData = getItemsFromData(bpRes, 'get_basic_profile');
        if (gbPData.length > 0) {
          basicDTO = gbPData[0];
        }

        const tpRes: IRunScriptResponse<TeamProfileResponse> = await hiveInstance.Scripting.RunScript(
          {
            name: 'get_team_profile',
            context: {
              target_did: did,
              target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
            }
          }
        );
        teamDTO.items = getItemsFromData(tpRes, 'get_team_profile');

        const thpRes: IRunScriptResponse<ThesisProfileResponse> = await hiveInstance.Scripting.RunScript(
          {
            name: 'get_thesis_profile',
            context: {
              target_did: did,
              target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
            }
          }
        );
        thesisDTO.items = getItemsFromData(thpRes, 'get_thesis_profile');

        const p2Res: IRunScriptResponse<PaperProfileResponse> = await hiveInstance.Scripting.RunScript(
          {
            name: 'get_paper_profile',
            context: {
              target_did: did,
              target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
            }
          }
        );
        thesisDTO.items = getItemsFromData(p2Res, 'get_paper_profile');

        const lpRes: IRunScriptResponse<LicenseProfileResponse> = await hiveInstance.Scripting.RunScript(
          {
            name: 'get_license_profile',
            context: {
              target_did: did,
              target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
            }
          }
        );
        licenseDTO.items = getItemsFromData(lpRes, 'get_license_profile');

        const cpRes: IRunScriptResponse<CertificationProfileResponse> = await hiveInstance.Scripting.RunScript(
          {
            name: 'get_certification_profile',
            context: {
              target_did: did,
              target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
            }
          }
        );
        certificationDTO.items = getItemsFromData(
          cpRes,
          'get_certification_profile'
        );

        const gexpRes: IRunScriptResponse<GameExpProfileResponse> = await hiveInstance.Scripting.RunScript(
          {
            name: 'get_game_exp_profile',
            context: {
              target_did: did,
              target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
            }
          }
        );
        gameExpDTO.items = getItemsFromData(gexpRes, 'get_game_exp_profile');

        const edRes: IRunScriptResponse<EducationProfileResponse> = await hiveInstance.Scripting.RunScript(
          {
            name: 'get_education_profile',
            context: {
              target_did: did,
              target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
            }
          }
        );

        const epRes: IRunScriptResponse<ExperienceProfileResponse> = await hiveInstance.Scripting.RunScript(
          {
            name: 'get_experience_profile',
            context: {
              target_did: did,
              target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
            }
          }
        );
        let educationItems: EducationItem[] = getItemsFromData(
          edRes,
          'get_education_profile'
        );
        let experienceItems: ExperienceItem[] = getItemsFromData(
          epRes,
          'get_experience_profile'
        );

        /* Calculate verified education credentials starts */
        for (let educationItem of educationItems) {
          let edItem: EducationItem = JSON.parse(JSON.stringify(educationItem));
          edItem.verifiers = await ProfileService.getVerifiers(
            educationItem,
            'education',
            userSession
          );
          if (
            edItem.verifiers &&
            edItem.verifiers.length > 0 &&
            edItem.verifiers[0].did !== userSession.did
          ) {
            educationDTO.items.push(edItem);
          } else {
            educationDTO.items.push(educationItem);
          }
        }
        /* Calculate verified education credentials ends */

        /* Calculate verified experience credentials starts */
        for (let experienceItem of experienceItems) {
          let exItem: ExperienceItem = JSON.parse(
            JSON.stringify(experienceItem)
          );
          exItem.verifiers = await ProfileService.getVerifiers(
            experienceItem,
            'experience',
            userSession
          );
          if (
            exItem.verifiers &&
            exItem.verifiers.length > 0 &&
            exItem.verifiers[0].did !== userSession.did
          ) {
            experienceDTO.items.push(exItem);
          } else {
            experienceDTO.items.push(experienceItem);
          }
        }
        /* Calculate verified experience credentials ends */

        const allVcsRes: IRunScriptResponse<BasicProfileResponse> = await hiveInstance.Scripting.RunScript(
          {
            name: 'get_verifiable_credentials',
            context: {
              target_did: did,
              target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
            }
          }
        );
        let allVcsItems: [] = getItemsFromData(
          allVcsRes,
          'get_verifiable_credentials'
        );
        for (let vcItem of allVcsItems) {
          const item: any = JSON.parse(JSON.stringify(vcItem));

          const vc = item.vc;
          for (let s in vc.credentialSubject) {
            const verifier = await ProfileService.getVerifierFromVc(vc);
            if (s === 'name' && verifier.did !== userSession.did) {
              nameCredential.verifiers = [verifier];
            } else if (
              s === 'email' &&
              userSession.loginCred?.email &&
              verifier.did !== userSession.did
            ) {
              emailCredential.email = userSession.loginCred.email;
              emailCredential.verifiers = [verifier];
            }
          }
        }
      }
    }

    return {
      name: nameCredential,
      email: emailCredential,
      basicDTO,
      educationDTO,
      experienceDTO,
      teamDTO,
      thesisDTO,
      paperDTO,
      licenseDTO,
      certificationDTO,
      gameExpDTO,
      gamerTagDTO,
      versionDTO
    };
  }

  static async updateAbout(basicDTO: BasicDTO, session: ISessionItem) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'update_basic_profile',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: basicDTO
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('About info is successfuly saved', 'success');
      }
    }
  }

  static async updateVersion(latestVersion: string, session: ISessionItem) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'update_version_profile',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: {
          latestVersion,
          did: session.did
        }
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Updated to latest version', 'success');
      } else {
        showNotify('Error executing script', 'error');
      }
    }
  }

  static async updateExperienceProfile(
    experienceItem: ExperienceItem,
    session: ISessionItem,
    archivedBadge: boolean
  ): Promise<boolean> {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'update_experience_profile',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: experienceItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Experience info is successfuly saved', 'success');
        if (!archivedBadge) {
          await ProfileService.addActivity(
            {
              guid: '',
              did: session.did,
              message: 'You received a Experience profile badge',
              read: false,
              createdAt: 0,
              updatedAt: 0
            },

            session
          );
        }
        await ProfileService.addActivity(
          {
            guid: '',
            did: session!.did,
            message: 'You updated experience profile',
            read: false,
            createdAt: 0,
            updatedAt: 0
          },

          session
        );
      } else {
        showNotify('Error executing script', 'error');
        return false;
      }
    }
    return true;
  }

  static async updateEducationProfile(
    educationItem: EducationItem,
    session: ISessionItem,
    archivedBadge: boolean
  ): Promise<boolean> {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'update_education_profile',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: educationItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Education info is successfuly saved', 'success');
        if (!archivedBadge) {
          await this.addActivity(
            {
              guid: '',
              did: session.did,
              message: 'You received a Education profile badge',
              read: false,
              createdAt: 0,
              updatedAt: 0
            },
            session
          );
        }
        await this.addActivity(
          {
            guid: '',
            did: session!.did,
            message: 'You updated education profile',
            read: false,
            createdAt: 0,
            updatedAt: 0
          },
          session
        );
      } else {
        showNotify('Error executing script', 'error');
        return false;
      }
    }
    return true;
  }

  static async updateTeamProfile(teamItem: TeamItem, session: ISessionItem) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'update_team_profile',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: teamItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Team profile is successfuly saved', 'success');
        await this.addActivity(
          {
            guid: '',
            did: session!.did,
            message: 'You updated team profile',
            read: false,
            createdAt: 0,
            updatedAt: 0
          },
          session
        );
      }
    }
  }

  static async updateThesisProfile(
    thesisItem: ThesisItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'update_thesis_profile',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: thesisItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Thesis profile is successfuly saved', 'success');
        await this.addActivity(
          {
            guid: '',
            did: session!.did,
            message: 'You updated thesis profile',
            read: false,
            createdAt: 0,
            updatedAt: 0
          },
          session
        );
      }
    }
  }

  static async updatePaperProfile(paperItem: PaperItem, session: ISessionItem) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'update_paper_profile',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: paperItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Paper profile is successfuly saved', 'success');
        await this.addActivity(
          {
            guid: '',
            did: session!.did,
            message: 'You updated paper profile',
            read: false,
            createdAt: 0,
            updatedAt: 0
          },
          session
        );
      }
    }
  }

  static async updateLicenseProfile(
    licenseItem: LicenseItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'update_license_profile',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: licenseItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('License profile is successfuly saved', 'success');
        await this.addActivity(
          {
            guid: '',
            did: session!.did,
            message: 'You updated license profile',
            read: false,
            createdAt: 0,
            updatedAt: 0
          },
          session
        );
      }
    }
  }

  static async updateCertificationProfile(
    certificationItem: CertificationItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'update_certification_profile',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: certificationItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Certification profile is successfuly saved', 'success');
        await this.addActivity(
          {
            guid: '',
            did: session!.did,
            message: 'You updated certification profile',
            read: false,
            createdAt: 0,
            updatedAt: 0
          },
          session
        );
      }
    }
  }

  static async updateGameExpProfile(
    gameExpItem: GameExpItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'update_game_exp_profile',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: gameExpItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Game experience profile is successfuly saved', 'success');
        await this.addActivity(
          {
            guid: '',
            did: session!.did,
            message: 'You updated game experience profile',
            read: false,
            createdAt: 0,
            updatedAt: 0
          },
          session
        );
      }
    }
  }

  static async removeEducationItem(
    educationItem: EducationItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'remove_education_item',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: educationItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Education info is successfuly removed', 'success');
      }
    }
  }

  static async removeTeamItem(teamItem: TeamItem, session: ISessionItem) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'remove_team_item',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: teamItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Team profile info is successfuly removed', 'success');
      }
    }
  }

  static async removeThesisItem(thesisItem: ThesisItem, session: ISessionItem) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'remove_thesis_item',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: thesisItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Thesis profile info is successfuly removed', 'success');
      }
    }
  }

  static async removePaperItem(paperItem: PaperItem, session: ISessionItem) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'remove_paper_item',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: paperItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Paper profile info is successfuly removed', 'success');
      }
    }
  }

  static async removeLicenseItem(
    licenseItem: LicenseItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'remove_license_item',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: licenseItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('License profile info is successfuly removed', 'success');
      }
    }
  }

  static async removeCertificationItem(
    certificationItem: CertificationItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'remove_certification_item',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: certificationItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify(
          'Certification profile info is successfuly removed',
          'success'
        );
      }
    }
  }

  static async removeGameExpItem(
    gameExpItem: GameExpItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'remove_game_exp_item',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: gameExpItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify(
          'Game experience profile info is successfuly removed',
          'success'
        );
      }
    }
  }

  static async removeExperienceItem(
    experienceItem: ExperienceItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'remove_experience_item',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: experienceItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Experience info is successfuly removed', 'success');
      }
    }
  }

  static async getFollowers(
    dids: string[],
    limit: number = 0
  ): Promise<IFollowerResponse | undefined> {
    const appHiveClient = await HiveService.getAppHiveClient();
    if (appHiveClient && dids && dids.length > 0) {
      let followersResponse: IRunScriptResponse<IFollowerResponse> = await appHiveClient.Scripting.RunScript(
        {
          name: 'get_followers',
          params: {
            did: dids,
            limit: limit,
            skip: 0
          },
          context: {
            target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
            target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
          }
        }
      );
      if (followersResponse.isSuccess) {
        return followersResponse.response;
      }
    }
    return;
  }

  static async unfollow(did: string, session: ISessionItem): Promise<any> {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (hiveInstance && did && did !== '') {
      await hiveInstance.Database.deleteOne('following', {
        did: did
      });

      let followersResponse = await this.getFollowers([did]);
      let followersList: string[] = [];
      if (
        followersResponse &&
        followersResponse.get_followers.items.length > 0
      ) {
        // TODO: handle this better
        followersList = followersResponse.get_followers.items[0].followers;
      }

      const sDid = session ? session.did : '';
      if (sDid !== '') {
        followersList = followersList.filter(item => item !== sDid);
      }
      let uniqueItems = [...new Set(followersList)]; // distinct

      const appHiveClient = await HiveService.getAppHiveClient();
      if (appHiveClient) {
        await appHiveClient.Scripting.RunScript({
          name: 'set_followers',
          params: {
            did: did,
            followers: uniqueItems
          },
          context: {
            target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
            target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
          }
        });
      }

      if (session) {
        return this.getFollowings(session.did);
      }
    }

    return;
  }

  static async resetFollowing(session: ISessionItem): Promise<any> {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (!hiveInstance) return;
    await hiveInstance.Database.deleteCollection('following');
    await hiveInstance.Database.createCollection('following');
    return this.getFollowings(session.did);
  }

  static async getFollowings(
    targetDid: string,
    limit: number = 0
  ): Promise<IFollowingResponse | undefined> {
    let response: IFollowingResponse = {
      get_following: { items: [] }
    };

    if (targetDid && targetDid !== '') {
      let searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
      let userResponse = await searchServiceLocal.searchUsersByDIDs(
        [targetDid],
        1,
        0
      );
      if (
        !userResponse.isSuccess ||
        !userResponse.response ||
        !userResponse.response.get_users_by_dids ||
        userResponse.response.get_users_by_dids.items.length === 0
      )
        return response;

      const hiveInstance = await HiveService.getReadOnlyUserHiveClient(
        userResponse.response.get_users_by_dids.items[0].hiveHost
      );

      if (hiveInstance) {
        let params = {
          limit: limit,
          skip: 0
        };
        const followingResponse: IRunScriptResponse<IFollowingResponse> = await hiveInstance.Scripting.RunScript(
          {
            name: 'get_following',
            params: params,
            context: {
              target_did: targetDid,
              target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
            }
          }
        );

        if (followingResponse.isSuccess) {
          return followingResponse.response;
        }
      }
    }
    return response;
  }

  static async addFollowing(did: string, session: ISessionItem): Promise<any> {
    const hiveClient = await HiveService.getSessionInstance(session);
    if (hiveClient && did && did !== '') {
      await hiveClient.Database.insertOne('following', { did: did }, undefined);

      let followersResponse = await this.getFollowers([did]);

      let followersList: string[] = [];
      if (followersResponse && followersResponse.get_followers.items.length > 0)
        // TODO: handle this better
        followersList = followersResponse.get_followers.items[0].followers;

      const sDid = session ? session.did : '';
      if (sDid !== '') {
        followersList.push(sDid);
      }

      let uniqueItems = [...new Set(followersList)]; // distinct

      const appHiveClient = await HiveService.getAppHiveClient();
      if (appHiveClient) {
        await appHiveClient.Scripting.RunScript({
          name: 'set_followers',
          params: {
            did: did,
            followers: uniqueItems
          },
          context: {
            target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
            target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
          }
        });
      }

      let userService = new UserService(await DidService.getInstance());
      let followingUser = await userService.SearchUserWithDID(did);

      await this.addActivity(
        {
          guid: '',
          did: sDid,
          message:
            'You are following <a href="/did/' +
            did.replaceAll('did:elastos:', '') +
            '" target="_blank">' +
            followingUser.name +
            '</a>',
          read: false,
          createdAt: 0,
          updatedAt: 0
        },
        session
      );

      if (session) {
        return this.getFollowings(session.did);
      }
    }
    return;
  }
  static async getActivity(session: ISessionItem) {
    const hiveInstance = await HiveService.getSessionInstance(session);

    if (session && hiveInstance) {
      const result: IRunScriptResponse<ActivityResponse> = await hiveInstance.Scripting.RunScript(
        {
          name: 'get_activity',
          context: {
            target_did: session.did,
            target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
          }
        }
      );
      const get_activity_items = getItemsFromData(result, 'get_activity');
      if (get_activity_items.length > 0) {
        return get_activity_items;
      }
    }
    let tmp_activities = JSON.parse(
      window.localStorage.getItem(
        `temporary_activities_${session!.did.replace('did:elastos:', '')}`
      ) || '[]'
    );
    return tmp_activities;
  }
  static async addActivity(activity: ActivityItem, session: ISessionItem) {
    // Assign new guid to activity
    if (!activity.guid) activity.guid = Guid.create();
    if (!activity.createdAt) activity.createdAt = new Date().getTime();
    if (!activity.updatedAt) activity.updatedAt = new Date().getTime();
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'add_activity',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: activity
      });
      if (res.isSuccess && res.response._status === 'OK') {
        // showNotify('Activity created', 'success');
      }
    } else {
      let tmp_activities = JSON.parse(
        window.localStorage.getItem(
          `temporary_activities_${activity.did.replace('did:elastos:', '')}`
        ) || '[]'
      );
      tmp_activities.push(activity);
      window.localStorage.setItem(
        `temporary_activities_${activity.did.replace('did:elastos:', '')}`,
        JSON.stringify(tmp_activities)
      );
    }
  }

  static async updateActivity(activity: ActivityItem, session: ISessionItem) {
    activity.updatedAt = new Date().getTime();
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'update_activity',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: activity
      });
      if (res.isSuccess && res.response._status === 'OK') {
        // showNotify('Activity read by you', 'success');
      }
    } else {
      let tmp_activities = JSON.parse(
        window.localStorage.getItem(
          `temporary_activities_${activity.did.replace('did:elastos:', '')}`
        ) || '[]'
      );
      let index = tmp_activities.findIndex(
        (_activity: any) => _activity.guid.value === activity.guid.value
      );
      if (index < 0) return;
      tmp_activities[index] = activity;
      window.localStorage.setItem(
        `temporary_activities_${activity.did.replace('did:elastos:', '')}`,
        JSON.stringify(tmp_activities)
      );
    }
  }
}

export const defaultUserInfo: ISessionItem = {
  hiveHost: '',
  userToken: '',
  accountType: 'DID',
  did: '',
  email: '',
  name: '',
  isDIDPublished: false,
  didPublishTime: 0,
  loginCred: {
    email: ''
  },
  mnemonics: '',
  passhash: '',
  onBoardingCompleted: false,
  tutorialStep: 1,
  timestamp: Date.now()
};

export const defaultFullProfile = {
  name: {
    name: '',
    verifiers: []
  },
  email: {
    email: '',
    verifiers: []
  },
  basicDTO: {
    isEnabled: false,
    name: '',
    hiveHost: '',
    email: '',
    did: '',
    title: '',
    about: '',
    address: {
      number: '',
      street_name: '',
      postal_code: '',
      state: '',
      country: ''
    }
  },
  educationDTO: {
    isEnabled: false,
    items: [] as EducationItem[]
  },
  versionDTO: {
    isEnabled: false,
    latestVersion: ''
  },
  experienceDTO: {
    isEnabled: false,
    items: [] as ExperienceItem[]
  },
  teamDTO: {
    isEnabled: false,
    items: [] as TeamItem[]
  },
  thesisDTO: {
    isEnabled: false,
    items: [] as ThesisItem[]
  },
  paperDTO: {
    isEnabled: false,
    items: [] as PaperItem[]
  },
  licenseDTO: {
    isEnabled: false,
    items: [] as LicenseItem[]
  },
  certificationDTO: {
    isEnabled: false,
    items: [] as CertificationItem[]
  },
  gameExpDTO: {
    isEnabled: false,
    items: [] as GameExpItem[]
  },
  gamerTagDTO: {
    isEnabled: false,
    items: [] as GamerTagItem[]
  }
};
