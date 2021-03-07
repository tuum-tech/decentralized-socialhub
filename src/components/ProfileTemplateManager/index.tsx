import React from 'react';
import { IonContent, IonGrid, IonRow, IonCol, IonCheckbox, IonRadioGroup, IonRadio } from '@ionic/react';
import { UserVaultScripts } from 'src/scripts/uservault.script';
import { HiveService } from 'src/services/hive.service';
import { HiveClient } from '@elastos/elastos-hive-js-sdk';
import style from './style.module.scss';
import styled from 'styled-components';

const Divider = styled.hr`
width: 100%;
height: 1px;
text-align: center;
margin-top: 1.5em;
margin-bottom: 1.5em;

background-color: #f7fafc;;
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

const ProfileTemplateManager: React.FC = () => {
  const updateTemplate = async (configName: string, checked: boolean) => {
    console.log(configName + ' : ' + checked);

    // let sessionInstance = await HiveService.getSessionInstance();
    // UserVaultScripts.SetScriptGetBasicProfile(
    //   sessionInstance as HiveClient,
    //   checked
    // );
  };

  return (
    <IonContent className={style['profiletemplatemanager']}>
      {/*-- Default ProfileTemplateManager --*/}

      <IonRadioGroup value="general">

        <IonGrid>
          <IonRow className="ion-justify-content-between">
            <IonCol size="*">
              <Header3>General Profile</Header3>
              <h4> Everything displayed</h4>
            </IonCol>

            <IonCol size="2">
              <IonRadio name="general" value="general"></IonRadio>
            </IonCol>


          </IonRow>
          <Divider />
          {/* <IonRow className="ion-justify-content-between">
            <IonCol size="*">
              <Header3>Academic Profile</Header3>
              <h4>Education based</h4></IonCol>
            <IonCol size="2">
              <IonRadio name="academic">

              </IonRadio>

            </IonCol>
          </IonRow> */}

        </IonGrid>
      </IonRadioGroup>

    </IonContent>
  );
};

export default ProfileTemplateManager;
