import React, { useState, useEffect } from 'react';
import {
  IUniversitiesResponse,
  IUserResponse,
  SearchService
} from 'src/services/search.service';
import FollowingTabs from '../FollowingTabs';
import FollowingHeader from '../FollowingHeader';
import {
  IFollowingResponse,
  ProfileService
} from 'src/services/profile.service';
import { UserService } from 'src/services/user.service';
import { alertError } from 'src/utils/notify';

const FollowingSearch: React.FC = () => {
  const [filteredUniversities, setFilteredUniversities] = useState<
    IUniversitiesResponse
  >({ get_universities: { items: [] } });

  const [filteredUsers, setFilteredUsers] = useState<IUserResponse>({
    get_users: { items: [] }
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

  const loadFollowingData = async () => {
    try {
      let user = UserService.GetUserSession();
      if (user && user.did) {
        let following = await ProfileService.getFollowings(user.did);
        setListFollowing(following as IFollowingResponse);
      }
    } catch (e) {
      alertError(null, 'cant get following');
    }
  };

  const loadUsersData = async () => {
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
      setFilteredUsers({ get_users: { items: [] } });
      alertError(null, 'cant load users');
      return;
    }
  };

  useEffect(() => {
    (async () => {
      await loadFollowingData();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await loadUsersData();
    })();
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
    } else if (searchQuery == '') {
      setSearchQuery('');
      // loadData();
    }
  }, [searchQuery]);

  const search = (e: any) => {
    setSearchQuery(e.detail.value!);
  };

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
        people={filteredUsers.get_users}
        following={listFollowing.get_following}
        pages={filteredUniversities.get_universities}
        searchKeyword={searchQuery}
        isSearchKeywordDID={isDID(searchQuery)}
      />
    </>
  );
};

export default FollowingSearch;
