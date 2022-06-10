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
import { HorDOMSpace16 } from '../../Highlight/About';
import style from '../common/Modal/style.module.scss';
import { SpaceService, SpaceCategory } from 'src/services/space.service';
import { DidcredsService, CredentialType } from 'src/services/didcreds.service';
import { getNFTCollectionOwners } from '../../../fetchapi';
import { showNotify } from 'src/utils/notify';

export const CustomModal = styled(IonModal)`
  --height: 400px;
  --border-radius: 16px;
`;
interface IProps {
  space: any;
  session: ISessionItem;
}

const Home: React.FC<IProps> = ({ space, session }: IProps) => {
  const isNFTSpace = useMemo(() => space.category === SpaceCategory.NFT, [
    space.category
  ]);
  const [posts, setPosts] = useState<any[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const limit = 10;
  const [hasPermissionToPost, setHasPermissionToPost] = useState<boolean>(
    false
  );
  const hasPermissionToComment = useMemo(() => {
    return (
      session.did &&
      (space.followers?.includes(session.did) || hasPermissionToPost)
    );
  }, [session.did, space.followers, hasPermissionToPost]);
  const isAdmin = useMemo(
    () => session.did && space.owner?.includes(session.did),
    [session.did, space.owner]
  );
  const handlePost = async (content: any) => {
    setIsModalOpen(false);
    const new_post = await SpaceService.post(session, space.guid, content);
    if (!new_post) {
      showNotify('Posting failed', 'error');
      return;
    }
    const _posts = [...posts];
    _posts.unshift(new_post);
    setPosts(_posts);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fetchMorePosts = useCallback(async () => {
    let _posts: any[] = await SpaceService.getPosts(
      space.guid,
      offset,
      limit,
      isAdmin
    );
    _posts = _posts.filter(post => post);
    if (_posts.length > 0) {
      setOffset(offset + limit);
      _posts = posts.concat(_posts);
      _posts.sort((a, b) => b.created.$date - a.created.$date);
      setPosts(_posts);
    } else {
      setHasMore(false);
    }
  });
  const searchNext = async ($event: CustomEvent<void>) => {
    await fetchMorePosts();
    ($event.target as HTMLIonInfiniteScrollElement).complete();
  };
  useEffect(() => {
    if (space.guid) {
      (async () => {
        await fetchMorePosts();
      })();
    }
  }, [fetchMorePosts, space.guid]);
  useEffect(() => {
    (async () => {
      if (!space.guid) return;
      if (!session.did) {
        setHasPermissionToPost(false);
        return;
      }
      if (space.owner.includes(session.did)) {
        setHasPermissionToPost(true);
        return;
      }
      if (isNFTSpace) {
        const network = space.meta?.network || 'Elastos Smart Contract Chain';
        const wallet = await DidcredsService.getCredentialValue(
          session,
          (network.toLowerCase() === 'elastos smart contract chain'
            ? CredentialType.ESCAddress
            : CredentialType.ETHAddress
          ).toLowerCase()
        );
        if (!wallet) {
          setHasPermissionToPost(false);
          return;
        }
        const { data }: any = await getNFTCollectionOwners(space.guid);
        const { owners: members } = data;
        if (members.includes(wallet)) {
          setHasPermissionToPost(true);
          return;
        }
      }
      setHasPermissionToPost(false);
    })();
  }, [space.guid, session, space.owner, space.meta, isNFTSpace]);

  return (
    <Wrapper>
      <IonRow>
        <IonCol sizeXs="12" sizeSm="8">
          <IonRow className="ion-justify-content-between ion-align-items-center">
            <IonContent className={style['searchcomponent']}>
              <IonSearchbar
                onIonChange={async e => {
                  setSearchQuery(e.detail.value || '');
                }}
                placeholder="Search post by author name, did"
                className={style['search-input']}
              ></IonSearchbar>
            </IonContent>
            {hasPermissionToPost && (
              <Button
                text={'New Post'}
                onClick={() => setIsModalOpen(true)}
                ml={20}
              />
            )}
          </IonRow>
          <HorDOMSpace16 />
          {posts.map((post: any, index: any) => {
            return (
              <Post
                key={JSON.stringify(post)}
                post={post}
                onComment={async (content: string) => {
                  const _post = await SpaceService.comment(
                    session.did,
                    post,
                    content
                  );
                  if (!_post) {
                    showNotify('Commenting failed', 'error');
                    return;
                  }
                  const _posts = [...posts];
                  _posts.splice(index, 1, _post);
                  setPosts(_posts);
                }}
                onShowOrHideComment={async (comment_id: string) => {
                  const _post = await SpaceService.showOrHideComment(
                    post,
                    comment_id
                  );
                  if (!_post) return;
                  const _posts = [...posts];
                  _posts.splice(index, 1, _post);
                  setPosts(_posts);
                }}
                onShowOrHidePost={async () => {
                  const _post = await SpaceService.showOrHidePost(post);
                  if (!_post) return;
                  const _posts = [...posts];
                  _posts.splice(index, 1, _post);
                  setPosts(_posts);
                }}
                onRemoveComment={async (comment_id: string) => {
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
                session={session}
                admins={space.owner}
                hasPermissionToComment={hasPermissionToComment}
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
        <IonCol sizeXs="12" sizeSm="4">
          {space.publicFields?.includes('social links') &&
            Object.keys(space.socialLinks).length > 0 && (
              <Links space={space} />
            )}
          <Members space={space} />
          {space.followers?.length > 0 &&
            space.publicFields?.includes('follower') && (
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
