import React, { useState } from 'react';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonContent,
  IonSpinner,
  IonList,
  IonLabel,
  IonItem,
  IonCol,
  IonGrid,
  IonRow,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonButton,
} from '@ionic/react';
import style from './style.module.scss';
import SpotlightCard from 'src/components/cards/SpotlightCard';
import BadgesCard from 'src/components/cards/BadgesCard';
import OverviewCard from 'src/components/cards/OverviewCard';
import ButtonWhite from 'src/components/buttons/ButtonWhite';
import AboutCard from '../cards/AboutCard';
import ExperienceCard from '../cards/ExperienceCard';
import EducationCard from '../cards/EducationCard';
import { EducationItem, ExperienceItem, ProfileDTO } from 'src/pages/PublicPage/types';


interface IProps {
  profile: ProfileDTO;
}

const PublicProfileNav: React.FC<IProps> = ({ profile }: IProps) => {
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
          onClick={() => { setActive('about'); window.location.hash = "education" }}
        >
          <IonLabel className={style['tab-label']}>About</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active == 'experience' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('experience')}
        >
          <IonLabel className={style['tab-label']}>Experience</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active == 'education' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('education')}
        >
          <IonLabel className={style['tab-label']}>Education</IonLabel>
        </IonItem>
        <IonItem
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
        </IonItem>
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


