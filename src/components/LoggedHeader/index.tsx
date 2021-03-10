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
import { ISessionItem } from 'src/services/user.service'
interface IProps {
  profile?: ProfileDTO
  sessionItem: ISessionItem
}

const PublishingLabel = styled.span`
  font-family: 'SF Pro Display';
  font-size: 9px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.62;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
  padding: 3px 5px 3px 7px;
  border-radius: 8px;
  background-color: #ff5a5a;
`

const LoggedHeader: React.FC<IProps> = ({ profile, sessionItem }: IProps) => {
  return (
    <IonGrid className={style['profileheader']}>
      <IonRow className={style['header']}>
        <IonCol size='auto'>
          <img src={photo} className={style['profile-img']} alt='profile' />
        </IonCol>
        <IonCol size='8'>
          <IonGrid>
            <IonRow className='ion-justify-content-start'>
              <IonCol size='auto'>
                <ProfileName>{sessionItem.name}</ProfileName>
              </IonCol>
              <IonCol>
                {sessionItem.isDIDPublished === false ? (
                  <PublishingLabel>Publishing ...</PublishingLabel>
                ) : (
                  ''
                )}
              </IonCol>
            </IonRow>
            <IonRow className='ion-justify-content-start'>
              <IonCol>
                <DidSnippet did={sessionItem.did} />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
        <IonCol size='2'>
          <FollowButton>View profile</FollowButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  )
}

export default LoggedHeader

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
