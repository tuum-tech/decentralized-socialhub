import React from "react";
import {
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonContent,
  IonItem,
  IonCardContent,
  IonButton,
  IonText,
} from "@ionic/react";
import style from "./style.module.scss";
import ButtonDisabled from "../../ButtonDisabled";
import ButtonLight from "src/components/ButtonLight";
import ButtonDefault from "src/components/ButtonDefault";
import AlphaButtonDefault from "src/components/AlphaContent/alphabutton";

const SettingsAccount: React.FC = () => {
  return (
    <IonContent className={style["settingsaccount"]}>
      <IonGrid className={style["tab-grid"]}>
        <IonRow>
          <IonCol>
            <IonCard className={style["tab-card"]}>
              <IonCardContent>
                <IonCardHeader>
                  <IonCardTitle className={style["card-title"]}>
                    Account Settings
                  </IonCardTitle>
                </IonCardHeader>
                <IonItem className={style["section"]}>
                  <div className={style["section-data"]}>
                    <IonText className={style["section-title"]}>
                      Change language
                    </IonText>
                    <IonText className={style["section-description"]}>
                      Choose your app language
                    </IonText>
                  </div>
                  <div className={style["section-action"]}>
                    <span className={style["section-action-inner"]}>
                      English {">"}
                    </span>
                  </div>
                </IonItem>
                <IonItem className={style["section"]}>
                  <div className={style["section-data"]}>
                    <IonText className={style["section-title"]}>
                      Download your data
                    </IonText>
                    <IonText className={style["section-description"]}>
                      We are committed to reach the goal of privacy, all your
                      data is owned by you and stored on the vault of your
                      choosing. You can request this data at anytime.
                    </IonText>
                    <br></br>
                    <ButtonDisabled className={style["section-button"]}>
                      Download Here
                    </ButtonDisabled>
                    <IonText className={style["coming-soon"]}>
                      Coming Soon!
                    </IonText>
                  </div>
                </IonItem>
                <IonItem lines="none" className={style["section"]}>
                  <div className={style["section-data"]}>
                    <IonText className={style["section-title"]}>
                      Deactivate your account
                    </IonText>
                    <IonText className={style["section-description"]}>
                      Begin the process of deactivating your Profile account.
                      Both your private and public pages will no longer be
                      accessible by anyone however, since the data is stored on
                      the vault of your choosing, you own your data so you can
                      always access your data by connecting to your vault
                      manually.
                    </IonText>
                    <br></br>
                    <ButtonDisabled className={style["section-button"]}>
                      Deactivate
                    </ButtonDisabled>
                    <IonText className={style["coming-soon"]}>
                      Coming Soon!
                    </IonText>
                  </div>
                </IonItem>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default SettingsAccount;
