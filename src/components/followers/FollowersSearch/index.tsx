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
  IFollowingResponse,
  ProfileService,
} from 'src/services/profile.service';
import { UserService } from 'src/services/user.service';

const FollowersSearch: React.FC = () => {
  const [filteredUsers, setFilteredUsers] = useState<IUserResponse>({
    get_users: { items: [] },
  });
  const [listFollowers, setListFollowers] = useState<IFollowerResponse>({
    get_followers: { items: [] },
  });
  const [listFollowing, setListFollowing] = useState<IFollowingResponse>({
    get_following: { items: [] },
  });

  const [followersCount, setFollowersCount] = useState(0);

  // const [searchService, setSearchService] = useState(new SearchService());
  // const [profileService, setProfileService] = useState(new ProfileService());

  const getUserHiveInstance = async (): Promise<ProfileService> => {
    return ProfileService.getProfileServiceUserOnlyInstance();
  };

  // const getUserHiveInstance = async (): Promise<SearchService> => {
  //   return SearchService.getSearchServiceInstance();
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
      let user = UserService.GetUserSession();

      if (user.did) {
        //Get Followers
        let listDids = [user.did];
        let profileServiceAppInstance = await ProfileService.getProfileServiceAppOnlyInstance();
        let followers = await profileServiceAppInstance.getFollowers(listDids);
        setListFollowers(followers as IFollowerResponse);
      }
    } catch (e) {
      console.error('cant get followers');
    }

    try {
      let user = UserService.GetUserSession();

      if (user.did) {
        //Get Following
        let profileServiceUserInstance = await getUserHiveInstance();
        let following = await profileServiceUserInstance.getFollowings(
          user.did
        );
        setListFollowing(following as IFollowingResponse);
      }
    } catch (e) {
      console.error('cant get following');
    }
  };

  const loadUsersData = async () => {
    let searchServiceLocal: SearchService;

    let dids: string[] = [];

    if (
      listFollowers.get_followers.items &&
      listFollowers.get_followers.items.length
    ) {
      dids = listFollowers.get_followers.items[0].followers.map((u) => u);
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
      let user = UserService.GetUserSession();

      if (user.did) {
        setFollowersCount(getFollowersCount(user.did));
      }
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

  const getFollowersCount = (did: string): number => {
    let val: number = 0;
    try {
      if (
        listFollowers.get_followers.items !== undefined &&
        listFollowers.get_followers.items.length > 0
      ) {
        listFollowers.get_followers.items.forEach((item) => {
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
      <FollowersHeader followersCount={followersCount} />
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
            following={listFollowing.get_following}
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
