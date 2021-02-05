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
  IonFabList,
  IonRouterLink
} from '@ionic/react';
import style from './style.module.scss';
import charles from '../../theme/images/charles.jpeg'
import vitalik from '../../theme/images/vitalik.jpeg'
import pomp from '../../theme/images/pomp.jpg'
import verified from '../../assets/verified.svg'
import { Link, RouteComponentProps } from 'react-router-dom';
import { IFollowingResponse, IFollowingItem, ProfileService, IFollowerResponse } from 'src/services/profile.service';
import { parseJsonSourceFileConfigFileContent } from 'typescript';
import { HiveService } from 'src/services/hive.service';
import { DidService } from 'src/services/did.service';
import { Interface } from 'readline';

export interface IDidDocument {
  id: string;
  publicKey?: (PublicKeyEntity)[] | null;
  verifiableCredential: (VerifiableCredentialEntity)[];
  expires: string;

}
export interface PublicKeyEntity {
  id: string;
  type: string;
  controller: string;

}
export interface VerifiableCredentialEntity {
  id: string;
  type?: (string)[] | null;
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: CredentialSubject;

}
export interface CredentialSubject {
  id: string;
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
  birthdate?: string | null;
}

export interface AvatarCredential {
  "content-type": string;
  data: string;
}

export interface IError {
  hasError: boolean,
  errorDescription?: string
}

const FollowingList: React.FC<any> = (props?: any) => {

  const [listContacts, setListContacts] = useState<IFollowingResponse>({ get_following: { items: [] } });
  const [listFollowers, setListFollowers] = useState<IFollowerResponse>({ get_followers: { items: [] } });
  const [profileService, setProfileService] = useState(new ProfileService());
  const [didFollow, setDidFollow] = useState('');
  const [didDocuments, setDidDocuments] = useState<IDidDocument[]>([]);
  const [error, setError] = useState<IError>({ hasError: false });


  const getUserHiveInstance = async (): Promise<ProfileService> => {
    return ProfileService.getProfileServiceInstance();
  }

  const getappHiveInstance = async (): Promise<ProfileService> => {
    return ProfileService.getProfileServiceAppOnlyInstance();
  }

  const follow = async () => {

    let list: any = await profileService.addFollowing(didFollow);
    setListContacts(list);

  }

  const reset = async () => {
    let list: any = await profileService.resetFollowing();
    setListContacts(list);
  }

  const resolveUserInfo = (did: string): any => {
    let name: string | null = did;
    let avatar: AvatarCredential | null;
    let image: string = "";
    didDocuments.forEach((didDoc: IDidDocument) => {

      if (didDoc === undefined) return;
      console.log(JSON.stringify(didDoc));
      if (did === didDoc.id && didDoc.verifiableCredential !== undefined) {

        didDoc.verifiableCredential.forEach((item: VerifiableCredentialEntity) => {
          if (item.credentialSubject.name !== undefined) {
            name = item.credentialSubject.name;
            console.log(name);

          }
          if (item.credentialSubject.avatar !== undefined) {
            avatar = item.credentialSubject.avatar as unknown as AvatarCredential;
            console.log("avatar " + JSON.stringify(avatar.data));
            let type = avatar["content-type"];
            image = `data:${type};base64, ${avatar.data}`;
          }

        })
      }
    })


    return { "name": name, "image": image };

  }

  const unfollow = async (did: string) => {
    let list: any = await profileService.unfollow(did);
    setListContacts(list);

  }

  const getLink = (did: string) => {
    //console.log(window.location.host + "/did/" + did);
    return "/did/" + did;

  }

  const getFollowersCount = (did: string): string => {
    let val: string = "";
    if (listFollowers.get_followers.items !== undefined && listFollowers.get_followers.items.length > 0) {
      console.log("did: " + did);
      console.log(JSON.stringify(listFollowers));

      listFollowers.get_followers.items.forEach((item) => {
        if (item.did === did) {
          val = item.followers.length.toString();
        }

      });
    }
    return val;
  }

  const getPage = (error: IError) => {
    if (error.hasError) {
      return <div className={style["followinglist"]}>
        <span>{error.errorDescription}</span>
      </div>
    } else {
      return (
        <div className={style["followinglist"]}>
          {/*-- Default FollowingList --*/}



          <h1>Following ({listContacts.get_following.items.length})</h1><h1 onClick={reset}>Reset</h1>

          <IonGrid>
            {
              listContacts.get_following.items.map(((item: IFollowingItem, index) => (
                <IonRow key={index} >
                  <IonCol size="*"><img className={style["thumbnail"]} src={resolveUserInfo(item.did).image} /></IonCol>
                  {/* <IonCol size="*"><img className={style["thumbnail"]} src={vitalik} /></IonCol> */}

                  <IonCol size="7" >
                    <Link to={getLink(item.did)} >
                      <div><span className={style["name"]}>{resolveUserInfo(item.did).name}</span><img src={verified} className={style["verified"]} /></div>
                      <div><span className={style["number-followers"]}>followers {getFollowersCount(item.did)}</span></div>

                    </Link>
                  </IonCol>
                  <IonCol size="3"><IonButton size="small" onClick={() => unfollow(item.did)}>Unfollow</IonButton></IonCol>
                </IonRow>

              )))
            }

          </IonGrid>
          <IonInput placeholder="did" value={didFollow} onIonChange={(event) => setDidFollow((event.target as HTMLInputElement).value)}></IonInput>
          <span className={style["invite"]} onClick={follow}>+ Follow someone</span>
        </div >
      )
    }
  }

  const loadData = async (did: string) => {
    let profileService: ProfileService;

    debugger;
    if (did === undefined) {
      profileService = await getUserHiveInstance();
      console.log("get user instance");


    } else {
      profileService = await getappHiveInstance();
      console.log("get app instance");
    }
    setProfileService(profileService);

    let list: IFollowingResponse;
    try {
      list = await profileService.getFollowings(did);

    } catch (e) {
      list = { get_following: { items: [] } };
      console.error("cant load followings");
      setError({ hasError: true, errorDescription: "cant load followings" });
      debugger;
      return;
    }
    debugger;
    let listDids = list.get_following.items.map(p => p.did);

    let followers = await profileService.getFollowers(listDids);

    if (listContacts.get_following.items.length !== list.get_following.items.length) {

      setListContacts(list);

    }
    setListFollowers(followers as IFollowerResponse);

    let docs: IDidDocument[] = [];
    await Promise.all(listDids.map(async (did) => {
      let doc = await DidService.getDidDocument(did);
      docs.push(doc);
    }));

    console.log("docs " + JSON.stringify(docs))
    setDidDocuments(docs)

  }


  useEffect(() => {
    (async () => {
      await loadData(props.did);

    })()
  }, [listContacts]);



  return (
    <div>
      {getPage(error)}
    </div>
  );




}


export default FollowingList;
