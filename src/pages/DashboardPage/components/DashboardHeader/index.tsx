import React from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { Link } from 'react-router-dom';

import { RequestStatus } from 'src/services/assist.service';
import { ProfileName } from 'src/components/texts';
import DidSnippet from 'src/components/DidSnippet';
import { FollowButton } from 'src/components/buttons';

import PublishingLabel from '../PublishingLabel';

import style from './style.module.scss';
import photo from '../../../../assets/dp.jpeg';

interface IProps {
  profile?: ProfileDTO;
  sessionItem: ISessionItem;
  publishStatus: RequestStatus;
}

const DashboardProfileHeader: React.FC<IProps> = ({
  profile,
  sessionItem,
  publishStatus
}: IProps) => {
  const getPublicProfileLink = (): string => {
    return `/did/${sessionItem.did}`;
  };

  return (
    <IonGrid className={style['profileheader']}>
      <IonRow className={style['header']}>
        <IonCol size="auto">
          <img
            src={photo}
            className={
              publishStatus !== RequestStatus.Completed
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
                <PublishingLabel status={publishStatus} />
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
