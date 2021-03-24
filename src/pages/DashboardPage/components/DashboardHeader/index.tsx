import React, { useEffect, useState } from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { UserService } from 'src/services/user.service';
import { AssistService, RequestStatus } from 'src/services/assist.service';
import { DidDocumentService } from 'src/services/diddocument.service';
import { ProfileName } from 'src/components/texts';
import DidSnippet from 'src/components/DidSnippet';
import { FollowButton } from 'src/components/buttons';

import style from './style.module.scss';
import photo from '../../../../assets/dp.jpeg';

interface IProps {
  profile?: ProfileDTO;
  sessionItem: ISessionItem;
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
`;

const DashboardProfileHeader: React.FC<IProps> = ({
  profile,
  sessionItem
}: IProps) => {
  const getPublicProfileLink = (): string => {
    return `/did/${sessionItem.did}`;
  };
  const [publishStatus, setPublishStatus] = useState('');
  const setTimer = () => {
    const timer = setTimeout(async () => {
      await refreshStatus();
      setTimer();
    }, 1000);
    return () => clearTimeout(timer);
  };

  const refreshStatus = async () => {
    if (!sessionItem || !sessionItem.did) return;

    let publishWaiting = AssistService.getPublishStatusTask(sessionItem.did);

    if (!publishWaiting) return;

    let actual = await AssistService.refreshRequestStatus(
      publishWaiting.confirmationId,
      sessionItem.did
    );
    if (actual.requestStatus === RequestStatus.Completed) {
      setPublishStatus('');
      AssistService.removePublishTask(sessionItem.did);
      await updateUserToComplete();
      return;
    }
    setPublishStatus(actual.requestStatus);
  };

  const updateUserToComplete = async () => {
    let userSession = UserService.GetUserSession();
    if (userSession) {
      userSession.isDIDPublished = true;
      UserService.updateSession(userSession);
      await DidDocumentService.reloadUserDocument();
    }
  };

  useEffect(() => {
    (async () => {
      await refreshStatus();
    })();
    setTimer();
  }, [sessionItem]);

  return (
    <IonGrid className={style['profileheader']}>
      <IonRow className={style['header']}>
        <IonCol size="auto">
          <img
            src={photo}
            className={
              publishStatus !== ''
                ? style['profile-img-publishing']
                : style['profile-img']
            }
            alt="profile"
          />
        </IonCol>
        <IonCol size="8">
          <IonGrid>
            <IonRow className="ion-justify-content-start">
              <IonCol size="auto">
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
            <IonRow className="ion-justify-content-start">
              <IonCol>
                <DidSnippet did={sessionItem.did} />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
        <IonCol size="2">
          <Link
            to={getPublicProfileLink}
            target="_blank"
            onClick={event => {
              event.preventDefault();
              window.open(getPublicProfileLink());
            }}
          >
            <FollowButton>View profile</FollowButton>
          </Link>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default DashboardProfileHeader;
