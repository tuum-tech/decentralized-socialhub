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

export const SEARCH = [
  {
    id: "s1",
    title: "Business",
    detail:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    page: "/search-business",
  },
  {
    id: "s2",
    title: "Computing",
    detail:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    page: "/search-computing",
  },
  {
    id: "s3",
    title: "Connections",
    detail:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    page: "/search-connections",
  },
  {
    id: "s4",
    title: "Construction",
    detail:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    page: "/search-construction",
  },
  {
    id: "s5",
    title: "Engineering",
    detail:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    page: "/search-engineering",
  },
  {
    id: "s6",
    title: "Graduate",
    detail:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    page: "/search-graduate",
  },
  {
    id: "s7",
    title: "Marketing",
    detail:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    page: "/search-marketing",
  },
  {
    id: "s8",
    title: "Medicine",
    detail:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    page: "/search-medicine",
  },
  {
    id: "s9",
    title: "Science",
    detail:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    page: "/search-science",
  },
];





const SearchComponent: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSearch, setFilteredSearch] = useState([
  {
    id: "",
    title: "",
    detail: "",
    page: "",
  }])

useEffect(() => {
    let tempSearchResult = SEARCH.filter(ele => ele.title.includes(searchQuery))
    setFilteredSearch([...tempSearchResult])
},[searchQuery])

  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Search</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar 
          value={searchQuery} 
          onIonChange={e => setSearchQuery(e.detail.value!)} 
          placeholder="Search Profiles, Pages, Validators" 
          className={style["search-input"]}></IonSearchbar>
        </IonToolbar>
      </IonHeader> */}
      <IonContent className={"searchcomponent"}>
        <IonSearchbar 
          value={searchQuery} 
          onIonChange={e => setSearchQuery(e.detail.value!)} 
          placeholder="Search Profiles, Pages, Validators" 
          className={style["search-input"]}></IonSearchbar>
        <IonSpinner />
        <IonGrid>
          <IonRow>
            {filteredSearch.map((search) => (
              <IonCol
                size="12"
                size-xs="12"
                size-sm="6"
                size-md="4"
                size-lg="4"
                key={search.id}
              >
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>{search.title}</IonCardTitle>
                    <IonCardSubtitle>Sector</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>{search.detail}</IonCardContent>
                  <IonFooter className="ion-text-right">
                    <IonButton
                      color="secondary"
                      fill="clear"
                      routerLink={search.page}
                    >
                      View
                    </IonButton>
                  </IonFooter>
                </IonCard>
              </IonCol>
            ))}
            <IonCol className="ion-text-center">
              <IonModal isOpen={showModal} cssClass="my-custom-class">
                <p>This is modal content</p>
                <IonButton
                  color="secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close Modal
                </IonButton>
              </IonModal>
              <IonButton color="secondary" onClick={() => setShowModal(true)}>
                Information
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default SearchComponent;