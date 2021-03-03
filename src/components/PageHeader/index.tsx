import React from "react";
import { IonContent, IonGrid, IonRow } from "@ionic/react";
import style from "./style.module.scss";
import ProfileName from "../ProfileName";

const PageHeader: React.FC = () => {
  return (
    <IonContent className={style["pageheader"]}>
      <IonGrid>
        <IonRow>
          <ProfileName className={style["headertext"]}>Settings</ProfileName>
        </IonRow>
        <IonRow className={style["subheadertext"]}>Account</IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default PageHeader;
