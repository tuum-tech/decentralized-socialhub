import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IonRow, IonCol, IonCardTitle } from '@ionic/react';
import { FollowService } from 'src/services/follow.service';
import {
  CardOverview,
  CardHeaderContent,
  CardContentContainer
} from 'src/components/cards/common';
import { LinkStyleSpan } from '../common';
import Avatar from 'src/components/Avatar';
import ViewAllFollower from './Modal/ViewAllFollower';
import style from './style.module.scss';
import { getDIDString } from 'src/utils/did';
import { TuumTechScriptService } from 'src/services/script.service';

interface IProps {
  template?: string;
  space: any;
}

const Follower: React.FC<IProps> = ({
  template = 'default',
  space
}: IProps) => {
  const [showViewAllModal, setShowViewAllModal] = useState(false);
  const [followers, setFollowers] = useState([]);
  useEffect(() => {
    (async () => {
      const dids = space.followers || [];
      const _followers_ = await FollowService.invokeSearch(
        dids,
        '',
        dids.length,
        1
      );
      setFollowers(_followers_);
    })();
  }, [space]);
  return (
    <>
      {followers.length > 0 && (
        <CardOverview template={template}>
          <CardHeaderContent>
            <IonRow className="ion-justify-content-between ion-no-padding">
              <IonCol className="ion-no-padding">
                <IonCardTitle>
                  Followers ({followers.length})
                </IonCardTitle>
              </IonCol>
              <IonCol size="auto" className="ion-no-padding">
                <LinkStyleSpan
                  onClick={() => {
                    setShowViewAllModal(true);
                  }}
                >
                  View all
                </LinkStyleSpan>
              </IonCol>
            </IonRow>
          </CardHeaderContent>
          <CardContentContainer>
            {followers.slice(0, 4).map((follower: any) => {
              return (
                <IonRow className={style['row']} key={follower.did}>
                  <div className={style['avatar']}>
                    {/* <img src={nft_item_icon} /> */}
                    <Avatar did={follower.did} width="40px" />
                  </div>
                  <Link
                    className={style['name']}
                    to={getDIDString('/did/' + follower.did)}
                    target={'blank'}
                  >
                    <span className={style['name']}>{follower.name}</span>
                  </Link>
                </IonRow>
              );
            })}
          </CardContentContainer>
        </CardOverview>
      )}
      <ViewAllFollower
        space={space}
        isOpen={showViewAllModal}
        onClose={() => {
          setShowViewAllModal(false);
        }}
      />
    </>
  );
};

export default Follower;
