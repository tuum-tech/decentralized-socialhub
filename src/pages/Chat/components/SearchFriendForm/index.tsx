import React, { useEffect, useState } from 'react';
import { IonCardTitle, IonCol, IonRow, IonButton } from '@ionic/react';
import { MyGrid } from 'src/components/cards/common';
import style from './style.module.scss';
import { DID } from '@elastosfoundation/did-js-sdk/typings';
import { ProfileService } from 'src/services/profile.service';
import { SearchService } from 'src/services/search.service';
import { UserType } from 'src/utils/user';
import FriendCard from '../FriendCard';
import { getDIDString } from 'src/utils/did';
interface Props {
  session: ISessionItem;
  selectFriend: (friend: any) => void;
  onClose: () => void;
}

const SearchFriendForm: React.FC<Props> = ({
  session,
  selectFriend,
  onClose
}: Props) => {
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      if (session && session.did && session.tutorialStep === 4) {
        try {
          let followersResponse = await ProfileService.getFollowers([
            session.did
          ]);
          let followingResponse = await ProfileService.getFollowings(
            session.did
          );
          let followers: any[] = [];
          let following: any[] = [];

          if (
            followersResponse &&
            followersResponse.get_followers &&
            followersResponse.get_followers.items
          )
            followers = followersResponse.get_followers.items[0].followers;

          if (
            followingResponse &&
            followingResponse.get_following &&
            followingResponse.get_following.items
          )
            following = followingResponse.get_following.items.map(s => s.did);

          let friendsFound = following.filter(
            did => followers.indexOf(did) !== -1
          );

          let searchServiceLocal: SearchService;
          searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();

          let listUsers: any = await searchServiceLocal.getUsersByDIDs(
            friendsFound,
            200,
            0
          );

          let usersFound = listUsers?.response?.get_users_by_dids?.items || [];
          let response: any[] = [];

          for (const user of usersFound) {
            let isThere = response.map(s => s.did === user.did);
            if (isThere.length <= 0) response.push(user);
          }

          setFriends(response);
        } catch (e) {
          console.error('Error getting friends list');
          setFriends([]);
        }
      }
    })();
  }, [session]);

  const getFriends = () => {
    if (friends.length <= 0) return <></>;

    return (
      <>
        {' '}
        {friends.map(item => (
          <FriendCard
            key={item.did}
            did={item.did}
            avatar={item.avatar}
            sessionItem={session}
            name={item.name}
            connectClicked={did => {
              selectFriend(getDIDString(did, true));
            }}
          ></FriendCard>
        ))}
      </>
    );
  };

  return (
    <MyGrid className={style['form']}>
      <IonRow className={style['form_title']}>
        <IonCardTitle>Select a friend to start chat</IonCardTitle>
      </IonRow>
      <IonRow class="ion-justify-content-start">{getFriends()}</IonRow>
      <IonRow className={style['form_footer']}>
        <IonCol size="12">
          <IonButton shape="round" fill="outline" onClick={onClose}>
            Cancel
          </IonButton>
        </IonCol>
      </IonRow>
    </MyGrid>
  );
};

export default SearchFriendForm;
