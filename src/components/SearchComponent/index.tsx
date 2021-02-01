import React, { useState, useEffect } from "react";
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
} from "@ionic/react";
import style from './style.module.scss';
import { useEduInstituteSearch } from './hooks/useEduInstituteSearch';

  interface IEduInstituteSearchItem {
    "web_pages": string[],
    "domains": string[],
    "state-province": null,
    "country": string,
    "alpha_two_code": string,
    "name": string
  }

const SearchComponent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSearch, setFilteredSearch] = useState([{
    "web_pages": [],
    "domains": [],
    "state-province": null,
    "country": "",
    "alpha_two_code": "",
    "name": ""    
  }]);  

useEffect(() => {

  if(searchQuery !== ""){
    console.log("searchQuery");
    console.log(searchQuery);
    
    sendGetEduInstituteSearchReq(searchQuery)
    // let tempSearchResult:any = SEARCH.filter(ele => ele.name.includes(searchQuery))
    // setFilteredSearch([...tempSearchResult])
  } else {
    setSearchQuery("")
    setFilteredSearch([{
      "web_pages": [],
      "domains": [],
      "state-province": null,
      "country": "",
      "alpha_two_code": "",
      "name": ""    
    }])
  }

},[searchQuery])

const search = (e:any) => {
  console.log(e.detail.value)
  setSearchQuery(e.detail.value!)
}

  //Get the list of educational institutes
  const [sendGetEduInstituteSearchReq] = useEduInstituteSearch((institutes:any) => { 
    if(institutes) {
      setFilteredSearch(institutes)
      console.log("setFilteredSearch")
      console.log(institutes)
    }
  })

  useEffect(() => {
    console.log("filteredSearch");
    console.log(filteredSearch);
    let transition = document.getElementsByClassName("search-transition") as HTMLCollectionOf<HTMLElement>;
    let searchResult = document.getElementsByClassName("search-result") as HTMLCollectionOf<HTMLElement>;
    if(filteredSearch.length > 1){
      transition[0].style.opacity = '0.3';
      searchResult[0].style.display = 'block';
    } else {
      transition[0].style.opacity = '1';
      searchResult[0].style.display = 'none';
    }    
  },[filteredSearch])

  return (
      <IonContent className={"searchcomponent"}>
        <IonSearchbar 
          value={searchQuery} 
          onIonChange={e => search(e) } 
          placeholder="Search Profiles, Pages, Validators" 
          className={style["search-input"]}></IonSearchbar>
        {/* <IonSpinner /> */}
        <IonGrid className="search-result" style={{
          position: 'fixed',
          zIndex: 99999,
          background: '#fff',
          width: '300px',
          marginTop: '-7px',
          borderRadius: '10px'
        }}>
          {filteredSearch.length > 1 && filteredSearch.map((search, index) => (
          <IonRow key={index}>
              <IonCol>
                <IonCard style={{marginTop: 0, marginBottom: 0}}>
                  <IonCardHeader>
                    <IonCardTitle className={style["search-item"]} style={{
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: '14px'
                      }}>
                        {search.name} - Company - Higher Education
                    </IonCardTitle>
                  </IonCardHeader>
                </IonCard>
              </IonCol>
          </IonRow>
          ))}
        </IonGrid>
      </IonContent>
  );
};

export default SearchComponent;