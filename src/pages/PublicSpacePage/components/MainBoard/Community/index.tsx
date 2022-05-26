import React from 'react';
import { IonRow, IonCol } from '@ionic/react';
import Follower from '../common/Follower';
import Members from '../common/Members';
import Boards from '../common/Boards';
import { Wrapper } from '../common';
import Discussion from './Discussion';

interface IProps {
  space: any;
}

const Community: React.FC<IProps> = ({ space }: IProps) => {
  return (
    <Wrapper>
      <IonRow>
        <IonCol size="8">
          <Discussion />
        </IonCol>
        <IonCol size="4">
          <Boards />
          <Members space={space} />
          {space.followers &&
            space.followers.length > 0 &&
            space.publicFields.includes('follower') && (
              <Follower space={space} />
            )}
        </IonCol>
      </IonRow>
    </Wrapper>
  );
};

export default Community;
