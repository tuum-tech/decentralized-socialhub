/**
 * Page
 */
import { IonContent, IonPage, IonGrid, IonRow, IonCol } from "@ionic/react";

import React, { useState } from "react";
import style from "./style.module.scss";
import Logo from "src/components/Logo";
import Navbar from "src/components/Navbar";

const SettingsPage: React.FC = () => {
  const [msg, setMsg] = useState("");

  return (
    <IonPage className={style["settingspage"]}>
      <IonContent>
        <IonGrid className={style["profilepagegrid"]}>
          <IonRow className={style["profilecontent"]}>
            <IonCol size="2" className={style["left-panel"]}>
              <Logo />
              <Navbar tab="explore" />
            </IonCol>
            <IonCol size="10" className={style["right-panel"]}>
              test
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
