import React, { useEffect, useMemo, useState } from 'react';
import {
  IonRow,
  IonCol,
  IonModal,
  IonSearchbar,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/react';
import styled from 'styled-components';
import { Button } from 'src/elements/buttons';
import Follower from '../common/Follower';
import Members from '../common/Members';
import Links from '../common/Links';
import { Wrapper } from '../common';
import Post from './Post';
import PostEditor from './PostEditor';
import { SpaceService } from 'src/services/space.service';
import style from '../common/Modal/style.module.scss';
import { HorDOMSpace16 } from '../../Highlight/About';
import { DidcredsService, CredentialType } from 'src/services/didcreds.service';

export const CustomModal = styled(IonModal)`
  --height: 400px;
  --border-radius: 16px;
`;
interface IProps {
  space: any;
  session: ISessionItem;
}

const Home: React.FC<IProps> = ({ space, session }: IProps) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const limit = 5;
  // const hasPermissionToPost = useMemo(() => {
  //   if (!session || !session.did) return false;
  //   if (space.owner.includes(session.did)) return true;
  //   const network = space.meta.network || 'Elastos Smart Contract Chain';
  //   const wallet = DidcredsService.getCredentialValue(
  //     session,
  //     (network.toLowerCase() === 'elastos smart contract chain'
  //       ? CredentialType.ESCAddress
  //       : CredentialType.ETHAddress
  //     ).toLowerCase()
  //   );
  //   if (!wallet) return false;
  // }, [session, space]);
  const handlePost = async (content: any) => {
    const new_post = await SpaceService.post(session, space.sid, content);
    const _posts = [...posts];
    _posts.unshift(new_post);
    setPosts(_posts);
    setIsModalOpen(false);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fetchMorePosts = async () => {
    const _posts = await SpaceService.getPosts(space.sid, offset, limit);
    if (_posts.length > 0) {
      setOffset(offset + limit);
      setPosts(posts.concat(_posts));
    } else {
      setHasMore(false);
    }
  };
  const searchNext = async ($event: CustomEvent<void>) => {
    await fetchMorePosts();
    ($event.target as HTMLIonInfiniteScrollElement).complete();
  };
  useEffect(() => {
    (async () => {
      await fetchMorePosts();
    })();
  }, []);
  return (
    <Wrapper>
      <IonRow>
        <IonCol size="8">
          <IonRow className="ion-justify-content-between ion-align-items-center">
            <IonContent className={style['searchcomponent']}>
              <IonSearchbar
                onIonChange={async e => {
                  setSearchQuery(e.detail.value || '');
                }}
                placeholder="Search post, comments"
                className={style['search-input']}
              ></IonSearchbar>
            </IonContent>
            <Button
              text={'New Post'}
              onClick={() => setIsModalOpen(true)}
              ml={20}
            />
          </IonRow>
          <HorDOMSpace16 />
          {posts.map((post, index) => {
            return (
              <Post
                post={post}
                onComment={async (content: string) => {
                  const _post = await SpaceService.comment(
                    session.did,
                    post,
                    content
                  );
                  if (!_post) return;
                  const _posts = [...posts];
                  _posts.splice(index, 1, _post);
                  setPosts(_posts);
                }}
                onHideComment={async (comment_id: string) => {
                  const _post = await SpaceService.hideComment(
                    post,
                    comment_id
                  );
                  if (!_post) return;
                  const _posts = [...posts];
                  _posts.splice(index, 1, _post);
                  setPosts(_posts);
                }}
                onHidePost={async () => {
                  const _post = await SpaceService.hidePost(post);
                  if (!_post) return;
                  const _posts = [...posts];
                  _posts.splice(index, 1, _post);
                  setPosts(_posts);
                }}
                onRemoveComment={async (comment_id: string) => {
                  alert('heyhey');
                  const _post = await SpaceService.removeComment(
                    post,
                    comment_id
                  );
                  if (!_post) return;
                  const _posts = [...posts];
                  _posts.splice(index, 1, _post);
                  setPosts(_posts);
                }}
                onRemovePost={async () => {
                  await SpaceService.removePost(post);
                  const _posts = [...posts];
                  _posts.splice(index, 1);
                  setPosts(_posts);
                }}
              />
            );
          })}
          <IonInfiniteScroll
            threshold="100px"
            disabled={!hasMore}
            onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}
          >
            <IonInfiniteScrollContent
              loadingSpinner="bubbles"
              loadingText="Loading posts..."
            ></IonInfiniteScrollContent>
          </IonInfiniteScroll>
          {/* <Post /> */}
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
          onCreate={handlePost}
        />
      </CustomModal>
    </Wrapper>
  );
};

export default Home;
