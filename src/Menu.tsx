import React from 'react';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonRouterOutlet,
  IonButtons,
  IonMenuButton,
  IonButton
} from '@ionic/react';
import { menuController } from '@ionic/core';

export const Menu: React.FC = () => {
  const openMenu = async function() {
    await menuController.open();
  };

  return (
    <>
      <IonMenu
        side="start"
        menuId="custom"
        contentId="custom"
        className="my-custom-menu"
      >
        <IonHeader>
          <IonToolbar color="tertiary">
            <IonTitle>Custom Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent id="custom">
          <IonList>
            <IonItem>
              <IonButton expand="full" routerLink="/profile">
                Profile
              </IonButton>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton
              autoHide={false}
              onClick={() => openMenu()}
            ></IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonRouterOutlet></IonRouterOutlet>
    </>
  );
};
