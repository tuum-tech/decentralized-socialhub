import React, { useEffect, useState } from 'react'
import { IonSpinner, IonContent, IonGrid, IonCol, IonRow } from '@ionic/react'
import AboutCard from '../cards/AboutCard'
import BasicCard from '../cards/BasicCard'
import {
  BasicDTO,
  EducationDTO,
  EducationItem,
  ExperienceItem,
  ProfileDTO,
} from 'src/pages/PublicPage/types'
import style from './style.module.scss'
import { ProfileService } from 'src/services/profile.service'
import { IRunScriptResponse } from '@elastos/elastos-hive-js-sdk/dist/Services/Scripting.Service'
import { ProfileResponse } from 'src/pages/ProfilePage/types'
import { profile } from 'console'
import ProfileTemplateManager from '../ProfileTemplateManager'
import TemplateManagerCard from '../cards/TemplateManagerCard'
import EducationCard from '../cards/EducationCard'
import ExperienceCard from '../cards/ExperienceCard'
import {
  AccountType,
  ISessionItem,
  UserService,
} from 'src/services/user.service'

const ProfileEditor: React.FC = () => {
  const [error, setError] = useState(false)
  const [userInfo, setUserInfo] = useState<ISessionItem>({
    hiveHost: '',
    userToken: '',
    accountType: AccountType.DID,
    did: '',
    email: '',
    name: '',
    isDIDPublished: false,
    mnemonics: '',
    onBoardingCompleted: false,
    tutorialCompleted: false,
  })
  const [loaded, setloaded] = useState(false)
  const [full_profile, setfull_profile] = useState({
    basicDTO: {
      isEnabled: false,
      name: '',
      hiveHost: '',
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
  })

  async function requestFullProfile(did: string): Promise<ProfileDTO> {
    let profileService: ProfileService = await ProfileService.getProfileServiceInstance()
    let getFullProfileResponse: IRunScriptResponse<ProfileResponse> = {} as IRunScriptResponse<ProfileResponse>

    getFullProfileResponse = await profileService.getFullProfile(did)
    console.log(JSON.stringify(getFullProfileResponse))
    return mapProfileResponseToProfileDTO(
      getFullProfileResponse.response as ProfileResponse
    )
  }

  async function callUpdateProfile(basicDTO: ISessionItem): Promise<any> {
    let profileService: ProfileService = await ProfileService.getProfileServiceInstance()
    let getFullProfileResponse: IRunScriptResponse<ProfileResponse> = {} as IRunScriptResponse<ProfileResponse>
    try {
      getFullProfileResponse = await profileService.updateBasicProfile(basicDTO)
      console.log(JSON.stringify(getFullProfileResponse))
    } catch (error) {
      console.error(JSON.stringify(error))
    }
    return ''
  }

  async function callUpdateEducationProfile(
    educationItem: EducationItem
  ): Promise<any> {
    let profileService: ProfileService = await ProfileService.getProfileServiceInstance()
    let getFullProfileResponse: IRunScriptResponse<ProfileResponse> = {} as IRunScriptResponse<ProfileResponse>
    try {
      getFullProfileResponse = await profileService.updateEducationProfile(
        educationItem
      )
      console.log(JSON.stringify(getFullProfileResponse))
      return '' //mapProfileResponseToProfileDTO(getFullProfileResponse.response as ProfileResponse);
    } catch (error) {
      console.error(JSON.stringify(error))
    }
    return mapProfileResponseToProfileDTO({} as ProfileResponse)
  }

  async function callUpdateExperienceProfile(
    experienceItem: ExperienceItem
  ): Promise<any> {
    let profileService: ProfileService = await ProfileService.getProfileServiceInstance()
    let getFullProfileResponse: IRunScriptResponse<ProfileResponse> = {} as IRunScriptResponse<ProfileResponse>
    try {
      getFullProfileResponse = await profileService.updateExperienceProfile(
        experienceItem
      )
      console.log(JSON.stringify(getFullProfileResponse))
      return '' //mapProfileResponseToProfileDTO(getFullProfileResponse.response as ProfileResponse);
    } catch (error) {
      console.error(JSON.stringify(error))
    }
    return mapProfileResponseToProfileDTO({} as ProfileResponse)
  }

  async function callRemoveEducationItem(
    educationItem: EducationItem
  ): Promise<any> {
    let profileService: ProfileService = await ProfileService.getProfileServiceInstance()
    let getFullProfileResponse: IRunScriptResponse<ProfileResponse> = {} as IRunScriptResponse<ProfileResponse>
    try {
      getFullProfileResponse = await profileService.removeEducationItem(
        educationItem
      )
      console.log(JSON.stringify(getFullProfileResponse))
      return '' //mapProfileResponseToProfileDTO(getFullProfileResponse.response as ProfileResponse);
    } catch (error) {
      console.error(JSON.stringify(error))
    }
    return mapProfileResponseToProfileDTO({} as ProfileResponse)
  }

  const mapProfileResponseToProfileDTO = (
    fullProfileResponse: ProfileResponse
  ): ProfileDTO => {
    let basicProfile = fullProfileResponse.get_basic.items![0]
    let educationProfile = fullProfileResponse.get_education_profile
    let experienceProfile = fullProfileResponse.get_experience_profile

    return {
      basicDTO: basicProfile,
      educationDTO: educationProfile,
      experienceDTO: experienceProfile,
    }
  }

  const getFullProfile = async (did: string): Promise<ProfileDTO> => {
    return await requestFullProfile(did)
  }

  const updateBasicProfile = async (userInfo: ISessionItem): Promise<any> => {
    console.log('>>>>>>>>> update basic_profile called ')
    console.log('>>>>>>>>>  ' + JSON.stringify(userInfo))

    callUpdateProfile(userInfo)
    UserService.updateSession(userInfo)
  }

  const updateEducationProfile = async (
    educationItem: EducationItem
  ): Promise<any> => {
    console.log('>>>>>>>>> update education_profile called ')
    console.log('>>>>>>>>>  ' + JSON.stringify(educationItem))
    callUpdateEducationProfile(educationItem)
  }

  const updateExperienceProfile = async (
    experienceItem: ExperienceItem
  ): Promise<any> => {
    console.log('>>>>>>>>> update experience_profile called ')
    console.log('>>>>>>>>>  ' + JSON.stringify(experienceItem))
    callUpdateExperienceProfile(experienceItem)
  }

  const removeEducation = async (
    educationItem: EducationItem
  ): Promise<any> => {
    console.log('>>>>>>>>> remove education_item called ')
    console.log('>>>>>>>>>  ' + JSON.stringify(educationItem))
    callRemoveEducationItem(educationItem)
  }

  useEffect(() => {
    ;(async () => {
      let instance = UserService.GetUserSession()
      if (!instance || !instance.userToken) return

      setUserInfo(instance)

      if (instance.onBoardingCompleted) {
        try {
          let profile: ProfileDTO = await getFullProfile(instance.did)
          setfull_profile(profile)
        } catch (e) {
          setError(true)
        }
      }
      setloaded(true)
    })()
  }, [])

  return (
    <IonContent className={style['profileeditor']}>
      {/*-- Default ProfileEditor --*/}
      {/* <IonSpinner /> */}
      <IonGrid className={style['profileeditorgrid']}>
        <IonRow>
          <IonCol size='4'>
            <TemplateManagerCard sessionItem={userInfo} />
          </IonCol>
          <IonCol size='8'>
            {loaded ? (
              <BasicCard
                sessionItem={userInfo}
                updateFunc={updateBasicProfile}
              ></BasicCard>
            ) : (
              ''
            )}
            {!error && loaded && userInfo.onBoardingCompleted === true ? (
              <EducationCard
                educationDTO={full_profile.educationDTO}
                updateFunc={updateEducationProfile}
                removeFunc={removeEducation}
                mode='edit'
              ></EducationCard>
            ) : (
              ''
            )}
            {!error && loaded && userInfo.onBoardingCompleted === true ? (
              <ExperienceCard
                experienceDTO={full_profile.experienceDTO}
                updateFunc={updateExperienceProfile}
                mode='edit'
              ></ExperienceCard>
            ) : (
              ''
            )}
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  )
}

export default ProfileEditor
