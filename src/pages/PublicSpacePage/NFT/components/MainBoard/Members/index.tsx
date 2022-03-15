import React from 'react';
import {
  IonRow,
  IonCol,
} from '@ionic/react';
import Members from '../common/Members';
import Boards from '../common/Boards';
import { Wrapper } from '../common';
import Discussion from './Discussion';
import Welcome from './Welcome';

interface IProps {} 

const MembersAccess: React.FC<IProps> = ({}: IProps) => {
  return (
    <Wrapper>
      <IonRow>
        <IonCol size="8">
            <Discussion />
        </IonCol>
        <IonCol size="4">
          <Boards />
          <Members />
        </IonCol>
        {/* <IonCol size="12">
          <Welcome />
        </IonCol> */}
      </IonRow>
    </Wrapper>
  );
};

export default MembersAccess;
