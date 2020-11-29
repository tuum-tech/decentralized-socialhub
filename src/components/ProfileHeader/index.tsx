import React from 'react';
import { IonSpinner, IonContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import { ProfileContent } from 'src/pages/ProfilePage/types';
import style from './style.module.scss';

interface IProps {
  profile: ProfileContent
}

const ProfileHeader: React.FC<IProps> = ({ profile }: IProps) => {

  let lastName = profile.profile.lastName.localized.fr_FR;
  let firstName = profile.profile.firstName.localized.fr_FR;

  return (
    <IonGrid className={style["profileheader"]}>
      <IonRow>
        <IonCol size="2"></IonCol>
        <IonCol size="8">
          <IonGrid>
            <IonRow><span className={style["name"]}>{firstName} {lastName}</span></IonRow>
            <IonRow><span className={"name"}>Student </span><span>@</span><span className={"name"}> University of California, USA</span></IonRow>
          </IonGrid>
        </IonCol>
        <IonCol size="2">completion</IonCol>
      </IonRow>

    </IonGrid>
  )
};

export default ProfileHeader;
