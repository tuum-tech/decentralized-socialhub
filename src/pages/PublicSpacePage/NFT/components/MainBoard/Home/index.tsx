import React from 'react';
import { IonRow, IonCol } from '@ionic/react';
import Follower from '../common/Follower';
import Members from '../common/Members';
import Links from '../common/Links';
import { Wrapper } from '../common';
import Post from './Post';

interface IProps {
  space: any;
}

const Home: React.FC<IProps> = ({ space }: IProps) => {
  return (
    <Wrapper>
      <IonRow>
        <IonCol size="8">
          <Post />
        </IonCol>
        <IonCol size="4">
          {space.socialLinks && Object.keys(space.socialLinks).length > 0 && (
            <Links space={space} />
          )}
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

export default Home;
