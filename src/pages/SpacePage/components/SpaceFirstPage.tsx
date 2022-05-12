import React from 'react';
import { IonCard, IonCardContent, IonRow, IonImg, IonText } from '@ionic/react';
import { LinkButton } from 'src/elements-v2/buttons';
import style from './SpaceFirstPage.module.scss';
import SpacesSvg from 'src/assets/icon/spaces.svg';

const SpaceFirstPage: React.FC = () => (
  <IonCard className={style['create-space-card']}>
    <IonCardContent className={style['card-content']}>
      <IonRow>
        <IonImg src={SpacesSvg}></IonImg>
      </IonRow>
      <IonRow>
        <IonText>
          <h3>Your Community Pages</h3>
        </IonText>
      </IonRow>
      <IonRow>
        <IonText className="ion-margin-bottom">
          <h4>You dont have any pages yet.</h4>
        </IonText>
      </IonRow>
      <IonRow>
        <LinkButton
          variant="contained"
          btnColor="primary-gradient"
          href="/spaces/create"
        >
          Create your First Space
        </LinkButton>
      </IonRow>
    </IonCardContent>
  </IonCard>
);

export default SpaceFirstPage;
