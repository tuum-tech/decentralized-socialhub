import React, { useEffect, useMemo, useState } from 'react';
import { IonRow } from '@ionic/react';
import styled from 'styled-components';
import {
  CardOverview,
  CardHeaderContent,
  CardContentContainer
} from 'src/components/cards/common';
import Avatar from 'src/components/Avatar';
import {
  SubMenu,
  Item
} from 'src/pages/ActivityPage/components/ActivityTimeline/ActivityRow';
import { HorDOMSpace16 } from '../../Highlight/About';
import { CustomModal } from './index';
import Comment from './Comment';
import CommentEditor from './CommentEditor';
import icon_comment from 'src/assets/space/comment.svg';
import style from './Post.module.scss';
import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';
import { timeSince } from 'src/utils/time';

const Text = styled.p`
  width: 100%;
`;
interface IProps {
  session: ISessionItem;
  post: any;
  onComment: (content: string) => void;
  onShowOrHidePost: () => void;
  onShowOrHideComment: (comment_id: string) => void;
  onRemovePost: () => void;
  onRemoveComment: (comment_id: string) => void;
  admins: string[];
  hasPermissionToComment: boolean;
}

const Post: React.FC<IProps> = ({
  session,
  post,
  onComment,
  onShowOrHidePost,
  onShowOrHideComment,
  onRemoveComment,
  onRemovePost,
  admins,
  hasPermissionToComment
}: IProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const isAuthor = session && session.did === post.creator;
  const [author, setAuthor] = useState('');
  const isAdmin = session && session.did && admins.includes(session.did);
  const comments = useMemo(() => {
    if (isAdmin) return post.comments;
    return Object.fromEntries(
      Object.keys(post.comments)
        .filter(id => !!post.comments_visibility[id])
        .map(id => [id, post.comments[id]])
    );
  }, [post, isAdmin]);
  const handleComment = async (content: string) => {
    onComment(content);
    setIsModalOpen(false);
  };
  useEffect(() => {
    (async () => {
      let didService = await DidService.getInstance();
      let userService = new UserService(didService);
      let tuumUser = await userService.SearchUserWithDID(post.creator);
      setAuthor(tuumUser.name);
    })();
  }, [post]);
  return (
    <CardOverview template={'default'}>
      {/* <CardHeader><h6>Coming soon</h6></CardHeader> */}
      <CardHeaderContent>
        {showMenu && (
          <SubMenu>
            {isAdmin && (
              <Item
                onClick={() => {
                  setShowMenu(false);
                  onShowOrHidePost();
                }}
              >
                {post.visible ? 'Hide' : 'Show'}
              </Item>
            )}
            {isAuthor && (
              <Item
                onClick={() => {
                  setShowMenu(false);
                  onRemovePost();
                }}
              >
                Delete
              </Item>
            )}
          </SubMenu>
        )}
        <IonRow className="ion-justify-content-between ion-align-items-center">
          <div className={style['creator']}>
            <Avatar did={post.creator} width="40px" />
            <div className={style['meta']}>
              <h1>
                {author} {admins.includes(post.creator) && <span>Admin</span>}
              </h1>
              <h2>
                {timeSince(
                  post.created ? post.created.$date : new Date().getTime()
                )}
              </h2>
            </div>
          </div>
          {(isAdmin || isAuthor) && (
            <div
              className={style['menu']}
              onClick={() => setShowMenu(!showMenu)}
            >
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="black"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.5 3.5C6.5 2.67157 7.17157 2 8 2C8.82843 2 9.5 2.67157 9.5 3.5C9.5 4.32843 8.82843 5 8 5C7.17157 5 6.5 4.32843 6.5 3.5ZM6.5 8.5C6.5 7.67157 7.17157 7 8 7C8.82843 7 9.5 7.67157 9.5 8.5C9.5 9.32843 8.82843 10 8 10C7.17157 10 6.5 9.32843 6.5 8.5ZM6.5 13.5C6.5 12.6716 7.17157 12 8 12C8.82843 12 9.5 12.6716 9.5 13.5C9.5 14.3284 8.82843 15 8 15C7.17157 15 6.5 14.3284 6.5 13.5Z"
                  stroke="black"
                />
              </svg>
            </div>
          )}
        </IonRow>
      </CardHeaderContent>
      <CardContentContainer>
        <IonRow>
          <Text>{post.content}</Text>
        </IonRow>
        <HorDOMSpace16 />
        <IonRow className="ion-justify-content-between ion-padding-horizontal">
          <div className={style['post-analytic']}>
            {/* <span>50K Likes</span> */}
            <span>{Object.keys(comments).length} Comments</span>
          </div>
          <div className={style['action']}>
            {(hasPermissionToComment || isAuthor) && (
              <span onClick={() => setIsModalOpen(true)}>
                <img alt="comment icon" src={icon_comment} />
                Comment
              </span>
            )}
            {/* <span>
              <img src={icon_emoti} />
              React
            </span> */}
          </div>
        </IonRow>
        <HorDOMSpace16 />
        {Object.keys(comments).map((id: string) => (
          <Comment
            key={id}
            session={session}
            admins={admins}
            comment={{
              ...comments[id],
              visible: !!post.comments_visibility[id]
            }}
            onShowOrHideComment={() => onShowOrHideComment(id)}
            onRemoveComment={() => onRemoveComment(id)}
          />
        ))}
        <CustomModal
          onDidDismiss={() => {
            setIsModalOpen(false);
          }}
          isOpen={isModalOpen}
          cssClass="my-custom-class"
        >
          <CommentEditor
            onClose={() => {
              setIsModalOpen(false);
            }}
            onCreate={handleComment}
          />
        </CustomModal>
      </CardContentContainer>
    </CardOverview>
  );
};

export default Post;
