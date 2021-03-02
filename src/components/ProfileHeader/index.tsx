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
            <IonRow className='ion-justify-content-start'>
              <IonCol size='auto'>
                <ProfileLocationWidget address={profile.basicDTO.address} />
              </IonCol>
              <IonCol>
                <DidSnippet basicDTO={profile.basicDTO} />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
        <IonCol size='2'>
          <FollowButton>Sign in to Follow</FollowButton>
        </IonCol>
      </IonRow>

      {/* <IonRow>
        <IonCol>
          <div className={style['tip']}>
            <IonGrid>
              <IonRow>
                <IonCol size='auto'>
                  <img src={bulb} alt='bulb' />
                </IonCol>
                <IonCol size='9'>
                  Recommendation: Connect your DID and publish it to Blockchain
                </IonCol>
                <IonCol size='2' className={style['action']}>
                  Start Service
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </IonCol>
      </IonRow> */}
      {/* <IonRow>
        <IonCol>
          <h2>About</h2>
        </IonCol>
      </IonRow>
      <IonRow className={style['header']}>
        <IonCol>
          <p>
            Experienced Chief Technology Officer with a demonstrated history of
            working in the financial services industry. Skilled in PHP, Android
            Development, HTML, Cascading Style Sheets (CSS), and Microsoft
            PowerPoint. Strong information technology professional with a
            Bachelor’s degree focused in Computer Software Engineering from
            University of Management and Technology - UMT.
          </p>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size='8'>
          <h2>Education</h2>
        </IonCol>
        <IonCol size='2'>
          <span className={style['addbutton']}>
            {' '}
            <img src={addbutton} alt='add' />
            Add new
          </span>
        </IonCol>
        <IonCol size='2'>
          <img src={edit} alt='edit' />
          <IonProgressBar value={0.78}></IonProgressBar>
          <span className={style['percent-completed-verified']}>
            85% verified
          </span>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size='auto'>
          <img src={university} alt='university' />
        </IonCol>
        <IonCol size='4' className={style['title-university']}>
          University of Management and Technology - UMT
        </IonCol>
      </IonRow> */}
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
