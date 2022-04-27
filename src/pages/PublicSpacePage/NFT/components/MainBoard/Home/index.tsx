import React, { useEffect, useState } from 'react';
import { IonRow, IonCol, IonModal } from '@ionic/react';
import styled from 'styled-components';
import Follower from '../common/Follower';
import Members from '../common/Members';
import Links from '../common/Links';
import { Wrapper } from '../common';
import Post from './Post';
import PostEditor from './PostEditor';

const CustomModal = styled(IonModal)`
  --height: 400px;
  --border-radius: 16px;
`;
interface IProps {
  space: any;
}

const Home: React.FC<IProps> = ({ space }: IProps) => {
  const handleCreatePost = (content: any) => {
    setIsModalOpen(false);
  };
  const [isModalOpen, setIsModalOpen] = useState(true);
  return (
    <Wrapper>
      <IonRow></IonRow>
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
      <CustomModal
        onDidDismiss={() => {
          setIsModalOpen(false);
        }}
        isOpen={isModalOpen}
        cssClass="my-custom-class"
      >
        <PostEditor
          onClose={() => {
            setIsModalOpen(false);
          }}
          onCreate={handleCreatePost}
        />
      </CustomModal>
    </Wrapper>
  );
};

export default Home;
