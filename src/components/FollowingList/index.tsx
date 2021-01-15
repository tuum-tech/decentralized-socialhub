import React, { useEffect, useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonSpinner,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import style from './style.module.scss';
import charles from '../../theme/images/charles.jpeg'
import vitalik from '../../theme/images/vitalik.jpeg'
import pomp from '../../theme/images/pomp.jpg'
import verified from '../../assets/verified.svg'
import { Link } from 'react-router-dom';
import { IFollowingResponse, IFollowingItem, ProfileService } from 'src/services/profile.service';
import { parseJsonSourceFileConfigFileContent } from 'typescript';



const FollowingList: React.FC = () => {

  const [listContacts, setListContacts] = useState<IFollowingResponse>({ get_following: { items: [] } });
  const [profileService, setProfileService] = useState(new ProfileService());

  const getInstance = async (): Promise<ProfileService> => {
    return ProfileService.getProfileServiceInstance();
  }

  const follow = async () => {
    let list: any = await profileService.addFollowing("adsdsadssdasdasdd");
    setListContacts(list);
  }

  const reset = async () => {
    let list: any = await profileService.resetFollowing();
    setListContacts(list);
  }



  useEffect(() => {
    (async () => {
      let profileService = await getInstance();
      setProfileService(profileService);

      let list: IFollowingResponse = await profileService.getFollowings();
      setListContacts(list);

    })()
  }, [])



  return (
    <div className={style["followinglist"]}>
      {/*-- Default FollowingList --*/}

      <h1>Following ({listContacts.get_following.items.length})</h1><h1 onClick={reset}>Reset</h1>

      <IonGrid>
        {
          listContacts.get_following.items.map(((item: IFollowingItem) => (
            <IonRow>
              <IonCol size="*"><img className={style["thumbnail"]} src={charles} /></IonCol>
              <IonCol size="10">
                <div><span className={style["name"]}>did {item.did}</span><img src={verified} className={style["verified"]} /></div>
                <div><span className={style["number-followers"]}>100K followers</span></div>
              </IonCol>
            </IonRow>
          )))
        }

      </IonGrid>
      <span className={style["invite"]} onClick={follow}>+ Invite friends to join</span>



    </div>
  )
};

export default FollowingList;
