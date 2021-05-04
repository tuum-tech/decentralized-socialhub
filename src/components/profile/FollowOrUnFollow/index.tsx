import React, { useState, useEffect } from 'react';

import { FollowButton } from 'src/components/buttons';
import { ProfileService } from 'src/services/profile.service';
import { alertError } from 'src/utils/notify';

interface IProps {
  did: string;
  userDid: string;
}

const FollowOrUnFollowButton: React.FC<IProps> = ({ did, userDid }: IProps) => {
  const [text, setText] = useState('Follow');
  const [loading, setLoading] = useState(true);

  const follow = async (follow: boolean) => {
    setLoading(true);
    try {
      if (follow) {
        await ProfileService.addFollowing(did);
      } else {
        await ProfileService.unfollow(did);
      }
      await loadData();
    } catch (e) {
      alertError(null, `Failed to ${follow ? 'follow' : 'unfollow'} this user`);
    }
  };

  const loadData = async () => {
    if (!userDid || userDid === '') return;
    try {
      let following = await ProfileService.getFollowings(userDid);
      if (
        following &&
        following.get_following &&
        following.get_following.items
      ) {
        const followingDids = following.get_following.items.map(
          (item: any) => item.did
        );

        setText(followingDids.includes(did) ? 'Unfollow' : 'Follow');
      }
      setLoading(false);
      return;
    } catch (e) {
      console.log('====>error', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await loadData();
    })();
  }, [did]);

  if (userDid == did || text === '') {
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
