import React, { useState, useEffect } from 'react';
import { IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/react';
import { Guid } from 'guid-typescript';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import Blockies from 'react-blockies';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { showNotify } from 'src/utils/notify';

import {
  CloseButton,
  ManagerButton,
  ManagerModal,
  ManagerModalTitle,
  ManagerModalFooter,
  MyGrid,
  CardOverview,
  LinkStyleSpan,
  CardHeaderContent,
  CardContentContainer,
  ProfileItem
} from '../common';
import {
  verifyWalletOwner,
  addWalletToDIDDocument,
  removeWalletFromDIDDocument
} from './function';
import {
  DIDDocument,
  VerifiableCredential
} from '@elastosfoundation/did-js-sdk/typings';
import { CredentialType } from 'src/services/didcreds.service';
import { shortenAddress } from 'src/utils/web3';
import { injected } from 'src/constant';
import style from './WalletCard.module.scss';
import shieldIcon from '../../../assets/icon/shield.svg';
import copyIcon from '../../../assets/icon/copy-to-clipboard.svg';
interface IWalletProps {
  didDocument: DIDDocument;
  isEditable?: boolean;
  template?: string;
  userSession: ISessionItem;
}

const WalletCard: React.FC<IWalletProps> = ({
  didDocument,
  isEditable = false,
  template = 'default',
  userSession
}: IWalletProps) => {
  const { account, library, activate, deactivate } = useWeb3React();

  ////////////////////////////// ***** ////////////////////////////////////
  const [connection, setConnection] = useState(false);
  const [selectedWalletType, setSelectedWalletType] = useState<CredentialType>(
    CredentialType.ETHAddress
  );
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [isRemovingVc, setIsRemovingVc] = useState(false);
  const [didDoc, setDidDoc] = useState<DIDDocument>(didDocument);

  ////////////////////////////// ***** ////////////////////////////////////
  useEffect(() => {
    if (account && connection) {
      (async () => {
        const web3 = new Web3(library);
        const verifyStatus = await verifyWalletOwner(web3, account);
        if (!verifyStatus) {
          showNotify('Wallet owner verification failed', 'error');
          return;
        }
        const doc = await addWalletToDIDDocument(
          account,
          selectedWalletType.toLowerCase(),
          userSession
        );
        console.log(doc);
        setDidDoc(doc);
        setConnection(false);
      })();
    }
  }, [account, selectedWalletType, connection, library, userSession]);

  const connectWallet = async () => {
    try {
      await activate(injected);
      setConnection(true);
    } catch (ex) {
      console.log(ex);
    }
  };

  const addVc = async (type: CredentialType) => {
    setSelectedWalletType(type);
    connectWallet();
  };

  const removeVc = async (type: CredentialType) => {
    setIsRemovingVc(true);
    const doc = await removeWalletFromDIDDocument(
      type.toLowerCase(),
      userSession
    );
    setDidDoc(doc);
    setIsRemovingVc(false);
  };

  const parseValueFromKey = (
    key: string,
    credential: VerifiableCredential
  ): string => {
    let value = credential.subject.getProperty(key);
    return value;
  };

  const walletEditItem = (type: CredentialType) => {
    let vc = didDoc?.getCredential(type.toLowerCase());
    if (!vc) {
      return (
        <div className={style['manage-links-item']}>
          <Blockies seed={type} size={50} scale={1} />
          <div className={style['manage-links-header']}>{type}</div>
          <ManagerButton onClick={() => addVc(type)}>Add</ManagerButton>
        </div>
      );
    }
    const address = parseValueFromKey(type.toLowerCase(), vc);
    return (
      <div className={style['manage-links-item']}>
        <Blockies seed={type} size={50} scale={1} />
        <div className={style['manage-links-header']}>
          {type}
          <p className={style['manage-links-detail']}>
            {shortenAddress(address)}
            <CopyToClipboard text={address}>
              <img
                className={style['copy-to-clipboard']}
                src={copyIcon}
                width={15}
              />
            </CopyToClipboard>
          </p>
        </div>
        <ManagerButton disabled={isRemovingVc} onClick={() => removeVc(type)}>
          Remove
        </ManagerButton>
      </div>
    );
  };

  const containsVerifiedCredential = (key: string): boolean => {
    const vc = didDoc?.getCredential(key);
    return !!vc;
  };

  const walletViewItem = (type: CredentialType) => {
    let vc = didDoc?.getCredential(type.toLowerCase());
    if (!vc) return <></>;
    const address = parseValueFromKey(type.toLowerCase(), vc);
    return (
      <ProfileItem template={template}>
        <div className="left">
          <Blockies seed={type} size={50} scale={1} />
          {vc.isValid() && (
            <img
              alt="shield icon"
              src={shieldIcon}
              className="social-profile-badge"
              height={15}
            />
          )}
        </div>
        <div className="right">
          <p className="social-profile-network">{type}</p>
          <span className="social-profile-id">{shortenAddress(address)}</span>
          <CopyToClipboard text={address}>
            <img className="copy-to-clipboard" src={copyIcon} width={15} />
          </CopyToClipboard>
        </div>
      </ProfileItem>
    );
  };

  return (
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
                  <LinkStyleSpan onClick={e => setIsManagerOpen(true)}>
                    Manage Wallets
                  </LinkStyleSpan>
                </IonCol>
              ) : (
                ''
              )}
            </IonRow>
          </IonGrid>
        </CardHeaderContent>
        <CardContentContainer>
          <IonGrid className="social-profile-grid">
            <IonRow>
              {containsVerifiedCredential(
                CredentialType.ETHAddress.toLowerCase()
              ) && (
                <IonCol size={isEditable ? '6' : '12'}>
                  {walletViewItem(CredentialType.ETHAddress)}
                </IonCol>
              )}
              {containsVerifiedCredential(
                CredentialType.EIDAddress.toLowerCase()
              ) && (
                <IonCol size={isEditable ? '6' : '12'}>
                  {walletViewItem(CredentialType.EIDAddress)}
                </IonCol>
              )}
              {containsVerifiedCredential(
                CredentialType.ESCAddress.toLowerCase()
              ) && (
                <IonCol size={isEditable ? '6' : '12'}>
                  {walletViewItem(CredentialType.ESCAddress)}
                </IonCol>
              )}
            </IonRow>
          </IonGrid>
        </CardContentContainer>
      </CardOverview>
      <ManagerModal
        isOpen={isManagerOpen}
        cssClass="my-custom-class"
        backdropDismiss={false}
      >
        <MyGrid class="ion-no-padding">
          <IonRow>
            <ManagerModalTitle>Manage Wallets</ManagerModalTitle>
          </IonRow>
          <IonRow no-padding>
            <IonCol class="ion-no-padding">
              {walletEditItem(CredentialType.EIDAddress)}
            </IonCol>
          </IonRow>
          <IonRow no-padding>
            <IonCol class="ion-no-padding">
              {walletEditItem(CredentialType.ESCAddress)}
            </IonCol>
          </IonRow>
          <IonRow no-padding>
            <IonCol class="ion-no-padding">
              {walletEditItem(CredentialType.ETHAddress)}
            </IonCol>
          </IonRow>
        </MyGrid>
        <ManagerModalFooter className="ion-no-border">
          <IonRow className="ion-justify-content-around">
            <IonCol size="auto">
              <CloseButton
                disabled={isRemovingVc}
                onClick={() => {
                  setIsManagerOpen(false);
                }}
              >
                Close
              </CloseButton>
            </IonCol>
          </IonRow>
        </ManagerModalFooter>
      </ManagerModal>
    </>
  );
};

export default WalletCard;
