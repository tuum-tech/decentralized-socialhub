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
    let mounted = true;
    (async () => {
      let fUserDids: string[] = [];
      if (session && session.tutorialStep === 4) {
        let followings = await ProfileService.getFollowings(session.did);
        if (followings && followings.items && followings.items.length > 0) {
          fUserDids = followings.items.map(item => item.did);
        }

        let followers = await ProfileService.getFollowers([did]);
        if (followers) {
          for (let i = 0; i < followers.items.length; i++) {
            if (!fUserDids.includes(followers.items[i].did)) {
              fUserDids.push(followers.items[i].did);
            }
          }
        }
        if (fUserDids.length > 0 && fUserDids.includes(did)) {
          fUserDids = fUserDids.filter(item => item !== did);
        }
      }
      if (mounted) {
        setConnectedDids(fUserDids);
      }
    })();

    return () => {
      mounted = false;
    };
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
