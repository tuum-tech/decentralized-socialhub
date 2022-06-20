import React, { useState, useEffect, useCallback } from 'react';
import { IonGrid, IonRow, IonCol, IonRadioGroup, IonRadio } from '@ionic/react';
import { RadioGroupChangeEventDetail } from '@ionic/core';
import styled from 'styled-components';

import { UserService } from 'src/services/user.service';
import { ProfileName } from 'src/elements/texts';
import Avatar from 'src/components/Avatar';
import { DidService } from 'src/services/did.service.new';
import { TemplateService } from 'src/services/template.service';
import { DefaultButton } from 'src/elements-v2/buttons';
import {
  defaultFullProfile,
  ProfileService
} from 'src/services/profile.service';
import TemplateModalContent from './Modal/TemplateModal';
import styles from './style.module.scss';
import Modal from 'src/elements-v2/Modal';
import Card from 'src/elements-v2/Card';

export const Divider = styled.hr`
  width: 100%;
  height: 1px;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;

  background-color: #f7fafc;
`;

const TemplateHeader = styled.span`
  font-family: 'Inter';
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 24px;
  letter-spacing: normal;
  text-align: left;
  color: #1f2d3d;
`;

const TemplateContent = styled.p`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;

  color: #7a7a9d;
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
  const [loading, setLoading] = useState(false);
  const [myTemplates, setMyTemplates] = useState<Template[]>([]);
  const [myGuid, setMyGuid] = useState(null);
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
        setMyTemplates(mTemplates?.templates || []);
        setMyGuid(mTemplates?.guid || null);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionItem]);

  const handleSave = useCallback(
    (tmpl: string) => {
      (async () => {
        if (sessionItem.pageTemplate !== tmpl) {
          setLoading(true);
          let userService = new UserService(await DidService.getInstance());
          const newSession = await userService.updateSession(
            {
              ...sessionItem,
              pageTemplate: tmpl
            },
            true
          );
          await updateSession({ session: newSession });
          setLoading(false);
        }
      })();
    },
    [sessionItem, updateSession]
  );

  const handleTemplateChange = useCallback(
    (e: CustomEvent<RadioGroupChangeEventDetail<any>>) => {
      setTemplate(e.detail.value);
      if (sessionItem.tutorialStep === 4) {
        handleSave(e.detail.value);
      }
    },
    [handleSave, sessionItem.tutorialStep]
  );

  const ready =
    sessionItem.onBoardingCompleted && sessionItem.tutorialStep === 4;

  return (
    <Card
      template="default"
      title="Profile Template Selection"
      description="You can choose any template you like. The template only applies to the
    public profile as seen by others. This does not apply to your profile
    on Dashboard."
      loading={loading}
    >
      <Divider />
      <IonRadioGroup value={template} onIonChange={handleTemplateChange}>
        <IonGrid>
          <IonRow>
            <IonCol size="auto">
              <Avatar did={sessionItem.did} />
            </IonCol>
            <IonCol>
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
                    <IonCol size="10">
                      <TemplateHeader>{t.title}</TemplateHeader>
                      <TemplateContent> {t.intro}</TemplateContent>
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

      <Modal
        title="Profile Templates"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        autoWidth
        noButton
      >
        <TemplateModalContent
          activeTemplate={template}
          myTemplates={myTemplates.map((t: Template) => t.value)}
          allTemplates={allTemplates}
          updateTemplates={async (newTemplateValues: string[]) => {
            const newMyTemplates = allTemplates.filter((t: Template) =>
              newTemplateValues.includes(t.value)
            );

            await TemplateService.setMyTemplates(
              sessionItem,
              newMyTemplates,
              myGuid
            );
            setMyTemplates(newMyTemplates);
          }}
        />
      </Modal>
    </Card>
  );
};

export default TemplateManagerCard;
