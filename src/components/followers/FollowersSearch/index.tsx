import React, { useState, useEffect } from 'react';
import { IonContent, IonGrid, IonRow, IonSearchbar } from '@ionic/react';
import style from './style.module.scss';
import {
  IUniversitiesResponse,
  IUserResponse,
  SearchService,
} from 'src/services/search.service';
import FollowersHeader from '../FollowersHeader';
import PeopleCard from 'src/components/cards/PeopleCard';
import {
  IFollowerResponse,
  ProfileService,
} from 'src/services/profile.service';

const FollowersSearch: React.FC = () => {
  const [filteredUsers, setFilteredUsers] = useState<IUserResponse>({
    get_users: { items: [] },
  });
  const [listFollowers, setListFollowers] = useState<IFollowerResponse>({
    get_followers: { items: [] },
  });

  // const [searchService, setSearchService] = useState(new SearchService());
  const [profileService, setProfileService] = useState(new ProfileService());

  // const getUserHiveInstance = async (): Promise<SearchService> => {
  //   return SearchService.getSearchServiceInstance();
  // };

  // const getUserHiveInstance = async (): Promise<ProfileService> => {
  //   return ProfileService.getProfileServiceInstance();
  // };

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

  // useEffect(() => {
  //   (async () => {
  //     let searchService = await getUserHiveInstance();
  //     setSearchService(searchService);
  //   })();
  // }, []);

  const loadFollowersData = async () => {
    try {
      // console.log(profileService);
      // if (!profileService.appHiveClient) {
      //   setProfileService(
      //     await ProfileService.getProfileServiceAppOnlyInstance()
      //   );
      //   console.log('Set app only instance');
      // }
      let listDids = ['did:elastos:iYyWRrP4izZfd26DZytSerbG1f6vqzBRmj'];
      let followers = await profileService.getFollowers(listDids);
      console.log('Followers: ', followers);
      setListFollowers(followers as IFollowerResponse);

      console.log('List Followers: ', listFollowers);
    } catch (e) {
      console.error('cant get followers count');
    }
  };

  const loadUsersData = async () => {
    let searchServiceLocal: SearchService;

    console.log(listFollowers.get_followers);

    let dids: string[] = [];

    if (
      listFollowers.get_followers.items &&
      listFollowers.get_followers.items.length
    ) {
      console.log('listFollowers.get_followers.items');
      console.log(listFollowers.get_followers.items);

      dids = listFollowers.get_followers.items[0].followers.map((u) => u);
    }
    // listFollowers.get_followers &&
    // listFollowers.get_followers.items &&

    console.log('DIDs to grab: ', dids);

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
      console.error('could not load users');
      // setError({ hasError: true, errorDescription: 'cant load followers' });
      return;
    }
  };

  useEffect(() => {
    (async () => {
      await loadFollowersData();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await loadUsersData();
    })();
  }, [listFollowers]);

  const invokeSearch = async (searchQuery: string) => {
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

  return (
    <>
      <FollowersHeader
        followersCount={listFollowers.get_followers.items.length}
      />
      {/* <IonContent className={style['followingsearch']}>
        <IonSearchbar
          value={searchQuery}
          onIonChange={(e) => search(e)}
          placeholder='Search people, pages by name or DID'
          className={style['search-input']}
        ></IonSearchbar>
      </IonContent> */}
      <IonGrid className={style['tab-grid']}>
        <IonRow>
          <PeopleCard
            people={filteredUsers.get_users}
            searchKeyword={searchQuery}
            isSearchKeywordDID={isDID(searchQuery)}
            showHeader={false}
            size='6'
          />
        </IonRow>
      </IonGrid>
    </>
  );
};

export default FollowersSearch;
