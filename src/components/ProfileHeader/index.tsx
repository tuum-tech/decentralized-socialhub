import React from 'react';
import { IonSpinner, IonContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import { ProfileContent } from 'src/pages/ProfilePage/types';
import style from './style.module.scss';
import chagastelles from '../../theme/images/chagastelles.jpeg'

interface IProps {
  profile: ProfileContent
}

const ProfileHeader: React.FC<IProps> = ({ profile }: IProps) => {

  let lastName = profile.profile.lastName.localized.fr_FR;
  let firstName = profile.profile.firstName.localized.fr_FR;

  return (
    <IonGrid className={style["profileheader"]}>
      <IonRow className={style["header"]}>
        <IonCol size="1.5">
          <img src={chagastelles} className={style["profile-img"]} />
        </IonCol>
        <IonCol size="8.5">
          <IonGrid>
            <IonRow><span className={style["name"]}>{firstName} {lastName}</span></IonRow>
            <IonRow><span className={style["details"]}>Student </span><span> - </span><span className={"name"}> University of California, USA</span></IonRow>
          </IonGrid>
        </IonCol>
        <IonCol size="2">completion</IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <div className={style["tip"]}>
            <IonGrid>
              <IonRow>
                <IonCol size="1"></IonCol>
                <IonCol size="9">
                  Recommendation: Connect your DID and publish it to Blockchain
                </IonCol>
                <IonCol size="2" className={style["action"]}>Start Service ></IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol><h2>About</h2></IonCol>
      </IonRow>
      <IonRow>
        <IonCol><p>
          Experienced Chief Technology Officer with a demonstrated history of working in the financial services industry. Skilled in PHP, Android Development, HTML, Cascading Style Sheets (CSS), and Microsoft PowerPoint. Strong information technology
          professional with a Bachelor’s degree focused in Computer Software Engineering from University of Management and Technology - UMT.
          </p></IonCol>
      </IonRow>

    </IonGrid>
  )
};

export default ProfileHeader;
