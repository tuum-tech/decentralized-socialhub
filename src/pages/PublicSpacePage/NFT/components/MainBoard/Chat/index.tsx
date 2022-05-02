import React, { useState } from 'react';
import {
  IonRow,
  IonCol,
} from '@ionic/react';
import { Wrapper } from '../common';
import {
  CardOverview,
  CardHeaderContent,
  CardContentContainer
} from 'src/components/cards/common';
import { HorDOMSpace16 } from '../../Highlight/About';
import img_nft_item from 'src/assets/space/nft_item.jpg';
import icon_emoti from 'src/assets/space/emoti.svg';
import icon_comment from 'src/assets/space/comment.svg';
import icon_expand from 'src/assets/space/expand.svg';
import icon_magnifier from 'src/assets/space/magnifier.svg';
import style from './style.module.scss';

interface IProps {}

const Chat: React.FC<IProps> = ({}: IProps) => {
  const renderMessageBox = () => {
    return (
      <IonRow className={style['row']}>
        <img src={img_nft_item} className={style['avatar']} />
        <div className={style['msg']}>
          <IonRow>
            <div className={style['creator']}>
              <h1>
                Donald Bullers <span>Admin</span>
              </h1>
              <h2>2 days ago</h2>
            </div>
          </IonRow>
          <HorDOMSpace16 />
          <IonRow>
            <p>
              Thank you very much for taking the time and writing such detailed
              feedback for us. These are very vaulable insights. I have already
              added all of you points into our roadmap to further discuss them
              with the team, but i can say i agree with most of them and over
              time they will be added to the app improvements/features
            </p>
          </IonRow>
          <HorDOMSpace16 />
          <IonRow className="ion-justify-content-end ion-no-padding">
            <div className={style['action']}>
              <span>
                <img src={icon_emoti} />
                React
              </span>
              <span>
                <img src={icon_comment} />
                Reply
              </span>
            </div>
          </IonRow>
        </div>
      </IonRow>
    );
  };
  return (
    <Wrapper>
      <IonRow>
        <IonCol size="12">
          <CardOverview template={'default'}>
            <CardHeaderContent>
              <IonRow className="ion-justify-content-between ion-no-padding">
                <div className={style['card-title']}>
                  <h1>Chat</h1>
                  <h2>100K Followers . 100K Members</h2>
                </div>
                <div className={style['tools']}>
                  <img src={icon_magnifier} />
                  <img src={icon_expand} />
                </div>
              </IonRow>
            </CardHeaderContent>
            <CardContentContainer>
              {renderMessageBox()}
              {renderMessageBox()}
              {renderMessageBox()}
            </CardContentContainer>
          </CardOverview>
        </IonCol>
      </IonRow>
    </Wrapper>
  );
};

export default Chat;
