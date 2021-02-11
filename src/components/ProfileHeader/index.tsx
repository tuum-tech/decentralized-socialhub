import React from 'react';
import { IonGrid, IonRow, IonCol, IonProgressBar } from '@ionic/react';
import { ProfileContent } from 'src/pages/ProfilePage/types';
import style from './style.module.scss';
// import photo from '../../assets/photo.png';
import photo from '../../assets/dp.jpeg';
import bulb from '../../assets/bulb.svg';
import edit from '../../assets/icon-edit.svg';
import addbutton from '../../assets/addbutton.svg';
import university from '../../assets/university.png';
import ButtonWithUpArrow from 'src/elements/buttons/ButtonWithUpArrow';

interface IProps {
  profile: ProfileContent;
}

const ProfileHeader: React.FC<IProps> = ({ profile }: IProps) => {
  let lastName = profile.profile.lastName || 'Keywood';
  let firstName = profile.profile.firstName || 'Adam';

  return (
    <IonGrid className={style["profileheader"]}>
      <IonRow className={style["header"]}>
        <IonCol size="auto">
          <img src={photo} className={style["profile-img"]} alt="profile" />
        </IonCol>
        <IonCol size='8'>
          <IonGrid>
            <IonRow>
              <h2>
                {firstName} {lastName}
              </h2>
              {/* <span className={style['name']}>
                {firstName} {lastName}
              </span> */}
            </IonRow>
            <IonRow>
              <span className={style['details']}>Profile is ready</span>
            </IonRow>
          </IonGrid>
        </IonCol>
        <IonCol size="2">
          <img src={edit} alt="edit" />
          <IonProgressBar value={0.78}></IonProgressBar>
          <span className={style["percent-completed-verified"]}>85% verified</span>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <div className={style["tip"]}>
            <IonGrid>
              <IonRow>
                <IonCol size="auto">
                  <img src={bulb} alt="bulb" />
                </IonCol>
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
      <IonRow className={style["header"]}>
        <IonCol><p>
          Experienced Chief Technology Officer with a demonstrated history of working in the financial services industry. Skilled in PHP, Android Development, HTML, Cascading Style Sheets (CSS), and Microsoft PowerPoint. Strong information technology
          professional with a Bachelor’s degree focused in Computer Software Engineering from University of Management and Technology - UMT.
          </p></IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="8"><h2>Education</h2></IonCol>
        <IonCol size="2"><span className={style["addbutton"]}> <img src={addbutton} alt="add" />Add new</span></IonCol>
        <IonCol size="2">
          <img src={edit} alt="edit" />
          <IonProgressBar value={0.78}></IonProgressBar>
          <span className={style["percent-completed-verified"]}>85% verified</span>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="auto"><img src={university} alt="university" /></IonCol>
        <IonCol size="4" className={style["title-university"]}>University of Management and Technology - UMT</IonCol>


      </IonRow>

    </IonGrid>
  );
};

export default ProfileHeader;
