import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonText,
  IonLabel,
  IonSelect,
  IonSelectOption
} from '@ionic/react';

import style from '../ActivityTimeline/style.module.scss';

interface Props {
  session: ISessionItem;
}
const VerificationRequests: React.FC<Props> = ({ session }: Props) => {
  return (
    <IonCard className={style['timeline-card']}>
      <IonCardHeader className={style['card-header']}>
        <IonCardTitle className={style['card-title']}>
          VerificationRequests
        </IonCardTitle>
        <IonText className={style['selectinput']}>
          <IonLabel className={style['selectinput_label']}>Sort by</IonLabel>
          <IonSelect
            className={style['selectinput_field']}
            placeholder="Latest"
            onIonChange={e => e}
          >
            <IonSelectOption value={0}>Latest</IonSelectOption>
          </IonSelect>
        </IonText>
      </IonCardHeader>
      <IonCardContent>Contents</IonCardContent>
    </IonCard>
  );
};

export default VerificationRequests;
