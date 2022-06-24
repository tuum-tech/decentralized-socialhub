import React, { useState, useEffect } from 'react';

import PeopleCard from 'src/components/cards/PeopleCard';
import { ProfileService } from 'src/services/profile.service';
import { alertError } from 'src/utils/notify';
import NoConnectionComp from 'src/components/NoConnection';

import { FollowService } from 'src/services/follow.service';
import SearchInput from 'src/elements/inputs/SearchInput';

export interface IUserResponse {
  items: {
    did: string;
    name: string;
    avatar?: string;
    hiveHost: string;
  }[];
}
interface Props {
  userSession: ISessionItem;
}

// const FollowersSearch: React.FC = () => {
const FollowersSearch: React.FC<Props> = ({ userSession }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<IUserResponse>({
    items: []
  });

  const [listFollowers, setListFollowers] = useState<IFollowerResponse>({
    get_followers: { items: [] }
  });
  const [listFollowing, setListFollowing] = useState<IFollowingResponse>({
    get_following: { items: [] }
  });

  const [mutualFollowerDids, setMutualFollowerDids] = useState<string[]>([]);

  const [followersCount, setFollowersCount] = useState(0);

  // ID text strings within Elastos DID is an ID Sidechain address encoded
  // using Bitcoin-style Base58 and starting with the letter "i",
  // such asicJ4z2DULrHEzYSvjKNJpKyhqFDxvYV7pN. The DID text string is case sensitive.
  // https://github.com/elastos/Elastos.DID.Method/blob/master/DID/Elastos-DID-Method-Specification_en.md
  const isDID = (str: string): boolean => {
    // Following are the valid patterns:
    // did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX
    // icJ4z2DULrHEzYSvjKNJpKyhqFDxvYV7pN

    const regex = /^(did:elastos:i|i)+[a-zA-Z0-9]+$/g;
    return str != null && regex.test(str.trim());
  };

  const unfollowMutualFollower = (did: string) => {
    let newItems: any = listFollowing.get_following.items.filter(
      item => item.did !== did
    );

    let following: IFollowingResponse = {
      get_following: { items: newItems }
    };

    setListFollowing(following);
  };

  useEffect(() => {
    (async () => {
      if (
        userSession &&
        userSession.did !== '' &&
        userSession.tutorialStep === 4
      ) {
        try {
          if (userSession && userSession.did) {
            let listDids = [userSession.did];
            let followers = await ProfileService.getFollowers(listDids);
            setListFollowers(followers as IFollowerResponse);
          }
        } catch (e) {
          alertError(null, 'Could not retrieve your followers');
        }

        try {
          if (userSession && userSession.did) {
            let following = await ProfileService.getFollowings(userSession.did);
            setListFollowing(following as IFollowingResponse);
          }
        } catch (e) {
          alertError(null, 'Could not load users that you follow');
        }
      }
    })();
  }, [userSession, userSession.did]);

  useEffect(() => {
    if (!listFollowing || !listFollowers) return;

    let followingDids =
      listFollowing.get_following.items.length > 0
        ? listFollowing.get_following.items.map(item => item.did)
        : [];
    let followerDids =
      listFollowers.get_followers.items.length > 0
        ? listFollowers.get_followers.items[0].followers
        : [];

    setMutualFollowerDids(
      followerDids.filter((did: string) => followingDids.indexOf(did) !== -1)
    );
  }, [listFollowers, listFollowing]);

  useEffect(() => {
    (async () => {
      setFollowersCount(mutualFollowerDids.length);
      try {
        const fUsers = await FollowService.invokeSearch(
          mutualFollowerDids,
          searchQuery,
          200,
          1
        );
        setFilteredUsers({ items: fUsers });
      } catch (e) {
        setFilteredUsers({ items: [] });
        alertError(null, 'Could not load users');
        return;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutualFollowerDids, searchQuery]);

  return (
    <>
      {followersCount === 0 ? (
        <NoConnectionComp pageType="mutuals" />
      ) : (
        <>
          <SearchInput
            value={searchQuery}
            onIonChange={(e: any) => setSearchQuery(e.target.value)}
            placeholder="Search people, pages by name or DID"
          ></SearchInput>
          <PeopleCard
            people={filteredUsers}
            following={listFollowing.get_following}
            searchKeyword={searchQuery}
            isSearchKeywordDID={isDID(searchQuery)}
            showHeader={false}
            showMutualFollowers={true}
            unfollowMutualFollower={unfollowMutualFollower}
            size="6"
          />
        </>
      )}
    </>
  );
};

export default FollowersSearch;
