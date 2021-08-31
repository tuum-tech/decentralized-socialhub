import React from 'react';
import {
  IonCardTitle,
  IonCardHeader,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonRadioGroup,
  IonRadio,
  IonButton
} from '@ionic/react';
import styled from 'styled-components';

import { UserService } from 'src/services/user.service';
import { ProfileName } from 'src/elements/texts';
import Avatar from 'src/components/Avatar';
import styleWidget from 'src/components/cards/WidgetCards.module.scss';
import { DidService } from 'src/services/did.service.new';

export const Divider = styled.hr`
  width: 100%;
  height: 1px;
  text-align: center;
  margin-top: 1.5em;
  margin-bottom: 1.5em;

  background-color: #f7fafc;
`;

const Header3 = styled.span`
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  text-align: left;
  color: #1f2d3d;
`;

const ProfileStatus = styled.span`
  font-family: 'SF Pro Display';
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.62;
  letter-spacing: normal;
  text-align: left;
  color: #4c6fff;
`;

interface IProps {
  sessionItem: ISessionItem;
  updateSession: (props: { session: ISessionItem }) => void;
}

const TemplateManagerCard: React.FC<IProps> = ({
  sessionItem,
  updateSession
}: IProps) => {
  return (
    <IonCard className={styleWidget['overview']}>
      <IonCardHeader>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCardTitle>Profile Template Selection</IonCardTitle>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>
      <IonCardContent>
        <IonText>
          You can choose any template you like. The template only applies to the
          public profile as seen by others. This does not apply to your profile
          on Dashboard.
        </IonText>
        <Divider />
        <IonRadioGroup
          value={sessionItem.pageTemplate || 'default'}
          onIonChange={async e => {
            const newSelected = e.detail.value;
            if (!newSelected || newSelected === sessionItem.pageTemplate) {
              return;
            }
            let userService = new UserService(await DidService.getInstance());
            const newSession = await userService.updateSession(
              {
                ...sessionItem,
                pageTemplate: e.detail.value
              },
              true
            );
            await updateSession({ session: newSession });
          }}
        >
          <IonGrid>
            <IonRow>
              <IonCol size="auto">
                <Avatar did={sessionItem.did} />
              </IonCol>
              <IonCol size="8">
                <IonGrid>
                  <IonRow>
                    <ProfileName>{sessionItem.name}</ProfileName>
                  </IonRow>
                  <IonRow>
                    <ProfileStatus>
                      Profile is{' '}
                      {sessionItem.onBoardingCompleted &&
                      sessionItem.tutorialStep === 4
                        ? 'ready'
                        : 'not yet ready'}
                    </ProfileStatus>
                  </IonRow>
                </IonGrid>
              </IonCol>
            </IonRow>
            <Divider />

            <IonRow className="ion-justify-content-between">
              <IonCol size="*">
                <Header3>General Profile</Header3>
                <h4> Everything displayed</h4>
              </IonCol>

              <IonCol size="2">
                <IonRadio value="default"></IonRadio>
              </IonCol>
            </IonRow>
            <Divider />

            <IonRow className="ion-justify-content-between">
              <IonCol size="*">
                <Header3>Academic Profile</Header3>
                <h4> Education based</h4>
              </IonCol>

              <IonCol size="2">
                <IonRadio value="academic"></IonRadio>
              </IonCol>
            </IonRow>
            <Divider />

            <IonRow>
              <IonButton>Learn more about templates</IonButton>
            </IonRow>
          </IonGrid>
        </IonRadioGroup>
      </IonCardContent>
    </IonCard>
  );
};

export default TemplateManagerCard;
