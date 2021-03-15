import React, { useEffect, useState } from 'react'
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
import { ISessionItem, UserService } from 'src/services/user.service'
import {
  AssistService,
  IPublishDocumentResponse,
  RequestStatus,
} from 'src/services/assist.service'
import { stat } from 'fs'
import { DidDocumentService } from 'src/services/diddocument.service'
import { set } from 'immer/dist/common'
import { Link } from 'react-router-dom'
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
  const getLink = (): string => {
    return `/did/${sessionItem.did}`
  }
  const [publishStatus, setPublishStatus] = useState('')
  const setTimer = () => {
    const timer = setTimeout(async () => {
      await refreshStatus()
      setTimer()
    }, 1000)
    return () => clearTimeout(timer)
  }

  const refreshStatus = async () => {
    if (!sessionItem || !sessionItem.did) return

    let publishWaiting = AssistService.getPublishStatusTask(sessionItem.did)

    if (!publishWaiting) return

    let actual = await AssistService.refreshRequestStatus(
      publishWaiting.confirmationId,
      sessionItem.did
    )
    if (actual.requestStatus == RequestStatus.Completed) {
      setPublishStatus('')
      AssistService.removePublishTask(sessionItem.did)
      await updateUserToComplete()
      return
    }
    setPublishStatus(actual.requestStatus)
  }

  const updateUserToComplete = async () => {
    let userSession = UserService.GetUserSession()
    userSession.isDIDPublished = true
    UserService.updateSession(userSession)
    await DidDocumentService.reloadUserDocument()
  }

  useEffect(() => {
    ;(async () => {
      await refreshStatus()
    })()
    setTimer()
  }, [])

  return (
    <IonGrid className={style['profileheader']}>
      <IonRow className={style['header']}>
        <IonCol size='auto'>
          <img
            src={photo}
            className={
              publishStatus !== ''
                ? style['profile-img-publishing']
                : style['profile-img']
            }
            alt='profile'
          />
        </IonCol>
        <IonCol size='8'>
          <IonGrid>
            <IonRow className='ion-justify-content-start'>
              <IonCol size='auto'>
                <ProfileName>{sessionItem.name}</ProfileName>
              </IonCol>
              <IonCol>
                {publishStatus !== '' ? (
                  <PublishingLabel>{publishStatus}&nbsp;</PublishingLabel>
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
          <Link to={getLink}>
            <FollowButton>View profile</FollowButton>
          </Link>
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
