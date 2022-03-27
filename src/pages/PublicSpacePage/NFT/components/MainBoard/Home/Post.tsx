import React from 'react';
import { IonRow } from '@ionic/react';
import {
  CardContent,
  CardHeader,
  CardOverview
} from 'src/components/cards/common';
import img_nft_item from 'src/assets/space/nft_item.jpg';
import icon_emoti from 'src/assets/space/emoti.svg';
import icon_comment from 'src/assets/space/comment.svg';
import style from './Post.module.scss';

interface IProps {}

const Post: React.FC<IProps> = ({}: IProps) => {
  return (
    <CardOverview template={'default'}>
      <CardHeader><h6>Coming soon</h6></CardHeader>
      {/* <CardHeader>
        <IonRow className={style['creator']}>
          <img src={img_nft_item} />
          <div>
            <h1>
              Donald Bullers <span>Admin</span>
            </h1>
            <h2>2 days ago</h2>
          </div>
        </IonRow>
      </CardHeader> */}
      {/* <CardContent>
        <IonRow>
          <p>
            Hey apes, meant to get this out last night but it's been kind of a
            wild weekend. So here it is finally - BAYC x MAYC Mobile Game
            Competition Leaderboard, Ape Fest Dates, and a lil tease.
          </p>
        </IonRow>
        <IonRow>
          <img src={img_nft_item} className={style['post-image']} />
        </IonRow>
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
        <IonRow></IonRow>
      </CardContent> */}
    </CardOverview>
  );
};

export default Post;
