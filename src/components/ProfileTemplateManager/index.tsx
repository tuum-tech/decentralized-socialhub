import React from 'react';
import { IonSpinner, IonContent, IonGrid, IonRow, IonCol, IonCheckbox } from '@ionic/react';
import { ProfileService } from 'src/services/profile.service';
import { UserVaultScripts } from 'src/scripts/uservault.script';
import { HiveService } from 'src/services/hive.service';


const ProfileTemplateManager: React.FC = () => {

  const updateTemplate = async (configName: string, checked: boolean) => {
    console.log(configName + " : " + checked);

    UserVaultScripts.SetScriptGetBasicProfile(await HiveService.getSessionInstance(), checked)
  }

  return (
    <IonContent className={"profiletemplatemanager"}>
      {/*-- Default ProfileTemplateManager --*/}

      <h1>Template Manager</h1>
      <IonGrid>
        <IonRow>
          <IonCol>
            Basic Profile
          </IonCol>
          <IonCheckbox value="basic" onClick={(e) => updateTemplate(e.currentTarget.value, e.currentTarget.checked)}>

          </IonCheckbox>
        </IonRow>
        <IonRow>
          <IonCol>
            Education Profile
          </IonCol>
          <IonCheckbox value="education" onClick={(e) => updateTemplate(e.currentTarget.value, e.currentTarget.checked)}>

          </IonCheckbox>
        </IonRow>s
      </IonGrid>
    </IonContent>
  )
};

export default ProfileTemplateManager;
