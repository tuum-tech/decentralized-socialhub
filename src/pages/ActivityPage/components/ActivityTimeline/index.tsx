import React from 'react';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonSelect,
  IonText,
  IonList,
  IonItem
} from '@ionic/react';

import style from './style.module.scss';
import styled from 'styled-components';
import SelectInput from 'src/components/inputs/SelectInput';

import photo from 'src/assets/dp.jpeg';

const TodayActivities = styled.div``;
const ActivityTimeline: React.FC = () => {
  return (
    <IonCard className={style['timeline-card']}>
      <IonCardHeader className={style['card-header']}>
        <IonCardTitle className={style['card-title']}>
          Activities Timeline
        </IonCardTitle>
        <IonText>
          <SelectInput
            label="Sort by"
            flexDirection="column"
            values={[
              { value: 1, text: 'Suggestion' },
              { value: 2, text: 'Bug' }
            ]}
            onChange={e => {}}
            placeholder="Latest"
          ></SelectInput>
        </IonText>
      </IonCardHeader>
      <IonCardContent>
        <TodayActivities>
          <IonList>
            <IonItem className={style['item-row']}>
              <div className={style['left']}>
                <div>
                  <img
                    src={photo}
                    height={60}
                    alt="avatar"
                    className={style['avatar']}
                  />
                </div>
                <div className={style['activity-detail']}>
                  <p>you received a Twitter verification badge</p>
                  <p>23 minutes ago</p>
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
            </IonItem>
          </IonList>
        </TodayActivities>
      </IonCardContent>
    </IonCard>
  );
};

export default ActivityTimeline;
