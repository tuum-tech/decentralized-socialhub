import React, { useState, useEffect, useCallback } from 'react';
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
  IonRadio
} from '@ionic/react';
import styled from 'styled-components';

import { UserService } from 'src/services/user.service';
import { ProfileName } from 'src/elements/texts';
import Avatar from 'src/components/Avatar';
import styleWidget from 'src/components/cards/WidgetCards.module.scss';
import { DidService } from 'src/services/did.service.new';
import { TemplateService } from 'src/services/template.service';
import { DefaultButton } from 'src/elements-v2/buttons';
import {
  defaultFullProfile,
  ProfileService
} from 'src/services/profile.service';
import TemplateModalContent, { TemplateModal } from './Modal/TemplateModal';
import styles from './style.module.scss';

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

const ProfileStatus = styled.span<{ ready: boolean }>`
  font-family: 'SF Pro Display';
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.62;
  letter-spacing: normal;
  text-align: left;
  ${props =>
    props.ready
      ? `-webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        background: ${styles['primary-gradient']};`
      : 'color: var(--ion-color-danger)'};
`;

const allTemplates = TemplateService.getAllTemplates();

interface PageProps {
  sessionItem: ISessionItem;
  updateSession: (props: { session: ISessionItem }) => void;
}

const TemplateManagerCard: React.FC<PageProps> = ({
  sessionItem,
  updateSession
}: PageProps) => {
  const [myTemplates, setMyTemplates] = useState<Template[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [template, setTemplate] = useState(
    sessionItem.pageTemplate || 'default'
  );

  useEffect(() => {
    (async () => {
      if (sessionItem && sessionItem.did && sessionItem.tutorialStep === 4) {
        const mTemplates = await TemplateService.getMyTemplates(
          sessionItem.did
        );
        setMyTemplates(mTemplates);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionItem]);

  const handleSave = useCallback(() => {
    (async () => {
      if (sessionItem.pageTemplate !== template) {
        let userService = new UserService(await DidService.getInstance());
        const newSession = await userService.updateSession(
          {
            ...sessionItem,
            pageTemplate: template
          },
          true
        );
        await updateSession({ session: newSession });
      }
    })();
  }, [sessionItem, template, updateSession]);
  const ready =
    sessionItem.onBoardingCompleted && sessionItem.tutorialStep === 4;

  return (
    <IonCard className={styleWidget['overview']}>
      <IonCardHeader>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCardTitle>Profile Template Selection</IonCardTitle>
            </IonCol>
            <IonCol size="auto" className="ion-no-padding">
              <DefaultButton
                size="small"
                variant="outlined"
                btnColor="primary-gradient"
                textType="gradient"
                disabled={sessionItem.tutorialStep !== 4}
                onClick={handleSave}
              >
                Save
              </DefaultButton>
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
          value={template}
          onIonChange={e => {
            setTemplate(e.detail.value);
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
                    <ProfileStatus ready={ready}>
                      Profile is {ready ? 'ready' : 'not yet ready'}
                    </ProfileStatus>
                  </IonRow>
                </IonGrid>
              </IonCol>
            </IonRow>
            <Divider />

            {[
              {
                value: 'default',
                title: 'General',
                intro: 'Anything and Everything'
              }
            ]
              .concat(myTemplates)
              .map((t: Template) => {
                return (
                  <div key={t.value}>
                    <IonRow className="ion-justify-content-between">
                      <IonCol size="*">
                        <Header3>{t.title}</Header3>
                        <h4> {t.intro}</h4>
                      </IonCol>

                      <IonCol size="2">
                        <IonRadio value={t.value}></IonRadio>
                      </IonCol>
                    </IonRow>
                    <Divider />
                  </div>
                );
              })}

            <IonRow>
              <DefaultButton
                variant="outlined"
                btnColor="primary-gradient"
                textType="gradient"
                size="large"
                onClick={() => setShowModal(true)}
                style={{ width: '100%' }}
              >
                + Add New Template
              </DefaultButton>
            </IonRow>
          </IonGrid>
        </IonRadioGroup>
      </IonCardContent>

      <TemplateModal
        isOpen={showModal}
        cssClass="my-custom-class"
        onDidDismiss={() => setShowModal(false)}
      >
        <TemplateModalContent
          activeTemplate={template}
          myTemplates={myTemplates.map((t: Template) => t.value)}
          allTemplates={allTemplates}
          updateTemplates={async (newTemplateValues: string[]) => {
            const newMyTemplates = allTemplates.filter((t: Template) =>
              newTemplateValues.includes(t.value)
            );

            await TemplateService.setMyTemplates(sessionItem, newMyTemplates);
            setMyTemplates(newMyTemplates);
          }}
        />
      </TemplateModal>
    </IonCard>
  );
};

export default TemplateManagerCard;
