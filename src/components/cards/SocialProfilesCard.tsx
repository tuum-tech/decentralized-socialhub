import React, { useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonItem,
  IonList,
  IonModal,
  IonRow
} from '@ionic/react';
import style from './SocialProfilesCard.module.scss';
import linkedinIcon from '../../assets/icon/Linkedin.svg';
import twitterIcon from '../../assets/icon/Twitter.svg';
import facebookIcon from '../../assets/icon/Facebook.svg';
import googleIcon from '../../assets/icon/Google.svg';
import shieldIcon from '../../assets/icon/shield.svg';
import styled from 'styled-components';
import { ModalFooter } from 'react-bootstrap';



interface Props {
  diddocument: any;
}

interface VerifiedCredential {
  value: string
  isVerified: boolean
}

const MyModal = styled(IonModal)`
  --border-radius: 16px;
  --min-height: 200px;
  --height: 280px;
  --width: 560px;
`;

const SocialProfilesCard: React.FC<Props> = ({ diddocument }) => {

  const [isManagerOpen, setIsManagerOpen] = useState(false)


  const getVerifiedCredential = (id: string): VerifiedCredential | undefined => {
    if (!diddocument || !diddocument["id"]) return

    let vcs = diddocument["verifiableCredential"].map((vc: any) => {
      if (vc["id"] == `#${id.toLowerCase()}`) {
        return {
          value: vc["credentialSubject"]["id"],
          isVerified: !vc["type"].contains("SelfProclaimedCredential")
        }
      }
    })


    if (vcs && vcs.length > 0) return vcs[0]

    return
  }




  const createIonItem = (key: string, icon: any) => {
    let vc = getVerifiedCredential(key)
    if (!vc) return
    return <IonItem className={style['social-profile-item']}>
      <img src={icon} />
      {vc.value}
      {vc.isVerified && <img src={shieldIcon} />}
    </IonItem>
  }

  const linkedInItem = () => {
    return createIonItem("linkedIn", linkedinIcon)
  }

  const facebookItem = () => {
    return createIonItem("facebook", facebookIcon)
  }

  const googleItem = () => {
    return createIonItem("google", googleIcon)
  }

  const twitterItem = () => {
    return createIonItem("twitter", twitterIcon)
  }

  // const anyCredential = (): boolean => {
  //   if (!diddocument || !diddocument["id"]) return false
  //   let vcs: string[] = diddocument["verifiableCredential"].map((vc: any) => {
  //     return `${vc["id"]}`.replace("#", "")
  //   })
  //   if (!vcs || vcs.length === 0) return false; 

  //   return vcs.includes("twitter") ||
  //          vcs.includes("linkedin") ||
  //          vcs.includes("google") ||
  //          vcs.includes("linkedin")
  // }

  // const renderControl = () =>{
  //   let anycredential = anyCredential();
  //   if (anycredential) return <IonCard className={style['social-profile']}>
  //           <IonCardHeader>
  //             <IonCardTitle className={style['card-title']}>
  //               Social Profiles <span className={style['card-link']}>Manage Links</span>
  //             </IonCardTitle>
  //           </IonCardHeader>
  //           <IonCardContent>
  //             <IonList>
  //               {linkedInItem()}
  //               {twitterItem()}
  //               {googleItem()}
  //               {facebookItem()}

  //             </IonList>
  //           </IonCardContent>
  //         </IonCard>

  //   return <div></div>
  // }


  return (
    <div>
      <IonCard className={style['social-profile']}>
        <IonCardHeader>
          <IonCardTitle className={style['card-title']}>
            Social Profiles <span className={style['card-link']}>Manage Links</span>
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            {linkedInItem()}
            {twitterItem()}
            {googleItem()}
            {facebookItem()}

          </IonList>
        </IonCardContent>
      </IonCard>


      <MyModal
        isOpen={isManagerOpen}
        cssClass="my-custom-class"
      >
        
        <ModalFooter className="ion-no-border">
          <IonRow className="ion-justify-content-around">
            <IonCol size="auto">
              <IonButton fill="outline" onClick={() =>{setIsManagerOpen(false)}}>
                Close
              </IonButton>
            </IonCol>
          </IonRow>
        </ModalFooter>
      </MyModal>
    </div>




  );
};

export default SocialProfilesCard;
