import React, { useState, useEffect } from 'react';
import { IonContent, IonGrid, IonSearchbar } from '@ionic/react';
import style from './style.module.scss';
import {
  IUniversitiesResponse,
  IUserResponse,
  SearchService,
} from 'src/services/search.service';
import ExploreNav from '../ExploreNav';
import {
  IFollowingResponse,
  ProfileService,
} from 'src/services/profile.service';
import { UserService } from 'src/services/user.service';

const SearchComponent: React.FC = () => {
  const [
    filteredUniversities,
    setFilteredUniversities,
  ] = useState<IUniversitiesResponse>({ get_universities: { items: [] } });

  const [filteredUsers, setFilteredUsers] = useState<IUserResponse>({
    get_users: { items: [] },
  });
  const [listFollowing, setListFollowing] = useState<IFollowingResponse>({
    get_following: { items: [] },
  });

  const [searchService, setSearchService] = useState(new SearchService());

  const getSearchUserHiveInstance = async (): Promise<SearchService> => {
    return SearchService.getSearchServiceInstance();
  };

  const getUserHiveInstance = async (): Promise<ProfileService> => {
    return ProfileService.getProfileServiceUserOnlyInstance();
  };

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
      let searchService = await getSearchUserHiveInstance();
      setSearchService(searchService);
    })();
  }, []);

  const loadData = async () => {
    let searchServiceLocal: SearchService;

    try {
      searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
      let listUniversities: any = await searchServiceLocal.getUniversities(
        '',
        200,
        0
      );
      setFilteredUniversities(listUniversities.response);

      let listUsers: any = await searchServiceLocal.getUsers('', 200, 0);
      setFilteredUsers(listUsers.response);

      let user = UserService.GetUserSession();

      if (user.did) {
        let profileServiceLocal = await getUserHiveInstance();
        let following = await profileServiceLocal.getFollowings(user.did);
        setListFollowing(following as IFollowingResponse);
      }
    } catch (e) {
      setFilteredUniversities({ get_universities: { items: [] } });
      setFilteredUsers({ get_users: { items: [] } });
      console.error('could not load universities or users');
      // setError({ hasError: true, errorDescription: 'cant load followings' });
      return;
    }
  };

  useEffect(() => {
    (async () => {
      await loadData();
    })();
  }, []);

  const invokeSearch = async (searchQuery: string) => {
    let listUniversities: any = await searchService.getUniversities(
      searchQuery,
      200,
      0
    );

    setFilteredUniversities(listUniversities.response);

    let listUsers: any = await searchService.getUsers(searchQuery, 200, 0);
    setFilteredUsers(listUsers.response);
  };

  useEffect(() => {
    if (searchQuery !== '' && searchQuery.length > 2) {
      invokeSearch(searchQuery);
    } else if (searchQuery == '') {
      setSearchQuery('');
      loadData();
    }
  }, [searchQuery]);

  const search = (e: any) => {
    setSearchQuery(e.detail.value!);
  };

  return (
    <>
      <IonContent className={style['searchcomponent']}>
        <IonSearchbar
          value={searchQuery}
          onIonChange={(e) => search(e)}
          placeholder='Search people, pages by name or DID'
          className={style['search-input']}
        ></IonSearchbar>
        {/* <IonSpinner /> */}
      </IonContent>
      <ExploreNav
        people={filteredUsers.get_users}
        following={listFollowing.get_following}
        pages={filteredUniversities.get_universities}
        searchKeyword={searchQuery}
        isSearchKeywordDID={isDID(searchQuery)}
      />
    </>
  );
};

export default SearchComponent;
