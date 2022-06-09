import React from 'react';

import noFollowersImg from 'src/assets/noconnect/followers.svg';
import noFollowingsImg from 'src/assets/noconnect/followings.svg';
import noMutualsImg from 'src/assets/noconnect/mutals.svg';
import NoDataCard from '../NoDataCard';

interface Props {
  pageType?: string;
}

const NoConnectionComp: React.FC<Props> = ({ pageType = 'followers' }) => {
  if (pageType === 'followers') {
    return (
      <NoDataCard
        img={noFollowersImg}
        title="No Followers Yet"
        description="This is where you'll find your followers & admirers."
        noBorder={false}
      />
    );
  } else if (pageType === 'followingPeople') {
    return (
      <NoDataCard
        img={noFollowingsImg}
        title="No Followings"
        description="You are not following anyone yet"
        buttonLink="/explore"
        buttonTitle="Start exploring profiles"
        noBorder={false}
      />
    );
  } else if (pageType === 'followingPages') {
    return (
      <NoDataCard
        img={noFollowingsImg}
        title="No Followings"
        description="You are not following anyone yet"
        buttonLink="/explore"
        buttonTitle="Start exploring profiles"
        noBorder={false}
      />
    );
  }

  return (
    <NoDataCard
      img={noMutualsImg}
      title="Mutual Followers"
      description="People you follow and they follow you back."
      buttonLink="/explore"
      buttonTitle="Start exploring profiles"
      noBorder={false}
    />
  );
};

export default NoConnectionComp;
