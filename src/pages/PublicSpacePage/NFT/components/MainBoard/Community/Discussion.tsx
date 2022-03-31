import React from 'react';
import { IonRow, IonInput } from '@ionic/react';
import {
  CardContent,
  CardHeader,
  CardOverview
} from 'src/components/cards/common';
import { HorDOMSpace16 } from '../../Highlight/About';
import img_nft_item from 'src/assets/space/nft_item.jpg';
import icon_emoti from 'src/assets/space/emoti.svg';
import icon_comment from 'src/assets/space/comment.svg';
import icon_expand from 'src/assets/space/expand.svg';
import icon_magnifier from 'src/assets/space/magnifier.svg';
import style from './Discussion.module.scss';

interface IProps {}

const Discussion: React.FC<IProps> = ({}: IProps) => {
  const renderTopic = () => {
    return (
      <IonRow className={style['row']}>
        <img src={img_nft_item} className={style['avatar']} />
        <div className={style['content']}>
          <IonRow>
            <h1 className={style['creator']}>
              Brooklyn Simmons<span>&nbsp;-&nbsp;8.40PM</span>
            </h1>
          </IonRow>
          <IonRow>
            <p>
              However, that is not the end. Product designers would still need
              to execute the idea, making it into an actual product and
              evaluating its success (seeing if any improvements are necessary).
            </p>
          </IonRow>
          <HorDOMSpace16 />
          <IonRow className="ion-justify-content-between ion-no-padding">
            <div className={style['post-analytic']}>
              <span>50K Likes</span>
              <span>300 Comments</span>
            </div>
            <div className={style['action']}>
              <span>
                <img src={icon_comment} />
                Comment
              </span>
              <span>
                <img src={icon_emoti} />
                React
              </span>
            </div>
          </IonRow>
        </div>
      </IonRow>
    );
  };
  return (
    <CardOverview template={'default'}>
      <CardHeader>
        <IonRow className="ion-justify-content-between ion-no-padding">
          <div className={style['card-title']}>
            <h1>Community</h1>
            <h2>Chat</h2>
          </div>
          <div className={style['tools']}>
            <img src={icon_magnifier} />
            <img src={icon_expand} />
          </div>
        </IonRow>
      </CardHeader>
      <CardContent>
        <IonRow className={style['row']}>
          <img src={img_nft_item} className={style['avatar']} />
          <div className={style['new-discussion']}>
            <IonInput
              className={style['input']}
              placeholder={'Start a new Discussin'}
              onIonChange={e => {}}
            />
          </div>
        </IonRow>
        {renderTopic()}
        {renderTopic()}
        {renderTopic()}
      </CardContent>
    </CardOverview>
  );
};

export default Discussion;
