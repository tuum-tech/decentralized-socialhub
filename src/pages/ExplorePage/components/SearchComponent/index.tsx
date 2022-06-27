import React, { useState, useEffect } from 'react';
import { IonContent, IonSearchbar } from '@ionic/react';
import style from './style.module.scss';
import {
  IUniversitiesResponse,
  SearchService
} from 'src/services/search.service';
import ExploreNav from '../ExploreNav';
import { ProfileService } from 'src/services/profile.service';
import { alertError } from 'src/utils/notify';
import LoadingIndicator from 'src/elements/LoadingIndicator';

export interface IUserResponse {
  _status?: string;
  get_users_by_onBoardingInfo: {
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
const SearchComponent: React.FC<Props> = ({ userSession }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filteredUniversities, setFilteredUniversities] = useState<
    IUniversitiesResponse
  >({ get_universities: { items: [] } });

  const [filteredUsers, setFilteredUsers] = useState<PeopleDTO>({ items: [] });
  const [listFollowing, setListFollowing] = useState<IFollowingResponse>({
    get_following: { items: [] }
  });
  const [searchService, setSearchService] = useState(new SearchService());

  const getSearchAppHiveInstance = async (): Promise<SearchService> => {
    return SearchService.getSearchServiceAppOnlyInstance();
  };

  const [searchQuery, setSearchQuery] = useState('');

  const [isLoading, setIsLoading] = useState(true);
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
      let searchService = await getSearchAppHiveInstance();
      setSearchService(searchService);
    })();
  }, []);

  const loadData = async () => {
    if (searchService.appHiveClient) {
      try {
        let listUsers: any = await searchService.getUsers(
          '',
          200,
          0,
          userSession
        );

        setFilteredUsers(listUsers);
      } catch (e) {
        setFilteredUsers({ items: [] });
        alertError(null, 'Could not load users');
        return;
      }
    }

    try {
      if (userSession && userSession.did && userSession.onBoardingCompleted) {
        let following = await ProfileService.getFollowings(userSession.did);
        if (following) {
          setListFollowing(following as IFollowingResponse);
          return;
        }
      }
    } catch (e) {
      alertError(null, 'Could not load users that you follow');
    }
    setListFollowing({ get_following: { items: [] } });
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await loadData();
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchService]);

  const invokeSearch = async (searchQuery: string) => {
    // let listUniversities: any = await searchService.getUniversities(
    //   searchQuery,
    //   200,
    //   0
    // );
    // setFilteredUniversities(listUniversities.response);
    let listUsers: any = await searchService.getUsers(
      searchQuery,
      200,
      0,
      userSession
    );
    setFilteredUsers(listUsers);
  };

  useEffect(() => {
    (async () => {
      if (searchQuery !== '' && searchQuery.length > 2) {
        invokeSearch(searchQuery);
      }
      // else if (searchQuery === '') {
      //   setSearchQuery('');
      //   setIsLoading(true);
      //   await loadData();
      //   setIsLoading(false);
      // }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const search = (e: any) => {
    setSearchQuery(e.detail.value!);
  };

  return (
    <>
      {isLoading ? (
        <LoadingIndicator loadingText="Loading data..." />
      ) : (
        <>
          <IonContent className={style['searchcomponent']}>
            <IonSearchbar
              value={searchQuery}
              onIonChange={e => search(e)}
              placeholder="Search people, pages by name or DID"
              className={style['search-input']}
            ></IonSearchbar>
          </IonContent>
          <ExploreNav
            people={filteredUsers}
            following={listFollowing.get_following}
            pages={
              filteredUniversities && filteredUniversities.get_universities
            }
            searchKeyword={searchQuery}
            isSearchKeywordDID={isDID(searchQuery)}
          />
        </>
      )}
    </>
  );
};

export default SearchComponent;
