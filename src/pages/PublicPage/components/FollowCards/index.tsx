import React, { useEffect, useState } from 'react';

import { ProfileService } from 'src/services/profile.service';
import { IUserResponse, SearchService } from 'src/services/search.service';

import FollowerCard from './FollowerCard';
import FollowingCard from './FollowingCard';

interface IProps {
  did: string;
}

const FowllowCards: React.FC<IProps> = ({ did }: IProps) => {
  const [listFollowing, setListFollowing] = useState<IFollowingResponse>({
    get_following: { items: [] }
  });
  const [filteredUsers, setFilteredUsers] = useState<IUserResponse>({
    get_users: { items: [] }
  });
  const [listFollowers, setListFollowers] = useState<IFollowerResponse>({
    get_followers: { items: [] }
  });

  const resolveUserInfo = (did: string): any => {
    const userIndex = filteredUsers.get_users.items.findIndex(
      item => item.did === did
    );
    const user = filteredUsers.get_users.items[userIndex];
    return {
      name: user ? user.name : 'Anonymous',
      image: user ? user.avatar : ''
    };
  };

  const loadData = async (did: string) => {
    let fUserDids: string[] = [];
    let followings = (await ProfileService.getFollowings(
      did
    )) as IFollowingResponse;
    if (followings) {
      setListFollowing(followings);
      fUserDids = followings.get_following.items.map(item => item.did);
    }
    let followers = (await ProfileService.getFollowers([
      did
    ])) as IFollowerResponse;
    if (followers) {
      setListFollowers(followers);
      for (let i = 0; i < followers.get_followers.items.length; i++) {
        if (!fUserDids.includes(followers.get_followers.items[i].did)) {
          fUserDids.push(followers.get_followers.items[i].did);
        }
      }
    }

    let searchServiceLocal: SearchService;
    try {
      searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
      let listUsers: any = await searchServiceLocal.getUsersByDIDs(
        fUserDids,
        200,
        0
      );
      setFilteredUsers(listUsers.response);
    } catch (e) {
      setFilteredUsers({ get_users: { items: [] } });
    }
  };

  useEffect(() => {
    (async () => {
      if (did !== '') {
        await loadData(did);
      }
    })();
  }, [did]);

  return (
    <>
      <FollowingCard
        contacts={listFollowing}
        resolveUserFunc={resolveUserInfo}
        getLinkFunc={(did: string) => '/did/' + did}
      />
      <FollowerCard
        contacts={listFollowers}
        resolveUserFunc={resolveUserInfo}
        getLinkFunc={(did: string) => '/did/' + did}
      />
    </>
  );
};

export default FowllowCards;
