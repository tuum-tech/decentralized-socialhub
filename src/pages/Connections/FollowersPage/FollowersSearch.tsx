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
    items: []
  });
  const [listFollowing, setListFollowing] = useState<IFollowingResponse>({
    items: []
  });

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

  // useEffect(() => {
  //   (async () => {
  //     let searchService = await getUserHiveInstance();
  //     setSearchService(searchService);
  //   })();
  // }, []);

  useEffect(() => {
    (async () => {
      if (
        userSession &&
        userSession.did !== '' &&
        userSession.onBoardingCompleted
      ) {
        try {
          if (userSession && userSession.did) {
            let listDids = [userSession.did];
            debugger;
            let followers = await ProfileService.getFollowers(listDids);
            setListFollowers(followers as IFollowerResponse);
          }
        } catch (e) {
          alertError(null, 'Could not retrieve your followers');
        }

        try {
          if (userSession && userSession.did) {
            debugger;
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
    (async () => {
      if (userSession && userSession.did) {
        setFollowersCount(getFollowersCount(userSession.did));
      }

      let dids: string[] = [];
      if (listFollowers.items && listFollowers.items.length) {
        dids = listFollowers.items[0].followers.map(u => u);
      }

      try {
        const fUsers = await FollowService.invokeSearch(
          dids,
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
  }, [listFollowers, searchQuery]);

  const getFollowersCount = (did: string): number => {
    let val: number = 0;
    try {
      if (listFollowers.items !== undefined && listFollowers.items.length > 0) {
        listFollowers.items.forEach(item => {
          if (item.did === did) {
            val = item.followers.length;
          }
        });
      }
    } catch (e) {}
    return val;
  };

  return (
    <>
      {followersCount === 0 ? (
        <NoConnectionComp pageType="followers" />
      ) : (
        <>
          <SearchInput
            value={searchQuery}
            onIonChange={(e: any) => setSearchQuery(e.target.value)}
            placeholder="Search people, pages by name or DID"
          ></SearchInput>
          <PeopleCard
            people={filteredUsers}
            following={listFollowing}
            searchKeyword={searchQuery}
            isSearchKeywordDID={isDID(searchQuery)}
            showHeader={false}
            size="6"
          />
        </>
      )}
    </>
  );
};

export default FollowersSearch;
