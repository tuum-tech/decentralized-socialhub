import React from 'react'
import {
  IonGrid,
  IonRow,
  IonCol,
  IonProgressBar,
  IonButton,
} from '@ionic/react'

import { ProfileContent } from 'src/pages/ProfilePage/types'

import style from './style.module.scss'

import ButtonWithUpArrow from 'src/components/buttons/ButtonWithUpArrow'
import RegisterNewUserButton from '../RegisterNewUserButton'
import ProfileDescription from '../ProfileDescription'
import ProfileName from '../ProfileName'
import ProfileLocationWidget from '../ProfileLocationWidget'
import styled from 'styled-components'
import ButtonDefault from '../ButtonDefault'
import ButtonLight from '../ButtonLight'
import DashboardNav from '../DashboardNav'
import { ProfileDTO } from 'src/pages/PublicPage/types'
import DidSnippet from '../DidSnippet'

// import photo from '../../assets/photo.png';
import photo from '../../assets/dp.jpeg'
import bulb from '../../assets/bulb.svg'
import edit from '../../assets/icon-edit.svg'
import addbutton from '../../assets/addbutton.svg'
import university from '../../assets/university.png'
interface IProps {
  profile: ProfileDTO
}

const ProfileHeader: React.FC<IProps> = ({ profile }: IProps) => {
  return (
    <IonGrid className={style['profileheader']}>
      <IonRow className={style['header']}>
        <IonCol size='auto'>
          <img src={photo} className={style['profile-img']} alt='profile' />
        </IonCol>
        <IonCol size='8'>
          <IonGrid>
            <IonRow>
              <ProfileName>
                {profile.basicDTO.firstName} {profile.basicDTO.lastName}
              </ProfileName>
            </IonRow>
            <IonRow>
              <ProfileDescription>{profile.basicDTO.title}</ProfileDescription>
            </IonRow>
            <IonRow className="ion-justify-content-start">
              <IonCol size="auto"><ProfileLocationWidget address={profile.basicDTO.address} /></IonCol>
              <IonCol><DidSnippet did={profile.basicDTO.did} /></IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
        <IonCol size='2'>
          <FollowButton>Sign in to Follow</FollowButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  )
}

export default ProfileHeader

const FollowButton = styled(IonButton)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  --background: #4c6fff;
  --border-radius: 9px;
  height: 40px;
  opacity: 1;
  text-align: center;
  text-transform: none;
  letter-spacing: 0px;
  color: #ffffff;
  font-family: 'SF Pro Display';
  font-size: 12px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
`
