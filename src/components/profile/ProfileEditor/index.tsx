import React, { useEffect, useState } from 'react';
import { IonContent, IonGrid, IonCol, IonRow } from '@ionic/react';
import { IRunScriptResponse } from '@elastos/elastos-hive-js-sdk/dist/Services/Scripting.Service';

import {
  AccountType,
  ISessionItem,
  UserService
} from 'src/services/user.service';
import { TuumTechScriptService } from 'src/services/script.service';
import {
  BasicDTO,
  EducationItem,
  ExperienceItem,
  ProfileDTO
} from 'src/pages/PublicPage/types';
import { ProfileResponse } from 'src/pages/ProfilePage/types';
import { ProfileService } from 'src/services/profile.service';

import TemplateManagerCard from '../../cards/TemplateManagerCard';
import EducationCard from '../../cards/EducationCard';
import ExperienceCard from '../../cards/ExperienceCard';
import AboutCard from '../../cards/AboutCard';
import BasicCard from '../../cards/BasicCard';

import style from './style.module.scss';

const ProfileEditor: React.FC = () => {
  const [error, setError] = useState(false);
  const [userInfo, setUserInfo] = useState<ISessionItem>({
    hiveHost: '',
    userToken: '',
    accountType: AccountType.DID,
    did: '',
    email: '',
    name: '',
    isDIDPublished: false,
    mnemonics: '',
    passhash: '',
    onBoardingCompleted: false,
    tutorialCompleted: false
  });
  const [loaded, setloaded] = useState(false);
  const [full_profile, setfull_profile] = useState({
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
      isEnabled: true,
      items: [] as EducationItem[]
    },
    experienceDTO: {
      isEnabled: true,
      items: [] as ExperienceItem[]
    }
  });

  async function requestFullProfile(did: string): Promise<ProfileDTO> {
    let profileService: ProfileService = await ProfileService.getProfileServiceInstance();
    let getFullProfileResponse: IRunScriptResponse<ProfileResponse> = {} as IRunScriptResponse<
      ProfileResponse
    >;

    getFullProfileResponse = await profileService.getFullProfile(did);

    return mapProfileResponseToProfileDTO(
      getFullProfileResponse.response as ProfileResponse
    );
  }

  async function callUpdateProfile(basicDTO: ISessionItem): Promise<any> {
    let profileService: ProfileService = await ProfileService.getProfileServiceInstance();
    let getFullProfileResponse: IRunScriptResponse<ProfileResponse> = {} as IRunScriptResponse<
      ProfileResponse
    >;
    try {
      getFullProfileResponse = await TuumTechScriptService.updateBasicProfile(
        basicDTO
      );
    } catch (error) {
      // console.error(JSON.stringify(error));
    }
    return '';
  }

  async function callUpdateAbout(basicDTO: BasicDTO): Promise<any> {
    let profileService: ProfileService = await ProfileService.getProfileServiceInstance();
    //let getFullProfileResponse: IRunScriptResponse<ProfileResponse> = {} as IRunScriptResponse<ProfileResponse>;
    await TuumTechScriptService.updateAbout(basicDTO);
    return '';
  }

  async function callUpdateEducationProfile(
    educationItem: EducationItem
  ): Promise<any> {
    let profileService: ProfileService = await ProfileService.getProfileServiceInstance();
    // let getFullProfileResponse: IRunScriptResponse<ProfileResponse> = {} as IRunScriptResponse<
    //   ProfileResponse
    // >;
    // getFullProfileResponse =
    await profileService.updateEducationProfile(educationItem);
    return '';
  }

  async function callUpdateExperienceProfile(
    experienceItem: ExperienceItem
  ): Promise<any> {
    let profileService: ProfileService = await ProfileService.getProfileServiceInstance();
    // let getFullProfileResponse: IRunScriptResponse<ProfileResponse> = {} as IRunScriptResponse<
    //   ProfileResponse
    // >;
    try {
      // getFullProfileResponse =
      await profileService.updateExperienceProfile(experienceItem);

      return ''; //mapProfileResponseToProfileDTO(getFullProfileResponse.response as ProfileResponse);
    } catch (error) {
      console.error(JSON.stringify(error));
    }
    return mapProfileResponseToProfileDTO({} as ProfileResponse);
  }

  async function callRemoveEducationItem(
    educationItem: EducationItem
  ): Promise<any> {
    let profileService: ProfileService = await ProfileService.getProfileServiceInstance();
    // let getFullProfileResponse: IRunScriptResponse<ProfileResponse> = {} as IRunScriptResponse<
    //   ProfileResponse
    // >;
    // getFullProfileResponse =
    await profileService.removeEducationItem(educationItem);
    return '';
  }

  async function callRemoveExperienceItem(
    experienceItem: ExperienceItem
  ): Promise<any> {
    let profileService: ProfileService = await ProfileService.getProfileServiceInstance();
    // let getFullProfileResponse: IRunScriptResponse<ProfileResponse> = {} as IRunScriptResponse<
    //   ProfileResponse
    // >;
    // getFullProfileResponse =
    await profileService.removeExperienceItem(experienceItem);

    return '';
  }

  const mapProfileResponseToProfileDTO = (
    fullProfileResponse: ProfileResponse
  ): ProfileDTO => {
    let basicProfile = fullProfileResponse.get_basic.items![0];
    let educationProfile = fullProfileResponse.get_education_profile;
    let experienceProfile = fullProfileResponse.get_experience_profile;

    return {
      basicDTO: basicProfile,
      educationDTO: educationProfile,
      experienceDTO: experienceProfile
    };
  };

  const getFullProfile = async (did: string): Promise<ProfileDTO> => {
    return await requestFullProfile(did);
  };

  const updateBasicProfile = async (userInfo: ISessionItem): Promise<any> => {
    callUpdateProfile(userInfo);
    UserService.updateSession(userInfo);
  };

  const updateAbout = async (basicDTO: BasicDTO): Promise<any> => {
    callUpdateAbout(basicDTO);
  };

  const updateEducationProfile = async (
    educationItem: EducationItem
  ): Promise<any> => {
    callUpdateEducationProfile(educationItem);
  };

  const updateExperienceProfile = async (
    experienceItem: ExperienceItem
  ): Promise<any> => {
    callUpdateExperienceProfile(experienceItem);
  };

  const removeEducation = async (
    educationItem: EducationItem
  ): Promise<any> => {
    callRemoveEducationItem(educationItem);
  };

  const removeExperience = async (
    experienceItem: ExperienceItem
  ): Promise<any> => {
    callRemoveExperienceItem(experienceItem);
  };

  useEffect(() => {
    (async () => {
      let instance = UserService.GetUserSession();
      if (!instance || !instance.userToken) return;

      setUserInfo(instance);

      if (instance.tutorialCompleted) {
        try {
          let profile: ProfileDTO = await getFullProfile(instance.did);
          profile.experienceDTO.isEnabled = true;
          profile.educationDTO.isEnabled = true;

          setfull_profile(profile);
        } catch (e) {
          setError(true);
        }
      }
      setloaded(true);
    })();
  }, []);

  return (
    <IonContent className={style['profileeditor']}>
      {/*-- Default ProfileEditor --*/}
      {/* <IonSpinner /> */}
      <IonGrid className={style['profileeditorgrid']}>
        <IonRow>
          <IonCol size="4">
            <TemplateManagerCard sessionItem={userInfo} />
          </IonCol>
          <IonCol size="8">
            {!error && loaded ? (
              <BasicCard
                sessionItem={userInfo}
                updateFunc={updateBasicProfile}
              ></BasicCard>
            ) : (
              ''
            )}
            {!error && loaded && userInfo.tutorialCompleted === true ? (
              <>
                <AboutCard
                  basicDTO={full_profile.basicDTO}
                  updateFunc={updateAbout}
                  mode="edit"
                ></AboutCard>
                <EducationCard
                  educationDTO={full_profile.educationDTO}
                  updateFunc={updateEducationProfile}
                  removeFunc={removeEducation}
                  mode="edit"
                ></EducationCard>
                <ExperienceCard
                  experienceDTO={full_profile.experienceDTO}
                  updateFunc={updateExperienceProfile}
                  removeFunc={removeExperience}
                  mode="edit"
                ></ExperienceCard>
              </>
            ) : (
              ''
            )}
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default ProfileEditor;
