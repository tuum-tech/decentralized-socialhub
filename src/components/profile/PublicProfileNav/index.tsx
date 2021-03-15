import React, { useState } from 'react';
import { IonList, IonLabel, IonItem } from '@ionic/react';
import style from './style.module.scss';
import { ProfileDTO } from 'src/pages/PublicPage/types';

interface IProps {
  profile: ProfileDTO;
  scrollToPosition: any;
}

const PublicProfileNav: React.FC<IProps> = ({
  profile,
  scrollToPosition
}: IProps) => {
  const [active, setActive] = useState('about');

  return (
    <>
      <IonList className={style['tab-list']}>
        <IonItem
          className={
            (active == 'about' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => {
            setActive('about');
            scrollToPosition('about');
          }}
        >
          <IonLabel className={style['tab-label']}>About</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active == 'experience' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => {
            setActive('experience');
            scrollToPosition('experience');
          }}
        >
          <IonLabel className={style['tab-label']}>Experience</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active == 'education' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => {
            setActive('education');
            scrollToPosition('education');
          }}
        >
          <IonLabel className={style['tab-label']}>Education</IonLabel>
        </IonItem>
        {/* <IonItem
          className={
            (active == 'certifications' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('certifications')}
        >
          <IonLabel className={style['tab-label']}>License & Certifications</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active == 'achievements' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('achievements')}
        >
          <IonLabel className={style['tab-label']}>Achievements</IonLabel>
        </IonItem> */}
      </IonList>
      {/* <IonContent> */}
      {/* <AboutSection profile={profile} />
      <ExperienceSection profile={profile} />
      <EducationSection profile={profile} />
      <CerificationsSection />
      <AchievementsSection /> */}
      {/* </IonContent> */}
    </>
  );
};

export default PublicProfileNav;
