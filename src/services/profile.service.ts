import { Guid } from 'guid-typescript';
import { ActivityResponse } from 'src/pages/ActivityPage/types';
import { VerificationService } from 'src/services/verification.service';
import { DIDDocument, Logger } from '@elastosfoundation/did-js-sdk/';
import request, { BaseplateResp } from 'src/baseplate/request';

import { showNotify } from 'src/utils/notify';
import { getItemsFromData } from 'src/utils/script';

import { DidDocumentService } from './diddocument.service';
import { HiveService } from './hive.service';
import { UserService } from './user.service';
import { DidService } from './did.service.new';
import { SearchService } from './search.service';
import exp from 'constants';
import { DidcredsService, CredentialType } from './didcreds.service';

export class ProfileService {
  private static LOG = new Logger('ProfileService');

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
      !userResponse ||
      !userResponse.get_users_by_dids ||
      userResponse.get_users_by_dids.items.length <= 0
    ) {
      return fields;
    try {

    const hiveInstance = await HiveService.getAnonymousHiveClient(
      userResponse.get_users_by_dids.items[0].hiveHost
    );
      if (hiveInstance && hiveInstance.isConnected) {
      const res: PublicProfileResponse = await hiveInstance.Scripting.callScript(
        'get_public_fields',
        {},
        did,
        `${process.env.REACT_APP_APPLICATION_DID}`
      );

        fields =
          (getItemsFromData(res, 'get_public_fields')[0] || {}).fields || [];
      }
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
    return fields;
  }

  static async updatePublicFields(fields: string[], userSession: ISessionItem) {
    try {
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
        // const key1 = CredentialType.EIDAddress.toLowerCase();
        const key2 = CredentialType.ESCAddress.toLowerCase();
        const key3 = CredentialType.ETHAddress.toLowerCase();
        // const address1 = await DidcredsService.getCredentialValue(
        //   userSession,
        //   key1
        // );
        const address2 = await DidcredsService.getCredentialValue(
          userSession,
          key2
        );
        const address3 = await DidcredsService.getCredentialValue(
          userSession,
          key3
        );
        // if (address1) wallets[key1] = address1;
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
    } catch (err) {
      showNotify((err as Error).message, 'error');
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
    let escaddressCredential = {
      address: '',
      id: ''
    };
    let ethaddressCredential = {
      address: '',
      id: ''
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
    try {
      let searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
      let userResponse = await searchServiceLocal.searchUsersByDIDs(
        [did],
        1,
        0
      );
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
        const versionRes: VersionProfileResponse = await hiveInstance.Scripting.callScript(
          'get_version_profile',
          {
            limit: 0,
            skip: 0
          },
          did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        const versionPData = getItemsFromData(
          versionRes,
          'get_version_profile'
        );
        if (versionPData.length > 0) {
          versionDTO = versionPData[0];
        }
        const bpRes: BasicProfileResponse = await hiveInstance.Scripting.callScript(
          'get_basic_profile',
          {},
          did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );

        const gbPData = getItemsFromData(bpRes, 'get_basic_profile');
        if (gbPData.length > 0) {
          basicDTO = gbPData[0];
        }

        const tpRes: TeamProfileResponse = await hiveInstance.Scripting.callScript(
          'get_team_profile',
          {},
          did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        teamDTO.items = getItemsFromData(tpRes, 'get_team_profile');

        const thpRes: ThesisProfileResponse = await hiveInstance.Scripting.callScript(
          'get_thesis_profile',
          {},
          did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        thesisDTO.items = getItemsFromData(thpRes, 'get_thesis_profile');

        const p2Res: PaperProfileResponse = await hiveInstance.Scripting.callScript(
          'get_paper_profile',
          {},
          did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        thesisDTO.items = getItemsFromData(p2Res, 'get_paper_profile');

        const lpRes: LicenseProfileResponse = await hiveInstance.Scripting.callScript(
          'get_license_profile',
          {},
          did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        licenseDTO.items = getItemsFromData(lpRes, 'get_license_profile');

        const cpRes: CertificationProfileResponse = await hiveInstance.Scripting.callScript(
          'get_certification_profile',
          {},
          did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        certificationDTO.items = getItemsFromData(
          cpRes,
          'get_certification_profile'
        );
        const gexpRes: GameExpProfileResponse = await hiveInstance.Scripting.callScript(
          'get_game_exp_profile',
          {},
          did,
          `${process.env.REACT_APP_APPLICATION_ID}`
        );
        gameExpDTO.items = getItemsFromData(gexpRes, 'get_game_exp_profile');

        const edRes: EducationProfileResponse = await hiveInstance.Scripting.callScript(
          'get_education_profile',
          {},
          did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );

        const epRes: ExperienceProfileResponse = await hiveInstance.Scripting.callScript(
          'get_experience_profile',
          {},
          did,
          `${process.env.REACT_APP_APPLICATION_DID}`
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
          let educationItems: EducationItem[] = getItemsFromData(
            edRes,
            'get_education_profile'
          );
          let experienceItems: ExperienceItem[] = getItemsFromData(
            epRes,
            'get_experience_profile'
          );

        const allVcsRes: BasicProfileResponse = await hiveInstance.Scripting.callScript(
          'get_verifiable_credentials',
          {},
          did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        let allVcsItems: [] = getItemsFromData(
          allVcsRes,
          'get_verifiable_credentials'
        );
        for (let vcItem of allVcsItems) {
          const item: any = JSON.parse(JSON.stringify(vcItem));

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
              } else if (
                s === 'ethaddress' &&
                verifier.did !== userSession.did
              ) {
                ethaddressCredential.address = vc.credentialSubject.ethaddress;
                ethaddressCredential.id = vc.credentialSubject.id;
              } else if (
                s === 'escaddress' &&
                verifier.did !== userSession.did
              ) {
                escaddressCredential.address = vc.credentialSubject.escaddress;
                escaddressCredential.id = vc.credentialSubject.id;
              }
            }
          }
        }
      }
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
    return {
      name: nameCredential,
      email: emailCredential,
      escaddressCredential,
      ethaddressCredential,
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
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      try {
        const res: any = await hiveInstance.Scripting.callScript(
          'update_basic_profile',
          basicDTO,
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        showNotify('About info is successfuly saved', 'success');
      } catch (e) {
        ProfileService.LOG.error('updateAbout: {}', e);
      }
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }

  static async addVersionHistory(
    latestVersion: string,
    releaseNotes: string[],
    videoUpdateUrl: string,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.callScript(
        'add_version_profile',
        {
          latestVersion,
          releaseNotes: releaseNotes,
          videoUpdateUrl: videoUpdateUrl
        },
        session.did,
        `${process.env.REACT_APP_APPLICATION_ID}`
      );
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Updated to latest version', 'success');
      } else {
        showNotify('Error executing script', 'error');
      }
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }

  static async updateExperienceProfile(
    experienceItem: ExperienceItem,
    session: ISessionItem,
    archivedBadge: boolean
  ): Promise<boolean> {
    const hiveInstance = await HiveService.getHiveClient(session);

    if (session && hiveInstance) {
      try {
        const res: any = await hiveInstance.Scripting.callScript(
          'update_experience_profile',
          experienceItem,
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        showNotify('Experience info is successfuly saved', 'success');
        if (!archivedBadge) {
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
      } catch (e) {
        ProfileService.LOG.error('updateExperienceProfile: {}', e);
        showNotify('Error executing script', 'error');
        return false;
      }
      return true;
    } catch (err) {
      showNotify((err as Error).message, 'error');
      return false;
    }
  }

  static async updateEducationProfile(
    educationItem: EducationItem,
    session: ISessionItem,
    archivedBadge: boolean
  ): Promise<boolean> {
    const hiveInstance = await HiveService.getHiveClient(session);

    if (session && hiveInstance) {
      try {
        const res: any = await hiveInstance.Scripting.callScript(
          'update_education_profile',
          educationItem,
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        showNotify('Education info is successfuly saved', 'success');
        if (!archivedBadge) {
          await ProfileService.addActivity(
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
        await ProfileService.addActivity(
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
      } catch (e) {
        ProfileService.LOG.error('updateEducationProfile: {}', e);
        showNotify('Error executing script', 'error');
        return false;
      }
      return true;
    } catch (err) {
      showNotify((err as Error).message, 'error');
      return false;
    }
  }

  static async updateTeamProfile(teamItem: TeamItem, session: ISessionItem) {
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      try {
        const res: any = await hiveInstance.Scripting.callScript(
          'update_team_profile',
          teamItem,
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        showNotify('Team profile is successfuly saved', 'success');
        await ProfileService.addActivity(
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
      } catch (e) {
        ProfileService.LOG.error('updateTeamProfile: {}', e);
      }
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }

  static async updateThesisProfile(
    thesisItem: ThesisItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      try {
        const res: any = await hiveInstance.Scripting.callScript(
          'update_thesis_profile',
          thesisItem,
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        showNotify('Thesis profile is successfuly saved', 'success');
        await ProfileService.addActivity(
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
      } catch (e) {
        ProfileService.LOG.error('updateThesisProfile: {}', e);
      }
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }

  static async updatePaperProfile(paperItem: PaperItem, session: ISessionItem) {
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      try {
        const res: any = await hiveInstance.Scripting.callScript(
          'update_paper_profile',
          paperItem,
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        showNotify('Paper profile is successfuly saved', 'success');
        await ProfileService.addActivity(
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
      } catch (e) {
        ProfileService.LOG.error('updatePaperProfile: {}', e);
      }
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }

  static async updateLicenseProfile(
    licenseItem: LicenseItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      try {
        const res: any = await hiveInstance.Scripting.callScript(
          'update_license_profile',
          licenseItem,
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        showNotify('License profile is successfuly saved', 'success');
        await ProfileService.addActivity(
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
      } catch (e) {
        ProfileService.LOG.error('updatePaperProfile: {}', e);
      }
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }

  static async updateCertificationProfile(
    certificationItem: CertificationItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      try {
        const res: any = await hiveInstance.Scripting.callScript(
          'update_certification_profile',
          certificationItem,
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        showNotify('Certification profile is successfuly saved', 'success');
        await ProfileService.addActivity(
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
      } catch (e) {
        ProfileService.LOG.error('updateCertificationProfile: {}', e);
      }
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }

  static async updateGameExpProfile(
    gameExpItem: GameExpItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      try {
        const res: any = await hiveInstance.Scripting.callScript(
          'update_game_exp_profile',
          gameExpItem,
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        showNotify('Game experience profile is successfuly saved', 'success');
        await ProfileService.addActivity(
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
      } catch (e) {
        ProfileService.LOG.error('updateGameExpProfile: {}', e);
      }
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }

  static async removeEducationItem(
    educationItem: EducationItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      try {
        const res: any = await hiveInstance.Scripting.callScript(
          'remove_education_item',
          educationItem,
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        showNotify('Education info is successfuly removed', 'success');
      } catch (e) {
        ProfileService.LOG.error('removeEducationItem: {}', e);
      }
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }

  static async removeTeamItem(teamItem: TeamItem, session: ISessionItem) {
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      try {
        const res: any = await hiveInstance.Scripting.callScript(
          'remove_team_item',
          teamItem,
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        showNotify('Team profile info is successfuly removed', 'success');
      } catch (e) {
        ProfileService.LOG.error('removeTeamItem: {}', e);
      }
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }

  static async removeThesisItem(thesisItem: ThesisItem, session: ISessionItem) {
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      try {
        const res: any = await hiveInstance.Scripting.callScript(
          'remove_thesis_item',
          thesisItem,
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        showNotify('Thesis profile info is successfuly removed', 'success');
      } catch (e) {
        ProfileService.LOG.error('removeThesisItem: {}', e);
      }
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }

  static async removePaperItem(paperItem: PaperItem, session: ISessionItem) {
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      try {
        const res: any = await hiveInstance.Scripting.callScript(
          'remove_paper_item',
          paperItem,
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        showNotify('Paper profile info is successfuly removed', 'success');
      } catch (e) {
        ProfileService.LOG.error('removePaperItem: {}', e);
      }
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }

  static async removeLicenseItem(
    licenseItem: LicenseItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      try {
        const res: any = await hiveInstance.Scripting.callScript(
          'remove_license_item',
          licenseItem,
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        showNotify('License profile info is successfuly removed', 'success');
      } catch (e) {
        ProfileService.LOG.error('removeLicenseItem: {}', e);
      }
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }

  static async removeCertificationItem(
    certificationItem: CertificationItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      try {
        const res: any = await hiveInstance.Scripting.callScript(
          'remove_certification_item',
          certificationItem,
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        showNotify(
          'Certification profile info is successfuly removed',
          'success'
        );
      } catch (e) {
        ProfileService.LOG.error('removeCertificationItem: {}', e);
      }
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }

  static async removeGameExpItem(
    gameExpItem: GameExpItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      try {
        const res: any = await hiveInstance.Scripting.callScript(
          'remove_game_exp_item',
          gameExpItem,
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        showNotify(
          'Game experience profile info is successfuly removed',
          'success'
        );
      } catch (e) {
        ProfileService.LOG.error('removeGameExpItem: {}', e);
      }
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }

  static async removeExperienceItem(
    experienceItem: ExperienceItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      try {
        const res: any = await hiveInstance.Scripting.callScript(
          'remove_experience_item',
          experienceItem,
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        showNotify('Experience info is successfuly removed', 'success');
      } catch (e) {
        ProfileService.LOG.error('removeExperienceItem: {}', e);
      }
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }

  static async getFollowers(
    dids: string[],
    limit: number = 0
  ): Promise<IFollowerResponse | undefined> {
    const appHiveClient = await HiveService.getApplicationHiveClient();
    if (appHiveClient && dids && dids.length > 0) {
      try {
        let followersResponse: IFollowerResponse = await appHiveClient.Scripting.callScript(
          'get_followers',
          {
            did: dids,
            limit: limit,
            skip: 0
          },
          `${process.env.REACT_APP_APPLICATION_DID}`,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
      } catch (e) {
        ProfileService.LOG.error('getFollowers: {}', e);
      }
      return;
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }

  static async unfollow(
    did: string,
    session: ISessionItem
  ): Promise<IFollowingResponse | undefined> {
    const hiveInstance = await HiveService.getHiveClient(session);
    if (hiveInstance && did && did !== '') {
      await hiveInstance.Database.deleteOne('following', {
        did: did
      });

      let followersResponse = await this.getFollowers([did]);
      let followersList: string[] = [];
      if (followersResponse && followersResponse.items.length > 0) {
        // TODO: handle this better
        followersList = followersResponse.items[0].followers;
      }

        const sDid = session ? session.did : '';
        if (sDid !== '') {
          followersList = followersList.filter(item => item !== sDid);
        }
        let uniqueItems = [...new Set(followersList)]; // distinct

      const appHiveClient = await HiveService.getAnonymousHiveClient();
      if (appHiveClient) {
        try {
          await appHiveClient.Scripting.callScript(
            'set_followers',
            {
              did: did,
              followers: uniqueItems
            },
            `${process.env.REACT_APP_APPLICATION_DID}`,
            `${process.env.REACT_APP_APPLICATION_DID}`
          );
        } catch (e) {
          ProfileService.LOG.error('unfollow: {}', e);
        }
      }

      return;
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }

  static async resetFollowing(session: ISessionItem): Promise<any> {
    const hiveInstance = await HiveService.getHiveClient(session);
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
      items: []
    };
    try {
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

    if (targetDid && targetDid !== '') {
      let searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
      let userResponse = await searchServiceLocal.searchUsersByDIDs(
        [targetDid],
        1,
        0
      );
      if (
        !userResponse ||
        !userResponse.get_users_by_dids ||
        userResponse.get_users_by_dids.items.length === 0
      ) {
        return response;
      }

      const hiveInstance = await HiveService.getAnonymousHiveClient(
        userResponse.get_users_by_dids.items[0].hiveHost
      );

      if (hiveInstance) {
        let params = {
          limit: limit,
          skip: 0
        };
        const followingResponse: IFollowingResponse = await hiveInstance.Scripting.callScript(
          'get_following',
          params,
          targetDid,
          `${process.env.REACT_APP_APPLICATION_ID}`
        );

        if (followingResponse) {
          return followingResponse;
        }
      }
      return response;
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }

  static async addFollowing(did: string, session: ISessionItem): Promise<any> {
    const hiveClient = await HiveService.getHiveClient(session);
    if (hiveClient && did && did !== '') {
      await hiveClient.Database.insertOne('following', { did: did }, undefined);

        let followersResponse = await this.getFollowers([did]);

      let followersList: string[] = [];
      if (followersResponse && followersResponse.items.length > 0)
        // TODO: handle this better
        followersList = followersResponse.items[0].followers;

        const sDid = session ? session.did : '';
        if (sDid !== '') {
          followersList.push(sDid);
        }

        let uniqueItems = [...new Set(followersList)]; // distinct

      const appHiveClient = await HiveService.getAnonymousHiveClient();
      if (appHiveClient) {
        try {
          await appHiveClient.Scripting.callScript(
            'set_followers',
            {
              did: did,
              followers: uniqueItems
            },
            `${process.env.REACT_APP_APPLICATION_DID}`,
            `${process.env.REACT_APP_APPLICATION_DID}`
          );
        } catch (e) {
          ProfileService.LOG.error('addFollowing: {}', e);
        }
      }

        let userService = new UserService(await DidService.getInstance());
        let followingUser = await userService.SearchUserWithDID(did);

      await ProfileService.addActivity(
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
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }
  static async getActivity(session: ISessionItem) {
    const hiveInstance = await HiveService.getHiveClient(session);

    if (session && hiveInstance) {
      try {
        const result: ActivityResponse = await hiveInstance.Scripting.callScript(
          'get_activity',
          {},
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        const get_activity_items = getItemsFromData(result, 'get_activity');
        if (get_activity_items.length > 0) {
          return get_activity_items;
        }
      } catch (e) {
        ProfileService.LOG.error('getActivity: {}', e);
      }
    }
  }
  static async addActivity(activity: ActivityItem, session: ISessionItem) {
    // Assign new guid to activity
    if (!activity.guid) activity.guid = Guid.create();
    if (!activity.createdAt) activity.createdAt = new Date().getTime();
    if (!activity.updatedAt) activity.updatedAt = new Date().getTime();
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      try {
        const res: any = await hiveInstance.Scripting.callScript(
          'add_activity',
          activity,
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        // showNotify('Activity created', 'success');
      } catch (e) {
        ProfileService.LOG.error('addActivity: {}', e);
      }
    } catch (err) {
      showNotify((err as Error).message, 'error');
    }
  }

  static async updateActivity(activity: ActivityItem, session: ISessionItem) {
    activity.updatedAt = new Date().getTime();
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      try {
        const res: any = await hiveInstance.Scripting.callScript(
          'update_activity',
          activity,
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        // showNotify('Activity read by you', 'success');
      } catch (e) {
        ProfileService.LOG.error('updateActivity: {}', e);
      }
    } catch (err) {
      showNotify((err as Error).message, 'error');
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
    latestVersion: '',
    releaseNotes: [],
    videoUpdateUrl: ''
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
  },
  escaddressCredential: {
    address: '',
    id: ''
  },
  ethaddressCredential: {
    address: '',
    id: ''
  }
};
