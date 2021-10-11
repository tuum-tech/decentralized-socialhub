import React, { useEffect, useState } from 'react';
import { IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { RequestStatus } from 'src/services/assist.service';
import { ProfileService } from 'src/services/profile.service';
import { ProfileName } from 'src/elements/texts';
import DidSnippet from 'src/elements/DidSnippet';
import Avatar from 'src/components/Avatar';
import VerificatioBadge from 'src/components/VerificatioBadge';
import { getDIDString } from 'src/utils/did';

import PublishingLabel from '../PublishingLabel';

import style from './style.module.scss';

const ViewProfileButton = styled(IonButton)`
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
  width: 100%;
`;

interface IProps {
  sessionItem: ISessionItem;
  publishStatus: RequestStatus;
  profile: ProfileDTO;
}

const DashboardHeader: React.FC<IProps> = ({
  sessionItem,
  publishStatus
}: IProps) => {
  const [verifiers, setVerifiers] = useState([]);

  useEffect(() => {
    (async () => {
      if (sessionItem.name !== '') {
        const vfs = await ProfileService.getVerifiers({}, 'name', sessionItem);
        setVerifiers(vfs);
      }
    })();
  }, [sessionItem, sessionItem.name]);

  return (
    <IonGrid className={style['profileheader']}>
      <IonRow className={style['header']}>
        <IonCol size="auto">
          {sessionItem.did && sessionItem.did !== '' && (
            <Avatar
              did={sessionItem.did}
              didPublished={
                sessionItem.isDIDPublished && sessionItem.tutorialStep === 4
              }
            />
          )}
        </IonCol>
        <IonCol size="8">
          <IonGrid>
            <IonRow className={style['d-flex']}>
              <ProfileName>{sessionItem.name}</ProfileName>
              {verifiers.length > 0 && (
                <VerificatioBadge users={verifiers} userSession={sessionItem} />
              )}

              <PublishingLabel status={publishStatus} />
            </IonRow>
            <IonRow className={style['d-flex']}>
              <IonCol>
                <DidSnippet did={sessionItem.did} />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
        <IonCol size="2">
          <Link to={getDIDString('/did/' + sessionItem.did)} target="_blank">
            <ViewProfileButton>View profile</ViewProfileButton>
          </Link>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default DashboardHeader;
