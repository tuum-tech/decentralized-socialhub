import React, { useState, useEffect } from 'react';
import {
  IUniversitiesResponse,
  SearchService
} from 'src/services/search.service';
import FollowingTabs from '../FollowingTabs';
import FollowingHeader from '../FollowingHeader';
import { ProfileService } from 'src/services/profile.service';
import { alertError } from 'src/utils/notify';

export interface IUserResponse {
  _status?: string;
  get_users_by_dids: {
    items: {
      did: string;
      name: string;
      avatar?: string;
      hiveHost: string;
    }[];
  };
}

interface Props {
  userSession: ISessionItem;
}

const FollowingSearch: React.FC<Props> = ({ userSession }: Props) => {
  const [filteredUniversities] = useState<IUniversitiesResponse>({
    get_universities: { items: [] }
  });

  const [filteredUsers, setFilteredUsers] = useState<IUserResponse>({
    get_users_by_dids: { items: [] }
  });
  const [listFollowing, setListFollowing] = useState<IFollowingResponse>({
    get_following: { items: [] }
  });

  const [searchQuery, setSearchQuery] = useState('');

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
        if (userSession && userSession.did) {
          let following = await ProfileService.getFollowings(
            userSession.did,
            userSession
          );
          setListFollowing(following as IFollowingResponse);
        }
      } catch (e) {
        alertError(null, 'Could not load users that you follow');
      }
    })();
  }, [userSession, userSession.did]);

  useEffect(() => {
    (async () => {
      let searchServiceLocal: SearchService;

      let dids: string[] = [];

      if (
        listFollowing.get_following.items &&
        listFollowing.get_following.items.length
      ) {
        dids = listFollowing.get_following.items.map(u => u.did);
      }

      try {
        searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
        let listUsers: any = await searchServiceLocal.getUsersByDIDs(
          dids,
          200,
          0
        );

        setFilteredUsers(listUsers.response);
      } catch (e) {
        setFilteredUsers({ get_users_by_dids: { items: [] } });
        alertError(null, 'Could not load users');
        return;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listFollowing]);

  const invokeSearch = async (searchQuery: string) => {
    // let listUniversities: any = await searchService.getUniversities(
    //   searchQuery,
    //   200,
    //   0
    // );
    // setFilteredUniversities(listUniversities.response);
    // let listUsers: any = await searchService.getUsers(searchQuery, 200, 0);
    // setFilteredUsers(listUsers.response);
  };

  useEffect(() => {
    if (searchQuery !== '' && searchQuery.length > 2) {
      invokeSearch(searchQuery);
    } else if (searchQuery === '') {
      setSearchQuery('');
      // loadData();
    }
  }, [searchQuery]);

  const getFollowingCount = (): number => {
    return listFollowing.get_following.items.length;
  };

  return (
    <>
      <FollowingHeader followingCount={getFollowingCount()} />
      {/* <IonContent className={style['followingsearch']}>
        <IonSearchbar
          value={searchQuery}
          onIonChange={(e) => search(e)}
          placeholder='Search people, pages by name or DID'
          className={style['search-input']}
        ></IonSearchbar>
      </IonContent> */}
      <FollowingTabs
        people={filteredUsers.get_users_by_dids}
        following={listFollowing.get_following}
        pages={filteredUniversities.get_universities}
        searchKeyword={searchQuery}
        isSearchKeywordDID={isDID(searchQuery)}
      />
    </>
  );
};

export default FollowingSearch;
