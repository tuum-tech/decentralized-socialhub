import React, { useState, useEffect } from 'react';

import { FollowButton } from 'src/elements/buttons';
import { ProfileService } from 'src/services/profile.service';
import { alertError } from 'src/utils/notify';

interface IProps {
  did: string;
  signedUser: ISessionItem;
}

const FollowOrUnFollowButton: React.FC<IProps> = ({
  did,
  signedUser
}: IProps) => {
  const [text, setText] = useState('Follow');
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  const follow = async (follow: boolean) => {
    setLoading(true);
    setFollowing(follow);
    try {
      if (follow) {
        await ProfileService.addFollowing(did, signedUser);
      } else {
        await ProfileService.unfollow(did, signedUser);
      }
      await loadData();
    } catch (e) {
      alertError(null, `Failed to ${follow ? 'follow' : 'unfollow'} this user`);
    }
  };

  const loadData = async () => {
    try {
      let following = await ProfileService.getFollowings(signedUser.did);
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
      console.log(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await loadData();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [did]);

  if (signedUser.did === did || text === '') {
    return <></>;
  }
  return (
    <FollowButton
      onClick={async () => {
        if (loading) return;
        if (following) {
          await follow(false);
        } else {
          await follow(true);
        }
      }}
    >
      {following ? `${text}ing` : text}
    </FollowButton>
  );
};

export default FollowOrUnFollowButton;
