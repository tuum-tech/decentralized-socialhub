import React from 'react';
import { IonRow, IonCol } from '@ionic/react';
import Follower from '../common/Follower';
import Members from '../common/Members';
import Links from '../common/Links';
import { Wrapper } from '../common';
import Post from './Post';

interface IProps {}

const Home: React.FC<IProps> = ({}: IProps) => {
  return (
    <Wrapper>
      <IonRow>
        <IonCol size="8">
          <Post />
        </IonCol>
        <IonCol size="4">
          <Links />
          <Members />
          <Follower />
        </IonCol>
      </IonRow>
    </Wrapper>
  );
};

export default Home;
