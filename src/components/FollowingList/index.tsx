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
  IonInput
} from '@ionic/react';
import style from './style.module.scss';
import charles from '../../theme/images/charles.jpeg'
import vitalik from '../../theme/images/vitalik.jpeg'
import pomp from '../../theme/images/pomp.jpg'
import verified from '../../assets/verified.svg'
import { Link } from 'react-router-dom';
import { IFollowingResponse, IFollowingItem, ProfileService } from 'src/services/profile.service';
import { parseJsonSourceFileConfigFileContent } from 'typescript';
import { HiveService } from 'src/services/hive.service';
import { DidService } from 'src/services/did.service';



const FollowingList: React.FC = () => {

  const [listContacts, setListContacts] = useState<IFollowingResponse>({ get_following: { items: [] } });
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

  // const connectCentralHive = async () => {


  //   let challenge = await HiveService.getHiveChallenge(address)
  //   let presentation = await DidService.generateVerifiablePresentationFromUserMnemonics(mnemonic.join(" "), "", challenge.issuer, challenge.nonce)
  //   let token = await HiveService.getUserHiveToken(address, presentation)

  //   //setHiveAddress(address)
  //   //setUserToken(token)



  // }


  useEffect(() => {
    (async () => {
      let profileService = await getUserHiveInstance();
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
              <IonCol size="*"><img className={style["thumbnail"]} src={resolveUserInfo(item.did)} /></IonCol>


              <IonCol size="10">
                <div><span className={style["name"]}>did {item.did}</span><img src={verified} className={style["verified"]} /></div>
                <div><span className={style["number-followers"]}>100K followers</span></div>
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
