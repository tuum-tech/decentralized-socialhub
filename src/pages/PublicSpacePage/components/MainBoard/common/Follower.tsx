import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IonRow, IonCol, IonCardTitle } from '@ionic/react';
import {
  CardOverview,
  CardHeaderContent,
  CardContentContainer
} from 'src/components/cards/common';
import { getUsersByDid as getUsersByDidAction } from 'src/store/users/actions';
import { selectAllUsers } from 'src/store/users/selectors';
import { LinkStyleSpan } from '../common';
import Avatar from 'src/components/Avatar';
import ViewAllFollower from './Modal/ViewAllFollower';
import style from './style.module.scss';
import { getDIDString } from 'src/utils/did';

interface IProps {
  template?: string;
  space: any;
}

const Follower: React.FC<IProps> = ({
  template = 'default',
  space
}: IProps) => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const [showViewAllModal, setShowViewAllModal] = useState(false);
  const followers = useMemo(
    () => users.filter(user => space.followers?.includes(user.did)),
    [space, users]
  );

  const getUsersByDid = useCallback(
    (ids, limit, offset) => {
      dispatch(getUsersByDidAction(ids, limit, offset));
    },
    [dispatch]
  );

  useEffect(() => {
    const dids = space.followers || [];
    getUsersByDid(dids, 4, 0);
  }, [getUsersByDid, space.followers]);

  return (
    <>
      {followers.length > 0 && (
        <CardOverview template={template}>
          <CardHeaderContent>
            <IonRow className="ion-justify-content-between ion-no-padding">
              <IonCol className="ion-no-padding">
                <IonCardTitle>
                  Followers ({space.followers?.length})
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
