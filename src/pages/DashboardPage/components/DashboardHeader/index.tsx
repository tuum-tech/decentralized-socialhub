import React, { useEffect, useState } from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { Link } from 'react-router-dom';

import { getVerifiedCredential } from 'src/utils/credential';
import { RequestStatus } from 'src/services/assist.service';
import { ProfileName } from 'src/components/texts';
import DidSnippet from 'src/components/DidSnippet';
import { FollowButton } from 'src/components/buttons';
import Avatar from 'src/components/Avatar';

import PublishingLabel from '../PublishingLabel';

import style from './style.module.scss';
import shieldIcon from '../../../../assets/icon/shield.svg';
import { DidDocumentService } from 'src/services/diddocument.service';

interface IProps {
  sessionItem: ISessionItem;
  publishStatus: RequestStatus;
}

const DashboardHeader: React.FC<IProps> = ({
  sessionItem,
  publishStatus
}: IProps) => {
  const getPublicProfileLink = (): string => {
    return `/did/${sessionItem.did}`;
  };

  //Verification Shield code starts
  const [isNameVerified, setIsNameVerified] = useState(false);
  const [didDocument, setDidDocument] = useState({});

  useEffect(() => {
    (async () => {
      if (sessionItem.name !== '') {
        const documentState = await DidDocumentService.getUserDocument(
          sessionItem
        );
        setDidDocument(documentState.diddocument);
      }
    })();
  }, [sessionItem.name]);

  useEffect(() => {
    (async () => {
      setIsNameVerified(await isCredVerified('name', sessionItem.name));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [didDocument, sessionItem.name]);

  const isCredVerified = async (key: string, profileValue: string) => {
    let vc = getVerifiedCredential(key, didDocument);
    if (!vc) return false;

    return vc.value === profileValue && vc.isVerified;
  };
  //Verification Shield code ends

  return (
    <IonGrid className={style['profileheader']}>
      <IonRow className={style['header']}>
        <IonCol size="auto">
          {sessionItem.did && sessionItem.did !== '' && (
            <Avatar did={sessionItem.did} />
          )}
        </IonCol>
        <IonCol size="8">
          <IonGrid>
            <IonRow className={style['d-flex']}>
              <ProfileName>{sessionItem.name}</ProfileName>
              {isNameVerified && (
                <img
                  alt="shield icon"
                  src={shieldIcon}
                  className={style['social-profile-badge']}
                />
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

export default DashboardHeader;
