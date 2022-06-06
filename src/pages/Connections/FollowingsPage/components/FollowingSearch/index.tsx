import React, { useState, useEffect } from 'react';
import { IUniversitiesResponse } from 'src/services/search.service';
import FollowingTabs from '../FollowingTabs';
import { ProfileService } from 'src/services/profile.service';
import { alertError } from 'src/utils/notify';
import { FollowService } from 'src/services/follow.service';

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
  searchQuery: string;
}

const FollowingSearch: React.FC<Props> = ({
  userSession,
  searchQuery
}: Props) => {
  const [filteredUniversities] = useState<IUniversitiesResponse>({
    get_universities: { items: [] }
  });

  const [filteredUsers, setFilteredUsers] = useState<IUserResponse>({
    items: []
  });
  const [listFollowing, setListFollowing] = useState<IFollowingResponse>({
    get_following: { items: [] }
  });

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

  useEffect(() => {
    (async () => {
      // await loadFollowingData();
      try {
        if (userSession && userSession.did && userSession.tutorialStep === 4) {
          let following = await ProfileService.getFollowings(userSession.did);
          setListFollowing(following as IFollowingResponse);
        }
      } catch (e) {
        alertError(null, 'Could not load users that you follow');
      }
    })();
  }, [userSession, userSession.did]);

  useEffect(() => {
    (async () => {
      let dids: string[] = [];

      if (
        listFollowing.get_following.items &&
        listFollowing.get_following.items.length
      ) {
        dids = listFollowing.get_following.items.map(u => u.did);
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
  }, [listFollowing, searchQuery]);

  const getFollowingCount = (): number => {
    return listFollowing.get_following.items.length;
  };

  return (
    <>
      {/* <FollowingHeader followingCount={getFollowingCount()} /> */}
      <FollowingTabs
        people={filteredUsers}
        following={listFollowing.get_following}
        pages={filteredUniversities.get_universities}
        searchKeyword={searchQuery}
        isSearchKeywordDID={isDID(searchQuery)}
      />
    </>
  );
};

export default FollowingSearch;
