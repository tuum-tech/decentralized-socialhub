import React from 'react';
import { IonContent, IonGrid, IonRow, IonCol, IonCheckbox, IonRadioGroup, IonRadio, IonButton } from '@ionic/react';
import { UserVaultScripts } from 'src/scripts/uservault.script';
import { HiveService } from 'src/services/hive.service';
import { HiveClient } from '@elastos/elastos-hive-js-sdk';
import photo from '../../assets/dp.jpeg'

import style from './style.module.scss';
import styled from 'styled-components';
import ProfileName from '../ProfileName';
import { ISessionItem } from 'src/services/user.service';

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
  sessionItem: ISessionItem
}

const ProfileTemplateManager: React.FC<IProps> = ({ sessionItem }: IProps) => {
  const updateTemplate = async (configName: string, checked: boolean) => {
    console.log(configName + ' : ' + checked);

    // let sessionInstance = await HiveService.getSessionInstance();
    // UserVaultScripts.SetScriptGetBasicProfile(
    //   sessionInstance as HiveClient,
    //   checked
    // );
  };

  return (


    <IonRadioGroup value="general">

      <IonGrid>
        <IonRow className={style['header']}>
          <IonCol size='auto'>
            <img src={photo} className={style['profile-img']} alt='profile' />
          </IonCol>
          <IonCol size='8'>
            <IonGrid>
              <IonRow>
                <ProfileName>
                  {sessionItem.firstName} {sessionItem.lastName}
                </ProfileName>
              </IonRow>
              <IonRow>
                <ProfileStatus>
                  Profile is Ready
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
            <IonRadio name="general" value="general"></IonRadio>
          </IonCol>


        </IonRow>
        <Divider />
        <IonRow>

          <IonButton>Learn more about templates</IonButton>
        </IonRow>

      </IonGrid>
    </IonRadioGroup>

  );
};

export default ProfileTemplateManager;
