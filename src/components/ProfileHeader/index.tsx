import React from 'react';
import { IonSpinner, IonContent, IonGrid, IonRow, IonCol } from '@ionic/react';

const ProfileHeader: React.FC = () => {
  return (
    <IonGrid className={"profileheader"}>
      <IonRow>
        <IonCol size="2"></IonCol>
        <IonCol size="8">
          <IonGrid>
            <IonRow><span className={"name"}>Sarah</span></IonRow>
            <IonRow><span className={"name"}>Student</span><span className={"name"}>University of California, USA</span></IonRow>
          </IonGrid>
        </IonCol>
        <IonCol size="2">completion</IonCol>
      </IonRow>

    </IonGrid>
  )
};

export default ProfileHeader;
