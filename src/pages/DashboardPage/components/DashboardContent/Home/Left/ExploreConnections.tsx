import React, { useState, useEffect } from 'react';

import { ProfileService } from 'src/services/profile.service';
import MainCard from './MainCard';
import { LinkButton } from 'src/elements-v2/buttons';
import exploreCardImg from '../../../../../../assets/dashboard/explore.png';

interface Props {
  did: string;
  session: ISessionItem;
}

const ExploreConnections: React.FC<Props> = ({ did, session }) => {
  const [connectedDids, setConnectedDids] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      let fUserDids: string[] = [];
      if (session && session.tutorialStep === 4) {
        let followings = await ProfileService.getFollowings(session.did);
        if (
          followings &&
          followings.get_following &&
          followings.get_following.items &&
          followings.get_following.items.length > 0
        ) {
          fUserDids = followings.get_following.items.map(item => item.did);
        }

        let followers = await ProfileService.getFollowers([did]);
        if (followers) {
          for (let i = 0; i < followers.get_followers.items.length; i++) {
            if (!fUserDids.includes(followers.get_followers.items[i].did)) {
              fUserDids.push(followers.get_followers.items[i].did);
            }
          }
        }
        if (fUserDids.length > 0 && fUserDids.includes(did)) {
          fUserDids = fUserDids.filter(item => item !== did);
        }
      }
      setConnectedDids(fUserDids);
    })();
  }, [did, session]);

  return (
    <>
      {connectedDids.length === 0 && (
        <MainCard
          title="Connect with friends, companies"
          description="Search for like minded people and make valuable connections. Explore
          your influence circle"
          right={<img src={exploreCardImg} alt="explore-img" />}
        >
          <LinkButton
            variant="contained"
            btnColor="secondary-gradient"
            textType="gradient"
            href="/explore"
          >
            Explore Connections
          </LinkButton>
        </MainCard>
      )}
    </>
  );
};

export default ExploreConnections;
