import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonText,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption
} from '@ionic/react';

import style from './style.module.scss';
import styled from 'styled-components';
import SelectInput from 'src/components/inputs/SelectInput';

import photo from 'src/assets/dp.jpeg';

const Today = styled.div``;
const Yesterday = styled.div``;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin: 10px 0px;
`;

interface Activity {
  message: string;
  timeSince: string;
}
const ActivityTimeline: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  useEffect(() => {
    let _activities = [
      {
        message: 'You received a Twitter verfication badge',
        timeSince: '23 minutes ago'
      },
      {
        message: 'You received a Twitter verfication badge',
        timeSince: '23 minutes ago'
      },
      {
        message: 'You received a Twitter verfication badge',
        timeSince: '23 minutes ago'
      },
      {
        message: 'You received a Twitter verfication badge',
        timeSince: '23 minutes ago'
      },
      {
        message: 'You received a Twitter verfication badge',
        timeSince: '23 minutes ago'
      }
    ];
    setActivities(_activities);
  }, []);
  return (
    <IonCard className={style['timeline-card']}>
      <IonCardHeader className={style['card-header']}>
        <IonCardTitle className={style['card-title']}>
          Activities Timeline
        </IonCardTitle>
        <IonText className={style['selectinput']}>
          <IonLabel className={style['selectinput_label']}>Sort by</IonLabel>
          <IonSelect
            className={style['selectinput_field']}
            placeholder="Latest"
            onIonChange={e => e}
          >
            <IonSelectOption value={0}>Latest</IonSelectOption>
            <IonSelectOption value={1}>Latest</IonSelectOption>
            <IonSelectOption value={2}>Latest</IonSelectOption>
          </IonSelect>
        </IonText>
      </IonCardHeader>
      <IonCardContent>
        <Today className={style['activity-list-wrapper']}>
          <Header>
            <IonText className={style['time']}>Today</IonText>
            <IonText className={style['mark-all']}>
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8 15.5C11.866 15.5 15 12.366 15 8.5C15 4.63401 11.866 1.5 8 1.5C4.13401 1.5 1 4.63401 1 8.5C1 12.366 4.13401 15.5 8 15.5ZM8 16.5C12.4183 16.5 16 12.9183 16 8.5C16 4.08172 12.4183 0.5 8 0.5C3.58172 0.5 0 4.08172 0 8.5C0 12.9183 3.58172 16.5 8 16.5Z"
                  fill="#4C6FFF"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.9696 5.46967C11.2625 5.17678 11.7374 5.17678 12.0303 5.46967C12.3196 5.75897 12.3231 6.22582 12.0409 6.51947L8.04873 11.5097C8.04297 11.5169 8.03682 11.5238 8.03029 11.5303C7.7374 11.8232 7.26253 11.8232 6.96963 11.5303L4.32319 8.88388C4.03029 8.59099 4.03029 8.11612 4.32319 7.82322C4.61608 7.53033 5.09095 7.53033 5.38385 7.82322L7.47737 9.91674L10.9497 5.4921C10.9559 5.48424 10.9626 5.47674 10.9696 5.46967Z"
                  fill="#4C6FFF"
                />
              </svg>
              &nbsp; Mark all as read
            </IonText>
          </Header>
          <IonList className={style['activity-list']}>
            {activities.map((activity, index) => {
              return (
                <IonItem className={style['activity-row']} key={index}>
                  <div className={style['d-vert-flex']}>
                    <div className={style['left']}>
                      <img
                        src={photo}
                        height={55}
                        alt="avatar"
                        className={style['avatar']}
                      />
                      <div className={style['activity-detail']}>
                        <p className={style['activity-text']}>
                          {activity.message}
                        </p>
                        <p className={style['activity-time-since']}>
                          {activity.timeSince}
                        </p>
                      </div>
                    </div>
                    <div className={style['right']}>
                      <svg
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M6.5 3.5C6.5 2.67157 7.17157 2 8 2C8.82843 2 9.5 2.67157 9.5 3.5C9.5 4.32843 8.82843 5 8 5C7.17157 5 6.5 4.32843 6.5 3.5ZM6.5 8.5C6.5 7.67157 7.17157 7 8 7C8.82843 7 9.5 7.67157 9.5 8.5C9.5 9.32843 8.82843 10 8 10C7.17157 10 6.5 9.32843 6.5 8.5ZM6.5 13.5C6.5 12.6716 7.17157 12 8 12C8.82843 12 9.5 12.6716 9.5 13.5C9.5 14.3284 8.82843 15 8 15C7.17157 15 6.5 14.3284 6.5 13.5Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                  </div>
                </IonItem>
              );
            })}
          </IonList>
        </Today>
        <Yesterday className={style['activity-list-wrapper']}>
          <Header>
            <IonText className={style['time']}>Yesterday</IonText>
          </Header>
          <IonList className={style['activity-list']}>
            {activities.map((activity, index) => {
              return (
                <IonItem className={style['activity-row']} key={index}>
                  <div className={style['d-vert-flex']}>
                    <div className={style['left']}>
                      <img
                        src={photo}
                        height={55}
                        alt="avatar"
                        className={style['avatar']}
                      />
                      <div className={style['activity-detail']}>
                        <p className={style['activity-text']}>
                          {activity.message}
                        </p>
                        <p className={style['activity-time-since']}>
                          {activity.timeSince}
                        </p>
                      </div>
                    </div>
                    <div className={style['right']}>
                      <svg
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="black"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M6.5 3.5C6.5 2.67157 7.17157 2 8 2C8.82843 2 9.5 2.67157 9.5 3.5C9.5 4.32843 8.82843 5 8 5C7.17157 5 6.5 4.32843 6.5 3.5ZM6.5 8.5C6.5 7.67157 7.17157 7 8 7C8.82843 7 9.5 7.67157 9.5 8.5C9.5 9.32843 8.82843 10 8 10C7.17157 10 6.5 9.32843 6.5 8.5ZM6.5 13.5C6.5 12.6716 7.17157 12 8 12C8.82843 12 9.5 12.6716 9.5 13.5C9.5 14.3284 8.82843 15 8 15C7.17157 15 6.5 14.3284 6.5 13.5Z"
                          stroke="black"
                        />
                      </svg>
                    </div>
                  </div>
                </IonItem>
              );
            })}
          </IonList>
        </Yesterday>
      </IonCardContent>
    </IonCard>
  );
};

export default ActivityTimeline;
