import React, { useEffect, useState } from 'react';
import { IonSpinner, IonContent, IonGrid, IonCol, IonRow } from '@ionic/react';
import AboutCard from '../cards/AboutCard';
import BasicCard from '../cards/BasicCard';
import { BasicDTO, EducationDTO, EducationItem, ExperienceItem, ProfileDTO } from 'src/pages/PublicPage/types';
import style from './style.module.scss';
import { ProfileService } from 'src/services/profile.service';
import { IRunScriptResponse } from '@elastos/elastos-hive-js-sdk/dist/Services/Scripting.Service';
import { ProfileResponse } from 'src/pages/ProfilePage/types';
import { profile } from 'console';
import ProfileTemplateManager from '../ProfileTemplateManager';
import TemplateManagerCard, { TemplateDTO } from '../cards/TemplateManagerCard';
import EducationCard from '../cards/EducationCard';
import ExperienceCard from '../cards/ExperienceCard';

const ProfileEditor: React.FC = () => {






  const [loaded, setloaded] = useState(false);
  const [full_profile, setfull_profile] = useState({
    basicDTO: {
      isEnabled: false,
      first_name: '',
      last_name: '',
      email: '',
      vault_url: '',
      did: '',
      title: '',
      about: '',
      address: {
        number: '',
        street_name: '',
        postal_code: '',
        state: '',
        country: '',
      },
    },
    educationDTO: {
      isEnabled: true,
      items: [] as EducationItem[],
    },
    experienceDTO: {
      isEnabled: true,
      items: [] as ExperienceItem[],
    },
  });



  async function requestFullProfile(did: string): Promise<ProfileDTO> {
    let profileService: ProfileService = await ProfileService.getProfileServiceAppOnlyInstance();
    let getFullProfileResponse: IRunScriptResponse<ProfileResponse> = {} as IRunScriptResponse<ProfileResponse>;
    try {
      getFullProfileResponse = await profileService.getFullProfile(did);
      console.log(JSON.stringify(getFullProfileResponse));
      return mapProfileResponseToProfileDTO(getFullProfileResponse.response as ProfileResponse);

    } catch (error) {
      console.error(JSON.stringify(error));
    }
    return mapProfileResponseToProfileDTO({} as ProfileResponse);
  }


  async function callUpdateProfile(basicDTO: BasicDTO): Promise<any> {
    let profileService: ProfileService = await ProfileService.getProfileServiceAppOnlyInstance();
    let getFullProfileResponse: IRunScriptResponse<ProfileResponse> = {} as IRunScriptResponse<ProfileResponse>;
    try {
      getFullProfileResponse = await profileService.updateBasicProfile(basicDTO);
      console.log(JSON.stringify(getFullProfileResponse));
      return "" //mapProfileResponseToProfileDTO(getFullProfileResponse.response as ProfileResponse);

    } catch (error) {
      console.error(JSON.stringify(error));
    }
    return mapProfileResponseToProfileDTO({} as ProfileResponse);
  }

  async function callUpdateEducationProfile(educationItem: EducationItem): Promise<any> {
    let profileService: ProfileService = await ProfileService.getProfileServiceAppOnlyInstance();
    let getFullProfileResponse: IRunScriptResponse<ProfileResponse> = {} as IRunScriptResponse<ProfileResponse>;
    try {
      getFullProfileResponse = await profileService.updateEducationProfile(educationItem);
      console.log(JSON.stringify(getFullProfileResponse));
      return "" //mapProfileResponseToProfileDTO(getFullProfileResponse.response as ProfileResponse);

    } catch (error) {
      console.error(JSON.stringify(error));
    }
    return mapProfileResponseToProfileDTO({} as ProfileResponse);
  }

  async function callUpdateExperienceProfile(educationItem: ExperienceItem): Promise<any> {
    let profileService: ProfileService = await ProfileService.getProfileServiceAppOnlyInstance();
    let getFullProfileResponse: IRunScriptResponse<ProfileResponse> = {} as IRunScriptResponse<ProfileResponse>;
    try {
      getFullProfileResponse = await profileService.updateExperienceProfile(educationItem);
      console.log(JSON.stringify(getFullProfileResponse));
      return "" //mapProfileResponseToProfileDTO(getFullProfileResponse.response as ProfileResponse);

    } catch (error) {
      console.error(JSON.stringify(error));
    }
    return mapProfileResponseToProfileDTO({} as ProfileResponse);
  }


  const mapProfileResponseToProfileDTO = (fullProfileResponse: ProfileResponse): ProfileDTO => {

    let basicProfile = fullProfileResponse.get_basic.items![0];
    let educationProfile = fullProfileResponse.get_education_profile;
    let experienceProfile = fullProfileResponse.get_experience_profile;

    return {
      basicDTO: basicProfile,
      educationDTO: educationProfile,
      experienceDTO: experienceProfile
    };
  }


  const getFullProfile = async (did: string): Promise<ProfileDTO> => {
    return await requestFullProfile(did);
  };

  const updateBasicProfile = async (basicDTO: BasicDTO): Promise<any> => {
    console.log(">>>>>>>>> update basic_profile called ");
    console.log(">>>>>>>>>  " + JSON.stringify(basicDTO));

    callUpdateProfile(basicDTO);
  }

  const updateEducationProfile = async (educationItem: EducationItem): Promise<any> => {
    console.log(">>>>>>>>> update education_profile called ");
    console.log(">>>>>>>>>  " + JSON.stringify(educationItem));
    callUpdateEducationProfile(educationItem);
  }

  const updateExperienceProfile = async (experienceItem: ExperienceItem): Promise<any> => {
    console.log(">>>>>>>>> update experience_profile called ");
    console.log(">>>>>>>>>  " + JSON.stringify(experienceItem));
    callUpdateExperienceProfile(experienceItem);
  }

  useEffect(() => {
    (async () => {
      let did = "did:elastos:iVy37oQuQ77L6SfXyNiBmdW2TSoyJQmBU1";
      let profile: ProfileDTO = await getFullProfile(did);
      setfull_profile(profile);
      setloaded(true);
    })();
  }, []);

  let templateDTO: TemplateDTO = {
    id: "1"
  }

  return (
    <IonContent className={style["profileeditor"]}>
      {/*-- Default ProfileEditor --*/}
      {/* <IonSpinner /> */}
      <IonGrid className={style["profileeditorgrid"]}>
        <IonRow>

          <IonCol size="4">
            <TemplateManagerCard templateDTO={templateDTO} />
          </IonCol>
          <IonCol size="8">
            {loaded ? <BasicCard basicDTO={full_profile.basicDTO} updateFunc={updateBasicProfile}></BasicCard> : <div>Loading...</div>}
            {loaded ? <EducationCard educationDTO={full_profile.educationDTO} updateFunc={updateEducationProfile} mode="edit" ></EducationCard> : <div>Loading...</div>}
            {loaded ? <ExperienceCard experienceDTO={full_profile.experienceDTO} updateFunc={updateExperienceProfile} mode="edit" ></ExperienceCard> : <div>Loading...</div>}


          </IonCol>
        </IonRow>
      </IonGrid>



    </IonContent>
  )
};

export default ProfileEditor;
