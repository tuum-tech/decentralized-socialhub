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
  const [toggleFollowing, setToggleFollowing] = useState(false);

  const follow = async (follow: boolean) => {
    setLoading(true);
    let res;
    try {
      if (follow) {
        res = await ProfileService.addFollowing(did, signedUser);
      } else {
        res = await ProfileService.unfollow(did, signedUser);
      }
      if (res) {
        await loadData();
        setToggleFollowing(!toggleFollowing);
      }
    } catch (e) {
      setLoading(false);
      alertError(null, `Failed to ${follow ? 'follow' : 'unfollow'} this user`);
    }
  };

  const loadData = async () => {
    try {
      let following = await ProfileService.getFollowings(signedUser.did);
      if (following && following.items) {
        const followingDids = following.items.map((item: any) => item.did);

        setText(followingDids.includes(did) ? 'Unfollow' : 'Follow');
      }
      return;
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
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
        if (toggleFollowing) {
          await follow(false);
        } else {
          await follow(true);
        }
      }}
    >
      {toggleFollowing ? `${text}ing` : text}
    </FollowButton>
  );
};

export default FollowOrUnFollowButton;
