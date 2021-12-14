import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow,
  IonModal
} from '@ionic/react';
import { Guid } from 'guid-typescript';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';

import { showNotify } from 'src/utils/notify';
import WalletItem from './components/Item';

import {
  CardOverview,
  Divider,
  LinkStyleSpan,
  ModalFooter,
  MODE,
  CardHeaderContent,
  CardContentContainer
} from '../common';
import WalletCardEdit, { pattern } from './components/Edit';
import ProgressBar from 'src/elements/ProgressBar';
import {
  verifyWalletOwner,
  addWalletToDIDDocument,
  removeWalletFromDIDDocument
} from './function';

interface IWalletProps {
  walletDTO: WalletDTO;
  updateFunc?: any;
  removeFunc?: any;
  isEditable?: boolean;
  isPublicPage?: boolean;
  template?: string;
  userSession: ISessionItem;
  openModal?: boolean;
}

export const defaultWalletItem: WalletItem = {
  guid: Guid.create(),
  name: '',
  address: ''
};

const EditBox = styled(IonModal)`
  --border-radius: 16px;
  --min-height: 200px;
  --height: 320px;
  --width: 400px;
`;

const WalletCard: React.FC<IWalletProps> = ({
  walletDTO,
  updateFunc,
  removeFunc,
  isEditable = false,
  isPublicPage = false,
  template = 'default',
  userSession,
  openModal = false
}: IWalletProps) => {
  const { account, library } = useWeb3React();
  const [currentWalletDTO, setCurrentWalletDTO] = useState(walletDTO);

  useEffect(() => {
    setCurrentWalletDTO(walletDTO);
  }, [walletDTO]);

  const [editedItem, setEditedItem] = useState(defaultWalletItem);
  const [isEditing, setIsEditing] = useState(openModal);
  const [mode, setMode] = useState<MODE>(MODE.NONE);

  useEffect(() => {
    if (mode !== MODE.NONE) {
      setIsEditing(true);
    }
  }, [mode]);

  const handleChange = (evt: any) => {
    let v: any;
    console.log(`${evt.target.name}: ${evt.target.value}`);
    v = evt.target.value;

    let item = {
      ...editedItem,
      [evt.target.name]: v
    };

    setEditedItem(item);
  };

  const validate = (item: WalletItem) => {
    if (!item.name || !item.address) return false;

    if (!pattern.test(item.name)) return false;
    if (!pattern.test(item.address)) return false;
    return true;
  };

  const saveChanges = async (item: WalletItem) => {
    let items = [...currentWalletDTO.items];

    if (mode === MODE.ADD) {
      const existence = items.find(x => x.address === item.address);
      if (existence) {
        // same address already exist
        // should switch over to another account on metamask.
        showNotify(
          'Same wallet address already existed. please try again with another account',
          'error'
        );
        return;
      }
      const web3 = new Web3(library);
      const verifyStatus = await verifyWalletOwner(web3, item.address);
      if (!verifyStatus) {
        showNotify('Wallet owenr verification failed', 'error');
        return;
      }
      // add wallet address to did document
      await addWalletToDIDDocument(item.address, userSession);
    }

    let itemToUpdate = items.find(x => x.guid === item.guid);

    if (itemToUpdate === undefined) {
      items.push(item);
    } else {
      let index = items.indexOf(itemToUpdate);
      items[index] = item;
    }
    setCurrentWalletDTO({ isEnabled: true, items: items });
    updateFunc(item);
    setIsEditing(false);
  };

  const cancel = () => {
    setMode(MODE.NONE);
    setIsEditing(false);
  };

  const addItem = () => {
    setMode(MODE.ADD);
    // workaround: defaultWalletItem will always have the guid generated when the component is created.
    // We must be generated another guid here or else we will edit the last education item created.
    defaultWalletItem.guid = Guid.create();
    setEditedItem(defaultWalletItem);
  };

  const editItem = (item: WalletItem) => {
    setEditedItem(item);
    setMode(MODE.EDIT);
  };

  const removeItem = async (index: number) => {
    let items = [...currentWalletDTO.items];
    let item = items[index];
    await removeWalletFromDIDDocument(item.address, userSession);
    await removeFunc(item);
    items = items.splice(index, 1);
    setCurrentWalletDTO({ isEnabled: true, items: items });
  };

  if (
    !currentWalletDTO.isEnabled ||
    (!isEditable && currentWalletDTO.items.length === 0)
  ) {
    return <></>;
  }

  return (
    <>
      {walletDTO.isEnabled === true ? (
        <>
          <CardOverview template={template}>
            <CardHeaderContent>
              <IonGrid className="ion-no-padding">
                <IonRow className="ion-justify-content-between ion-no-padding">
                  <IonCol className="ion-no-padding">
                    <IonCardTitle>Wallets</IonCardTitle>
                  </IonCol>
                  {isEditable ? (
                    <IonCol size="auto" className="ion-no-padding">
                      <LinkStyleSpan onClick={e => addItem()}>
                        + Add Wallet
                      </LinkStyleSpan>
                    </IonCol>
                  ) : (
                    ''
                  )}
                </IonRow>
              </IonGrid>
            </CardHeaderContent>
            <CardContentContainer>
              {currentWalletDTO.items.sort(
                (a: any, b: any) =>
                  new Date(b.start).getTime() - new Date(a.start).getTime()
              ) &&
                currentWalletDTO.items.map((x, i) => {
                  return (
                    <div key={i}>
                      <WalletItem
                        wallet={x}
                        updateFunc={saveChanges}
                        editFunc={editItem}
                        index={i}
                        removeFunc={removeItem}
                        isEditable={isEditable}
                        template={template}
                        userSession={userSession}
                      />
                      {i < currentWalletDTO.items.length - 1 ? <Divider /> : ''}
                    </div>
                  );
                })}
            </CardContentContainer>
          </CardOverview>
          <EditBox
            onDidDismiss={() => {
              setMode(MODE.NONE);
              setIsEditing(false);
            }}
            isOpen={isEditing}
            cssClass="my-custom-class"
          >
            <WalletCardEdit
              wallet={editedItem}
              handleChange={handleChange}
              mode={mode}
            />
            <ModalFooter className="ion-no-border">
              <IonRow className="ion-justify-content-around">
                <IonCol size="auto">
                  <IonButton fill="outline" onClick={cancel}>
                    Cancel
                  </IonButton>
                  <IonButton
                    onClick={() => {
                      if (validate(editedItem)) {
                        saveChanges(editedItem);
                        setMode(MODE.NONE);
                      } else {
                        setMode(MODE.ERROR);
                      }
                    }}
                  >
                    Save
                  </IonButton>
                </IonCol>
              </IonRow>
            </ModalFooter>
          </EditBox>
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default WalletCard;
