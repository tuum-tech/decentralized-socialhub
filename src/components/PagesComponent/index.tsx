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
import google from '../../assets/logo_google.svg';
import facebook from '../../assets/logo_facebook.svg';
import twitter from '../../assets/logo_twitter.svg';
import linkedin from '../../assets/logo_linkedin.svg';

import { Link } from 'react-router-dom';
import { useStore } from 'react-redux';
import { DidService } from 'src/services/did.service';
import { UserService } from 'src/services/user.service';

const FollowingList: React.FC = () => {

  const [googleCredential, setGoogleCredential] = useState("")
  const [facebookCredential, setFacebookCredential] = useState("")
  const [twitterCredential, setTwitterCredential] = useState("")
  const [linkedinCredential, setLinkedinCredential] = useState("")

  const updateValues = async () =>{
    let user = await UserService.getLoggedUser()
    let document = await DidService.getDidDocument(user.did)

    if (!document) {
      console.log("document is empty")
      return
    }
    document.verifiableCredential.forEach((item: any) => {
      let type = item.id.replace(`${user.did}#`, "")
      if (type == "twitter"){
        setTwitterCredential(item.credentialSubject[type])
      }
    });
  }

  const openTwitter = () =>{
    
  }

  useEffect(() => {
    (async () => {
        await updateValues()
    })();
  }, []);

  return (
    <div className={style["pagesList"]}>
      {/*-- Default FollowingList --*/}

      <h1>Verified credentials</h1>
      <IonGrid>
        <IonRow>
          <IonCol size="*"><img className={style["thumbnail"]} src={google} /></IonCol>
          <IonCol size="10">
            <div><span className={style["name"]}>Google</span></div>
            <div><span className={style["number-followers"]}>{googleCredential}</span></div>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="*"><img className={style["thumbnail"]} src={facebook} /></IonCol>
          <IonCol size="10">
            <div><span className={style["name"]}>Facebook</span></div>
            <div><span className={style["number-followers"]}>{facebookCredential}</span></div>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="*"><img className={style["thumbnail"]} src={twitter} /></IonCol>
          <IonCol size="10">
            <span className={style["name"]}>Twitter</span>
            <div><span className={style["number-followers"]}>{twitterCredential}</span></div>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="*"><img className={style["thumbnail"]} src={linkedin} /></IonCol>
          <IonCol size="10">
            <span className={style["name"]}>Linkedin</span>
            <div><span className={style["number-followers"]}>{linkedinCredential}</span></div>
          </IonCol>
        </IonRow>
      </IonGrid>
      <span className={style["explore"]}>Explore all</span>
    </div >
  )
};

export default FollowingList;
