import React, { useState, useEffect } from 'react';
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

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectMyTemplates } from 'src/store/templates/selectors';
import { setMyTemplates } from 'src/store/templates/actions';
import { InferMappedProps, SubState } from './types';

import { SmallLightButton } from 'src/elements/buttons';
import { UserService } from 'src/services/user.service';
import { ProfileName } from 'src/elements/texts';
import Avatar from 'src/components/Avatar';
import styleWidget from 'src/components/cards/WidgetCards.module.scss';
import { DidService } from 'src/services/did.service.new';
import { allTemplates } from 'src/data/theme';

import TemplateModalContent, { TemplateModal } from './Modal/TemplateModal';

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

const AddNewTemplateButton = styled.div`
  border: 1px solid #4c6fff;
  box-sizing: border-box;
  border-radius: 8px;
  width: 100%;
  padding: 16px;
  background: white;

  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 14px;
  color: #4c6fff;

  text-align: center;

  cursor: pointer;
`;

interface PageProps extends InferMappedProps {
  sessionItem: ISessionItem;
  updateSession: (props: { session: ISessionItem }) => void;
}

const TemplateManagerCard: React.FC<PageProps> = ({
  eProps,
  ...props
}: PageProps) => {
  const { sessionItem, updateSession, myTemplates } = props;
  const [showModal, setShowModal] = useState(false);
  const [template, setTemplate] = useState(
    sessionItem.pageTemplate || 'default'
  );

  return (
    <IonCard className={styleWidget['overview']}>
      <IonCardHeader>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCardTitle>Profile Template Selection</IonCardTitle>
            </IonCol>
            <IonCol size="auto" className="ion-no-padding">
              <SmallLightButton
                onClick={async () => {
                  if (sessionItem.pageTemplate !== template) {
                    let userService = new UserService(
                      await DidService.getInstance()
                    );
                    const newSession = await userService.updateSession(
                      {
                        ...sessionItem,
                        pageTemplate: template
                      },
                      true
                    );
                    await updateSession({ session: newSession });
                  }
                }}
              >
                Save
              </SmallLightButton>
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
            console.log('====>onIonChange', e.detail.value);
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

            {[
              {
                value: 'default',
                title: 'General Profile',
                intro: 'Everything displayed'
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
              <AddNewTemplateButton onClick={() => setShowModal(true)}>
                + Add New Template
              </AddNewTemplateButton>
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
          updateTemplates={(newTemplateValues: string[]) => {
            const newMyTemplates = allTemplates.filter((t: Template) =>
              newTemplateValues.includes(t.value)
            );
            eProps.setMyTemplates({
              myTemplates: newMyTemplates
            });
          }}
        />
      </TemplateModal>
    </IonCard>
  );
};

export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  myTemplates: makeSelectMyTemplates()
});

export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      setMyTemplates: (props: { myTemplates: Template[] }) =>
        dispatch(setMyTemplates(props))
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplateManagerCard);
