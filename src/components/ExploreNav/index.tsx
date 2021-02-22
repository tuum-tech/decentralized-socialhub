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
import DidCard from '../cards/DidCard';
// import SpotlightCard from 'src/components/cards/SpotlightCard';
// import BadgesCard from 'src/components/cards/BadgesCard';
// import OverviewCard from 'src/components/cards/OverviewCard';
// import ButtonWhite from 'src/components/buttons/ButtonWhite';

// const DashboardHome: React.FC = () => {
//   return (
//     <IonGrid className={style['tab-grid']}>
//       <IonRow>
//         <IonCol size='4'>
//           <SpotlightCard
//             title='Welcome to Profile'
//             content='To get you familiar with the platform you can start our tutorial which
//         will go through some basics. You will receive a badge for completing it.'
//             component={<ButtonWhite>Start beginners tutorial</ButtonWhite>}
//           />
//           <BadgesCard title='Badges' />
//         </IonCol>
//         <IonCol size='8'>
//           <OverviewCard />
//         </IonCol>
//       </IonRow>
//     </IonGrid>
//   );
// };

// const DashboardStatus: React.FC = () => {
//   return (
//     <IonGrid className={style['tab-grid']}>
//       <IonRow>
//         <IonCol size='4'>
//           <SpotlightCard
//             title='Overview'
//             content='Your profile is ready. There are no pending transactions.'
//           />
//         </IonCol>
//         <IonCol size='8'>
//           <OverviewCard />
//         </IonCol>
//       </IonRow>
//     </IonGrid>
//   );
// };

const People: React.FC<Props> = ({ size = '12' }) => {
  return (
    <IonCol size={size}>
      <IonCard className={style['did']}>
        <IonCardHeader>
          <IonCardTitle className={style['card-title']}>People</IonCardTitle>
        </IonCardHeader>
        <DidCard
          name='Waqas Ahmed'
          did='1sdf87sdf87sdf87'
          avatar='https://media-exp1.licdn.com/dms/image/C5103AQGAj2dZpTgHrw/profile-displayphoto-shrink_100_100/0/1517341859509?e=1619654400&v=beta&t=fVEIup7pmT6pvNkCyAgqHDUUcByq-iuUGBq25TYulGc'
        />
        <DidCard
          name='Faizan Atiq'
          did='1sdf87sdf87sdf88'
          avatar='https://media-exp1.licdn.com/dms/image/C4D03AQHJrVWT1os_uQ/profile-displayphoto-shrink_100_100/0/1613330591466?e=1619654400&v=beta&t=oE-BJ4-vYiefNuEYQTaKeVDaJWh8coNOUypjIwHoY2s'
        />
      </IonCard>
    </IonCol>
  );
};

const Pages: React.FC<Props> = ({ size = '12' }) => {
  return (
    <IonCol size={size}>
      <IonCard className={style['did']}>
        <IonCardHeader>
          <IonCardTitle className={style['card-title']}>Pages</IonCardTitle>
        </IonCardHeader>
        <DidCard name='Waqas Ahmed' did='1sdf87sdf87sdf87' avatar='' />
        <DidCard name='Faizan Atiq' did='1sdf87sdf87sdf88' avatar='' />
      </IonCard>
    </IonCol>
  );
};

interface Props {
  tab?: string;
  size?: string;
}

const ExploreNav: React.FC<Props> = ({ tab = 'all' }) => {
  const [active, setActive] = useState(tab);

  return (
    <IonContent className={style['explorenav']}>
      <IonList className={style['tab-list']}>
        <IonItem
          className={
            (active == 'all' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('all')}
        >
          <IonLabel className={style['tab-label']}>All</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active == 'people' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('people')}
        >
          <IonLabel className={style['tab-label']}>People</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active == 'pages' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('pages')}
        >
          <IonLabel className={style['tab-label']}>Pages</IonLabel>
        </IonItem>
      </IonList>
      {active == 'all' && (
        <IonGrid className={style['tab-grid']}>
          <IonRow>
            <People size='6' />
            <Pages size='6' />
          </IonRow>
        </IonGrid>
      )}
      {active == 'people' && (
        <IonGrid className={style['tab-grid']}>
          <IonRow>
            <People />
          </IonRow>
        </IonGrid>
      )}
      {active == 'pages' && (
        <IonGrid className={style['tab-grid']}>
          <IonRow>
            <Pages />
          </IonRow>
        </IonGrid>
      )}
    </IonContent>
  );
};

export default ExploreNav;
