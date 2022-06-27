import React, { useState } from 'react';
import { IonItem } from '@ionic/react';
import styled from 'styled-components';
import clsx from 'clsx';

import { timeSince } from 'src/utils/time';
import photo from 'src/assets/icon/dp.png';
import style from './style.module.scss';

export const SubMenu = styled.div`
  position: absolute;
  top: 50px;
  right: -39px;
  width: 127px;
  padding: 5px;

  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.08), 0px 1px 34px rgba(0, 0, 0, 0.07);
  border-radius: 8px;

  z-index: 10000;

  background: white;

  & ion-item {
    font-size: 14px;
    color: #4c6fff;
  }
  & :hover {
    cursor: pointer;
  }
  & img {
    content: '';
    width: 47px;
    height: 27px;

    position: absolute;
    left: 50%;
    top: -20px;
    z-index: 200000;
    transform: translateX(-50%);
  }
`;

export const Item = styled(IonItem)`
  display: flex;
  align-items: center;
  --border-color: #ffffff;
  height: 35px;
`;

interface IActivityRowData {
  activity: ActivityItem;
  zIndex: number;
  onRead: () => void;
}
const ActivityRow: React.FC<IActivityRowData> = props => {
  const [showToolTip, setShowToolTip] = useState<boolean>(false);
  const { activity, zIndex, onRead } = props;
  const handleMarkAsRead = () => {
    setShowToolTip(false);
    onRead && onRead();
  };

  let styleClass = style['activity-row'];
  if (!activity.read) {
    styleClass = clsx(style['activity-row'], style['unread']);
  }

  return (
    <IonItem
      className={styleClass}
      style={{
        zIndex: zIndex
      }}
    >
      {showToolTip && (
        <SubMenu>
          <Item onClick={handleMarkAsRead}>Mark as read</Item>
        </SubMenu>
      )}
      <div className={style['d-vert-flex']}>
        <div className={style['left']}>
          <img
            src={photo}
            height={55}
            alt="avatar"
            className={style['avatar']}
          />
          <div className={style['activity-detail']}>
            <div
              className={style['activity-text']}
              dangerouslySetInnerHTML={{ __html: activity.message }}
            ></div>
            <p className={style['activity-time-since']}>
              {timeSince((activity as any).createdAt)}
            </p>
          </div>
        </div>
        <div
          className={style['right']}
          onClick={() => {
            setShowToolTip(!showToolTip);
          }}
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
      </div>
    </IonItem>
  );
};

export default ActivityRow;
