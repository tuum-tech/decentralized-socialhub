import React, { useState, useEffect } from 'react';
import { StaticContext, RouteComponentProps } from 'react-router';

import MainLayout from 'src/components/layouts/MainLayout';
import HeaderMenu from 'src/elements-v2/HeaderMenu';
import { ProfileService } from 'src/services/profile.service';
import useSession from 'src/hooks/useSession';
import FollowersSearch from './FollowersPage/FollowersSearch';
import MutualFollowersSearch from './MutualFollowersPage/FollowersSearch';
import FollowingSearch from './FollowingsPage/FollowingSearch';
import ConnectionPageHeader, {
  ConnectionTabsContainer,
  Header
} from './ConnectionHeader';

interface PageProps
  extends RouteComponentProps<{}, StaticContext, { active?: string }> {}

const Connections: React.FC<PageProps> = ({ ...props }: PageProps) => {
  const [active, setActive] = useState(
    props.location.state?.active ?? 'followers'
  );

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [mutualFollowerCount, setMutualFollowerCount] = useState(0);

  const { session } = useSession();
  useEffect(() => {
    (async () => {
      try {
        if (session && session.did && session.tutorialStep === 4) {
          let followers = await ProfileService.getFollowers([session.did]);
          let following = await ProfileService.getFollowings(session.did);
          const item = followers?.items.find(item => item.did === session.did);
          setFollowersCount(item?.followers.length ?? 0);
          setFollowingCount(following?.items.length ?? 0);

          if (followers && following) {
            let followingDids = following?.items.length
              ? following?.items.map(item => item.did)
              : [];
            console.log(12312, followingDids);
            let followerDids = followers?.items.length
              ? followers?.items[0].followers
              : [];

            setMutualFollowerCount(
              followerDids?.filter(did => followingDids.indexOf(did) !== -1)
                .length ?? 0
            );
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [session, session.did]);

  return (
    <MainLayout>
      <Header>
        <HeaderMenu title="Connections" />
      </Header>

      <ConnectionTabsContainer template="default">
        <ConnectionPageHeader
          active={active}
          setActive={setActive}
          followersCount={followersCount}
          followingCount={followingCount}
          mutualFollowerCount={mutualFollowerCount}
        />

        {active === 'followers' && <FollowersSearch userSession={session} />}
        {active === 'following' && <FollowingSearch userSession={session} />}
        {active === 'mutual' && <MutualFollowersSearch userSession={session} />}
      </ConnectionTabsContainer>
    </MainLayout>
  );
};

export default Connections;
