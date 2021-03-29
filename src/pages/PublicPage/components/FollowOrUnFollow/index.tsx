import React, { useState, useEffect } from 'react';

import { FollowButton } from 'src/components/buttons';
import {
  ProfileService,
  defaultUserInfo,
  IFollowingResponse
} from 'src/services/profile.service';
import { alertError } from 'src/utils/notify';
import { UserService } from 'src/services/user.service';

interface IProps {
  did: string;
}

const FollowOrUnFollowButton: React.FC<IProps> = ({ did }: IProps) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<ISessionItem>(
    UserService.GetUserSession() || defaultUserInfo
  );
  const [listFollowing, setListFollowing] = useState<IFollowingResponse>({
    get_following: { items: [] }
  });

  const follow = async (follow: boolean) => {
    setLoading(true);
    try {
      if (follow) {
        await ProfileService.addFollowing(did);
        setText('UnFollow');
      } else {
        await ProfileService.unfollow(did);
        setText('Follow');
      }
    } catch (e) {
      alertError(null, `Failed to ${follow ? 'follow' : 'unfollow'} this user`);
    }
    setLoading(false);
  };

  const isFollowing = (did: string): boolean => {
    if (listFollowing.get_following && listFollowing.get_following.items) {
      for (let i = 0; i < listFollowing.get_following.items.length; i++) {
        if (listFollowing.get_following.items[i].did === did) {
          return true;
        }
      }
    }
    return false;
  };

  const loadData = async () => {
    if (!userInfo || userInfo.did === '') return;
    try {
      let following = await ProfileService.getFollowings(userInfo.did);
      setListFollowing(following as IFollowingResponse);
      setText(isFollowing(did) ? 'Unfollow' : 'Follow');
      setLoading(false);
      return;
    } catch (e) {
      setListFollowing({ get_following: { items: [] } });
      alertError(null, 'Could not load users that you follow');
      setText('Follow');
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadData();
    })();
  }, [did]);

  if (userInfo.did === did || text === '') {
    return <></>;
  }
  return (
    <FollowButton
      onClick={async () => {
        if (loading) return;
        if (text === 'Follow') {
          await follow(true);
        } else {
          await follow(false);
        }
      }}
    >
      {loading ? `${text}ing` : text}
    </FollowButton>
  );
};

export default FollowOrUnFollowButton;
