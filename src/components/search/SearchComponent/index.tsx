import React, { useState, useEffect } from 'react';
import { IonContent, IonGrid, IonSearchbar } from '@ionic/react';
import style from './style.module.scss';
import {
  IUniversitiesResponse,
  IUserResponse,
  SearchService,
} from 'src/services/search.service';
import ExploreNav from '../ExploreNav';

const SearchComponent: React.FC = () => {
  const [
    filteredUniversities,
    setFilteredUniversities,
  ] = useState<IUniversitiesResponse>({ get_universities: { items: [] } });

  const [filteredUsers, setFilteredUsers] = useState<IUserResponse>({
    get_users: { items: [] },
  });
  const [searchService, setSearchService] = useState(new SearchService());

  const getUserHiveInstance = async (): Promise<SearchService> => {
    return SearchService.getSearchServiceInstance();
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
      let searchService = await getUserHiveInstance();
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
        pages={filteredUniversities.get_universities}
        searchKeyword={searchQuery}
        isSearchKeywordDID={isDID(searchQuery)}
      />
    </>
  );
};

export default SearchComponent;
