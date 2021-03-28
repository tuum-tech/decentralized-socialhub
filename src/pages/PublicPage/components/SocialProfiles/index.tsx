import React from 'react';
import {
  IonCardHeader,
  IonCardTitle,
  IonCard,
  IonCardContent,
  IonGrid,
  IonCol,
  IonRow
} from '@ionic/react';
import styled from 'styled-components';

import style from 'src/components/cards/WidgetCards.module.scss';

import facebook from '../../../../assets/icon/Facebook.svg';
import twitter from '../../../../assets/icon/Twitter.svg';
import google from '../../../../assets/icon/Google.svg';
import linkedin from '../../../../assets/icon/Linkedin.svg';

const FacebookIcon: React.FC = () => {
  const FacebookImageTag = styled.img`
    width: 18px;
    height: 18px;
  `;

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="auto">
          <FacebookImageTag src={facebook} alt="facebook icon" />
        </IonCol>
        <IonCol size="*">Facebook</IonCol>
      </IonRow>
    </IonGrid>
  );
};

const TwitterIcon: React.FC = () => {
  const TwitterImageTag = styled.img`
    width: 18px;
    height: 18px;
  `;

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="auto">
          <TwitterImageTag src={twitter} alt="twitter icon" />
        </IonCol>
        <IonCol size="*">Twitter</IonCol>
      </IonRow>
    </IonGrid>
  );
};

const GoogleIcon: React.FC = () => {
  const GoogleImageTag = styled.img`
    width: 18px;
    height: 18px;
  `;

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="auto">
          <GoogleImageTag src={google} alt="google icon" />
        </IonCol>
        <IonCol size="*">Google</IonCol>
      </IonRow>
    </IonGrid>
  );
};

const LinkedinIcon: React.FC = () => {
  const LinkedinImageTag = styled.img`
    width: 18px;
    height: 18px;
  `;

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="auto">
          <LinkedinImageTag src={linkedin} alt="linkedin icon" />
        </IonCol>
        <IonCol size="*">Linkedin</IonCol>
      </IonRow>
    </IonGrid>
  );
};

const SocialProfiles: React.FC = () => {
  return (
    <IonCard className={style['overview']}>
      <IonCardHeader>
        <IonCardTitle>Social Profiles</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <FacebookIcon />{' '}
            </IonCol>
            <IonCol size="6">
              <TwitterIcon />
            </IonCol>
            <IonCol size="6">
              <GoogleIcon />
            </IonCol>
            <IonCol size="6">
              <LinkedinIcon />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

export default SocialProfiles;
