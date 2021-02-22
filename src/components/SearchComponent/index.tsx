import React, { useState, useEffect } from 'react';
import {
  IonHeader,
  IonSpinner,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonFooter,
  IonModal,
  IonIcon,
  IonSearchbar,
} from '@ionic/react';
import style from './style.module.scss';
// import { useEduInstituteSearch } from './hooks/useEduInstituteSearch';
import {
  IUniversitiesResponse,
  IUserResponse,
  SearchService,
} from 'src/services/search.service';

interface IEduInstituteSearchItem {
  web_pages: string[];
  domains: string[];
  'state-province': null;
  country: string;
  alpha_two_code: string;
  name: string;
}

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
    console.log('GOT USER HIVE INSTANCE');

    return SearchService.getSearchServiceInstance();
  };

  // const getAppHiveInstance = async (): Promise<SearchService> => {
  //   return SearchService.getSearchServiceAppOnlyInstance();
  // };

  const [searchQuery, setSearchQuery] = useState('');
  // const [filteredSearch, setFilteredSearch] = useState([{
  //   "web_pages": [],
  //   "domains": [],
  //   "state-province": null,
  //   "country": "",
  //   "alpha_two_code": "",
  //   "name": ""
  // }]);

  useEffect(() => {
    (async () => {
      console.log('I am being called, dont you worry');

      let searchService = await getUserHiveInstance();
      console.log('trying to set Search service');
      setSearchService(searchService);
      console.log('Search service is set');
    })();
  }, []);

  const invokeSearch = async (searchQuery: string) => {
    // setFilteredUsers(await searchService.getUsers(searchQuery));

    // let listUniversities: any = await searchService.getUniversities(
    //   searchQuery
    // );

    // setFilteredUniversities(listUniversities);
    // console.log('Universities');
    // console.log(listUniversities);

    console.log('User search invoked');

    let listUsers: any = await searchService.getUsers(searchQuery);
    console.log('Search component set filtered users');
    console.log(listUsers);
    setFilteredUsers(listUsers.response);
  };

  useEffect(() => {
    if (searchQuery !== '') {
      console.log('searchQuery');
      console.log(searchQuery);

      invokeSearch(searchQuery);

      // sendGetEduInstituteSearchReq(searchQuery)
      // let tempSearchResult:any = SEARCH.filter(ele => ele.name.includes(searchQuery))
      // setFilteredSearch([...tempSearchResult])
    } else {
      setSearchQuery('');
      // setFilteredSearch([{
      //   "web_pages": [],
      //   "domains": [],
      //   "state-province": null,
      //   "country": "",
      //   "alpha_two_code": "",
      //   "name": ""
      // }])
      setFilteredUniversities({ get_universities: { items: [] } });
      setFilteredUsers({ get_users: { items: [] } });
    }
  }, [searchQuery]);

  const search = (e: any) => {
    console.log(e.detail.value);
    setSearchQuery(e.detail.value!);
  };

  //Get the list of educational institutes
  // const [sendGetEduInstituteSearchReq] = useEduInstituteSearch((institutes:any) => {
  //   if(institutes) {
  //     setFilteredSearch(institutes)
  //     console.log("setFilteredSearch")
  //     console.log(institutes)
  //   }
  // })

  useEffect(() => {
    console.log('filteredSearch');
    console.log(filteredUniversities);
    console.log(filteredUsers);
    let transition = document.getElementsByClassName(
      'search-transition'
    ) as HTMLCollectionOf<HTMLElement>;
    let searchResult = document.getElementsByClassName(
      'search-result'
    ) as HTMLCollectionOf<HTMLElement>;
    // if (searchResult.length) {
    //   if (filteredUniversities.get_universities.items.length > 1) {
    //     transition[0].style.opacity = '0.3';
    //     searchResult[0].style.display = 'block';
    //   } else {
    //     transition[0].style.opacity = '1';
    //     searchResult[0].style.display = 'none';
    //   }
    // }
  }, [filteredUniversities, filteredUsers]);

  return (
    <IonContent className={style['searchcomponent']}>
      <IonSearchbar
        value={searchQuery}
        onIonChange={(e) => search(e)}
        placeholder='Search people, pages by name or DID'
        className={style['search-input']}
      ></IonSearchbar>
      {/* <IonSpinner /> */}
      <IonGrid className='search-result'>
        {/* {filteredUsers.get_users.items.length > 1 &&
          filteredUsers.get_users.items.map((search, index) => (
            <IonRow key={index}>
              <IonCol>
                <IonCard style={{ marginTop: 0, marginBottom: 0 }}>
                  <IonCardHeader>
                    <IonCardTitle
                      className={style['search-item']}
                      style={{
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: '14px',
                      }}
                    >
                      {search.name} - Company - Higher Education
                    </IonCardTitle>
                  </IonCardHeader>
                </IonCard>
              </IonCol>
            </IonRow>
          ))} */}
      </IonGrid>
    </IonContent>
  );
};

export default SearchComponent;
