import React, { useEffect, useState } from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { useBreakpoint } from 'styled-breakpoints/react-styled';
import { down } from 'styled-breakpoints';

import { RequestStatus } from 'src/services/assist.service';
import { ProfileName } from 'src/elements/texts';
import DidSnippet from 'src/elements/DidSnippet';
import Avatar from 'src/components/Avatar';
import VerificatioBadge from 'src/components/VerificatioBadge';
import { getDIDString } from 'src/utils/did';

import PublishingLabel from '../PublishingLabel';

import { useRecoilValue } from 'recoil';
import { FullProfileAtom } from 'src/Atoms/Atoms';
import { DefaultButton, LinkButton } from 'src/elements-v2/buttons';

import style from './style.module.scss';

interface IProps {
  sessionItem: ISessionItem;
  publishStatus: RequestStatus;
}

const DashboardHeader: React.FC<IProps> = ({
  sessionItem,
  publishStatus
}: IProps) => {
  const [verifiers, setVerifiers] = useState([{ name: '', did: '' }]);
  const isSmDown = useBreakpoint(down('sm'));
  const profile = useRecoilValue(FullProfileAtom);

  useEffect(() => {
    (async () => {
      if (sessionItem.name !== '') {
        setVerifiers(profile.name.verifiers);
      }
    })();
  }, [profile, sessionItem.name]);

  return (
    <IonGrid className={style['profileheader']}>
      <IonRow className={style['header']}>
        <IonCol size="auto">
          {sessionItem.did && (
            <Avatar
              did={sessionItem.did}
              didPublished={
                sessionItem.isDIDPublished && sessionItem.onBoardingCompleted
              }
            />
          )}
        </IonCol>
        <IonCol>
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
                <DidSnippet
                  did={sessionItem.did}
                  dateJoined={sessionItem.timestamp}
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
        <IonCol size="auto">
          <DefaultButton
            variant="contained"
            btnColor="secondary-gradient"
            textType="gradient"
            size="large"
            onClick={() => {
              navigator.clipboard.writeText(
                `${process.env.REACT_APP_PROFILE_LANDING_PAGE}/create-profile?ref=${sessionItem.did}`
              );
            }}
          >
            Copy Referral Link
          </DefaultButton>
        </IonCol>
        <IonCol size="auto">
          <LinkButton
            variant={isSmDown ? 'text' : 'contained'}
            btnColor="primary-gradient"
            icon={isSmDown ? null : 'open-outline'}
            size="large"
            textType={isSmDown ? 'gradient' : 'normal'}
            href={getDIDString('/did/' + sessionItem.did)}
            target="_blank"
          >
            View Profile
          </LinkButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default DashboardHeader;
