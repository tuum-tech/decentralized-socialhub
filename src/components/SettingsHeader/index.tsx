import React from "react";
import { IonGrid, IonRow, IonCol } from "@ionic/react";
import style from "./style.module.scss";
import ProfileName from "../ProfileName";

const SettingsHeader: React.FC = () => {
  return (
    <IonGrid className={style["settingsheader"]}>
      <IonRow className={style["header"]}>
        <IonCol size="8">
          <IonGrid>
            <IonRow>
              <ProfileName>Settings</ProfileName>
            </IonRow>
            <IonRow>Account</IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default SettingsHeader;
