import React from 'react';
import {
  IonSpinner,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonProgressBar,
  IonButton,
} from '@ionic/react';
import { ProfileContent } from 'src/pages/ProfilePage/types';
import style from './style.module.scss';
import photo from '../../assets/photo.png';
import bulb from '../../assets/bulb.svg';
import edit from '../../assets/icon-edit.svg';
import addbutton from '../../assets/addbutton.svg';
import university from '../../assets/university.png';

interface IProps {
  profile: ProfileContent;
}

const ProfileHeader: React.FC<IProps> = ({ profile }: IProps) => {
  let lastName = profile.profile.lastName || 'Keywood';
  let firstName = profile.profile.firstName || 'Adam';

  return (
    <IonGrid className={style['profileheader']}>
      <IonRow className={style['header']}>
        <IonCol size='auto'>
          <img src={photo} className={style['profile-img']} />
        </IonCol>
        <IonCol size='9'>
          <IonGrid>
            <IonRow>
              <span className={style['name']}>
                {firstName} {lastName}
              </span>
            </IonRow>
            <IonRow>
              <span className={style['details']}>Profile is ready</span>
            </IonRow>
          </IonGrid>
        </IonCol>
        <IonCol size='3'>
          <IonButton>View Profile</IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default ProfileHeader;
