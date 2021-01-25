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
  IonCol,
  IonInput,
  IonFabList
} from '@ionic/react';
import style from './style.module.scss';
import charles from '../../theme/images/charles.jpeg'
import vitalik from '../../theme/images/vitalik.jpeg'
import pomp from '../../theme/images/pomp.jpg'
import verified from '../../assets/verified.svg'
import { Link } from 'react-router-dom';
import { IFollowingResponse, IFollowingItem, ProfileService, IFollowerResponse } from 'src/services/profile.service';
import { parseJsonSourceFileConfigFileContent } from 'typescript';
import { HiveService } from 'src/services/hive.service';
import { DidService } from 'src/services/did.service';



const FollowingList: React.FC = () => {

  const [listContacts, setListContacts] = useState<IFollowingResponse>({ get_following: { items: [] } });
  const [listFollowers, setListFollowers] = useState<IFollowerResponse>({ get_followers: { items: [] } });
  const [profileService, setProfileService] = useState(new ProfileService());
  const [didFollow, setDidFollow] = useState('');

  const getUserHiveInstance = async (): Promise<ProfileService> => {
    return ProfileService.getProfileServiceInstance();
  }

  const follow = async () => {

    let list: any = await profileService.addFollowing(didFollow);
    setListContacts(list);
    setDidFollow('');
  }

  const reset = async () => {
    let list: any = await profileService.resetFollowing();
    setListContacts(list);
  }

  const resolveUserInfo = (did: string) => {
    var image = "data:image/png;base64, ";
    return image;
  }

  const getFollowersCount = (did: string): string => {
    if (listFollowers.get_followers.items.length > 0)
      return listFollowers.get_followers.items[0].followers.length.toString();
    else
      return "";
  }


  useEffect(() => {
    (async () => {
      let profileService = await getUserHiveInstance();
      setProfileService(profileService);

      let list: IFollowingResponse = await profileService.getFollowings();
      debugger;
      let listDids = list.get_following.items.map(p => p.did);
      console.log(JSON.stringify(listDids));
      let followers: IFollowerResponse = await profileService.getFollowers(listDids);

      console.log(JSON.stringify(list));
      console.log(JSON.stringify(followers));

      setListContacts(list);
      setListFollowers(followers);

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
              <IonCol size="*"><img className={style["thumbnail"]} src={resolveUserInfo(item.did)} /></IonCol>


              <IonCol size="10">
                <div><span className={style["name"]}>did {item.did}</span><img src={verified} className={style["verified"]} /></div>
                <div><span className={style["number-followers"]}>followers {getFollowersCount(item.did)}</span></div>
              </IonCol>
            </IonRow>
          )))
        }

      </IonGrid>
      <IonInput placeholder="did" value={didFollow} onIonChange={(event) => setDidFollow((event.target as HTMLInputElement).value)}></IonInput>
      <span className={style["invite"]} onClick={follow}>+ Follow someone</span>



    </div>
  )
};

export default FollowingList;
