import React, { useState, useEffect } from 'react';

import { ProfileService } from 'src/services/profile.service';
import {
  MainCard,
  CardText,
  CardTitle,
  CardImg,
  LinkButton
} from './ManageProfile';
import exploreCardImg from '../../../../../../assets/dashboard/explore.png';

interface Props {
  did: string;
  session: ISessionItem;
}

const ExploreConnnections: React.FC<Props> = ({ did, session }) => {
  const [connectedDids, setConnectedDids] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      let fUserDids: string[] = [];
      if (session && session.tutorialStep === 4) {
        let followings = await ProfileService.getFollowings(
          session.did,
          session
        );
        if (followings) {
          fUserDids = followings.get_following.items.map(item => item.did);
        }

        let followers = await ProfileService.getFollowers([did], session);
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
  }, [did]);

  return (
    <>
      {connectedDids.length === 0 && (
        <MainCard>
          <CardTitle>Connect with friends, companies</CardTitle>
          <CardText>
            Search for like minded people and make valuable connections. explore
            your influnce circle
          </CardText>
          <LinkButton href="/explore">Expolore connections &gt;</LinkButton>
          <CardImg src={exploreCardImg} />
        </MainCard>
      )}
    </>
  );
};

export default ExploreConnnections;
