import React, { useEffect, useState } from 'react';
import { IonCardTitle, IonCol, IonRow, IonButton } from '@ionic/react';
import { MyGrid } from 'src/components/cards/common';
import style from './style.module.scss';
import { DID } from '@elastosfoundation/did-js-sdk/typings';
import { ProfileService } from 'src/services/profile.service';
import { SearchService } from 'src/services/search.service';
import { UserType } from 'src/utils/user';
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

          console.log(listUsers?.response?.get_users_by_tutorialStep);

          let usersFound = listUsers?.response?.get_users_by_tutorialStep || [];

          setFriends(usersFound);
        } catch (e) {
          console.error('Error getting mutual followers');
          setFriends([]);
        }
      }
    })();
  }, [session]);

  return (
    <MyGrid className={style['form']}>
      <IonRow className={style['form_title']}>
        <IonCardTitle>Select a friend to start chat</IonCardTitle>
      </IonRow>
      <IonRow class="ion-justify-content-start"></IonRow>
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
