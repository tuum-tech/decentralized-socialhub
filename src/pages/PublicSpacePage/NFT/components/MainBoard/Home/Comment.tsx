import React, { useEffect, useState } from 'react';
import { IonRow } from '@ionic/react';
import styled from 'styled-components';
import { HorDOMSpace16 } from '../../Highlight/About';
import {
  SubMenu,
  Item
} from 'src/pages/ActivityPage/components/ActivityTimeline';
import Avatar from 'src/components/Avatar';
import img_nft_item from 'src/assets/space/nft_item.jpg';
import style from '../Chat/style.module.scss';
import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';
import { timeSince } from 'src/utils/time';

const Text = styled.p`
  width: 100%;
`;
interface IProps {
  session: ISessionItem;
  admins: string[];
  comment: any;
  onShowOrHideComment: () => void;
  onRemoveComment: () => void;
}

const Comment: React.FC<IProps> = ({
  session,
  admins,
  comment,
  onShowOrHideComment,
  onRemoveComment,
}: IProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const isAuthor = session && session.did === comment.creator;
  const [author, setAuthor] = useState('');
  const isAdmin = session && session.did && admins.includes(session.did);
  useEffect(() => {
    (async () => {
      let didService = await DidService.getInstance();
      let userService = new UserService(didService);
      let tuumUser = await userService.SearchUserWithDID(comment.creator);
      setAuthor(tuumUser.name);
    })();
  }, [comment]);
  return (
    <IonRow className={style['row']}>
      <Avatar did={comment.creator} width="40px" />
      <div className={style['msg']}>
        <IonRow className="ion-justify-content-between ion-align-items-center">
          <div className={style['creator']}>
            <h1>
              {author} {admins.includes(comment.creator) && <span>Admin</span>}
            </h1>
            <h2>{timeSince(comment.created)}</h2>
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
        <HorDOMSpace16 />
        <IonRow>
          <Text>{comment.content}</Text>
        </IonRow>
        <HorDOMSpace16 />
      </div>
      {showMenu && (
        <SubMenu>
          {isAdmin && (
            <Item
              onClick={() => {
                setShowMenu(false);
                onShowOrHideComment();
              }}
            >
              {comment.visible ? 'Hide' : 'Show'}
            </Item>
          )}
          {isAuthor && (
            <Item
              onClick={() => {
                setShowMenu(false);
                onRemoveComment();
              }}
            >
              Delete
            </Item>
          )}
        </SubMenu>
      )}
    </IonRow>
  );
};

export default Comment;
