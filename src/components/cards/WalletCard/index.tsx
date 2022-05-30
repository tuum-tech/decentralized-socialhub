import React, { useState, useEffect, useMemo } from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import Blockies from 'react-blockies';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { showNotify } from 'src/utils/notify';

import { ManagerButton, LinkStyleSpan, ProfileItem } from '../common';
import { verifyWalletOwner } from './function';
import { VerifiableCredential } from '@elastosfoundation/did-js-sdk/';
import { CredentialType, DidcredsService } from 'src/services/didcreds.service';
import { ProfileService } from 'src/services/profile.service';
import { shortenAddress } from 'src/utils/web3';
import { injected } from 'src/constant';
import style from './WalletCard.module.scss';

import defaultIcon from '../../../assets/icon/profile-bag-blue.svg';
import shieldIcon from '../../../assets/icon/shield.svg';
import copyIcon from '../../../assets/icon/copy-to-clipboard.svg';
import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';
import { VerificationService } from 'src/services/verification.service';
import Card from 'src/elements-v2/Card';
import Modal from 'src/elements-v2/Modal';
import useSession from 'src/hooks/useSession';

interface IWalletProps {
  setRequestEssentials: (item: boolean) => void;
  isEditable?: boolean;
  template?: string;
  userSession: ISessionItem;
}

const WalletCard: React.FC<IWalletProps> = ({
  setRequestEssentials,
  isEditable = false,
  template = 'default',
  userSession
}: IWalletProps) => {
  const { account, library, activate } = useWeb3React();
  const { session, setSession } = useSession();
  const wallets = useMemo(() => session.wallets, [session]);
  ////////////////////////////// ***** ////////////////////////////////////
  const [adding, setAdding] = useState(false);
  const [selectedWalletType, setSelectedWalletType] = useState<CredentialType>(
    CredentialType.ETHAddress
  );
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [isRemovingVc, setIsRemovingVc] = useState(false);
  const walletCredentials = [
    {
      name: 'escaddress',
      display: 'ESC Address',
      credential: undefined,
      icon: defaultIcon
    },
    {
      name: 'ethaddress',
      display: 'ETH Address',
      credential: undefined,
      icon: defaultIcon
    }
  ];
  const [credentials, setCredentials] = useState<
    {
      name: string;
      display: string;
      credential: VerifiableCredential | undefined;
      icon: string;
    }[]
  >(walletCredentials);

  useEffect(() => {
    let timer = setTimeout(function start() {
      getCredentials(userSession);
      timer = setTimeout(start, 2000);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getCredentials = async (sessionItem: ISessionItem) => {
    let credsFromDidDocument: any[] = [];
    try {
      let allCreds = await DidcredsService.getAllCredentialsToVault(
        sessionItem
      );
      credsFromDidDocument = Array.from(allCreds.values());
      let newCredentials = credentials.map(item => {
        item.credential = credsFromDidDocument.find(
          cred => cred.id.getFragment() === item.name
        );
        return item;
      });
      setCredentials(newCredentials);
    } catch (error) {
      console.error('Error getting credentials from vault', error);
    }
  };

  ////////////////////////////// ***** ////////////////////////////////////
  useEffect(() => {
    if (account && adding) {
      (async () => {
        const web3 = new Web3(library);
        const verifyStatus = await verifyWalletOwner(web3, account);
        if (!verifyStatus) {
          showNotify('Wallet owner verification failed', 'error');
          return;
        }
        if (userSession.isEssentialUser) setRequestEssentials(true);
        let newVC = await DidcredsService.generateVerifiableCredential(
          userSession.did,
          selectedWalletType.toLowerCase(),
          account
        );
        if (userSession.isEssentialUser) {
          let vService = new VerificationService();
          await vService.importCredential(newVC);
        }
        try {
          const publicFields = await ProfileService.getPublicFields(
            userSession.did
          );
          if (publicFields.includes('wallet')) {
            const key = newVC
              .getId()
              .toString()
              .split(`${userSession.did}#`)[1];
            const value = newVC.subject.getProperty(key);
            let userService = new UserService(await DidService.getInstance());
            setSession(
              await userService.updateSession({
                ...userSession,
                wallets: { ...wallets, [key]: value }
              })
            );
          }
          await DidcredsService.addOrUpdateCredentialToVault(
            userSession,
            newVC
          );
        } catch (error) {
          console.error('Error getting credentials from vault', error);
        }
        if (userSession.isEssentialUser) setRequestEssentials(false);
        setAdding(false);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, adding]);

  const connectWallet = async () => {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  };

  const updateSession = async (key: string) => {
    try {
      await ProfileService.addActivity(
        {
          guid: '',
          did: userSession.did,
          message: `You updated ${key} wallet`,
          read: false,
          createdAt: 0,
          updatedAt: 0
        },
        userSession
      );
    } catch (err) {
      console.log('error======>', err);
    }
  };

  const addVc = async (type: CredentialType) => {
    setSelectedWalletType(type);
    setAdding(true);
    if (!account) {
      connectWallet();
    }

    updateSession(type);
  };

  const removeVc = async (key: string) => {
    setIsRemovingVc(true);

    let vcId = userSession.did + '#' + key.toLowerCase();
    if (userSession.isEssentialUser) {
      let vService = new VerificationService();
      await vService.deleteCredentials(vcId);
    }
    try {
      const publicFields = await ProfileService.getPublicFields(
        userSession.did
      );
      if (publicFields.includes('wallet')) {
        const key = vcId.split(`${userSession.did}#`)[1];
        const _wallets = { ...wallets };
        if (_wallets && _wallets[key]) delete _wallets[key];
        let userService = new UserService(await DidService.getInstance());
        setSession(
          await userService.updateSession({
            ...userSession,
            wallets: _wallets
          })
        );
      }
      await DidcredsService.removeCredentialToVault(userSession, vcId);
    } catch (error) {
      console.error('Error getting credentials from vault', error);
    }

    setIsRemovingVc(false);
    updateSession(key);
  };

  const parseValueFromKey = (
    key: string,
    credential: VerifiableCredential
  ): string => {
    let value = credential.subject.getProperty(key);
    return value;
  };

  const walletEditItem = (type: CredentialType) => {
    let vc;
    credentials
      .filter(item => item.credential !== undefined)
      ?.map(credentialItem => {
        if (credentialItem.credential?.id.getFragment() === type.toLowerCase())
          vc = credentialItem.credential;
      });
    //vc = didDoc?.getCredential(type.toLowerCase());
    if (!vc) {
      return (
        <div className={style['manage-links-item']}>
          <Blockies seed={type} size={50} scale={1} />
          <div className={style['manage-links-header']}>{type}</div>
          <ManagerButton
            variant="outlined"
            btnColor="primary-gradient"
            textType="gradient"
            size="small"
            onClick={() => addVc(type)}
          >
            Add
          </ManagerButton>
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
                alt=""
                className={style['copy-to-clipboard']}
                src={copyIcon}
                width={15}
              />
            </CopyToClipboard>
          </p>
        </div>
        <ManagerButton
          variant="outlined"
          btnColor="primary-gradient"
          textType="gradient"
          size="small"
          disabled={isRemovingVc}
          onClick={() => removeVc(type)}
        >
          Remove
        </ManagerButton>
      </div>
    );
  };

  const containsVerifiedCredential = (key: string): boolean => {
    let vc;
    credentials
      .filter(item => item.credential !== undefined)
      ?.map(credentialItem => {
        if (credentialItem.credential?.id.getFragment() === key.toLowerCase())
          vc = credentialItem.credential;
      });
    //const vc = didDoc?.getCredential(key);
    return !!vc;
  };

  const walletViewItem = (type: CredentialType) => {
    let vc;
    credentials
      .filter(item => item.credential !== undefined)
      ?.map(credentialItem => {
        if (credentialItem.credential?.id.getFragment() === type.toLowerCase())
          vc = credentialItem.credential;
      });
    //let vc = didDoc?.getCredential(type.toLowerCase());
    if (!vc) return <></>;
    const address = parseValueFromKey(type.toLowerCase(), vc);
    return (
      <ProfileItem template={template}>
        <div className="left">
          <Blockies seed={type} size={50} scale={1} />
          {
            <img
              alt="shield icon"
              src={shieldIcon}
              className="social-profile-badge"
              height={15}
            />
          }
        </div>
        <div className="right">
          <p className="social-profile-network">{type}</p>
          <span className="social-profile-id">{shortenAddress(address)}</span>
          <CopyToClipboard text={address}>
            <img
              className="copy-to-clipboard"
              src={copyIcon}
              width={15}
              alt="copy to clipboard"
            />
          </CopyToClipboard>
        </div>
      </ProfileItem>
    );
  };

  return (
    <>
      <Card
        template={template}
        title="Wallets"
        action={
          isEditable ? (
            <IonCol size="auto" className="ion-no-padding">
              <LinkStyleSpan onClick={e => setIsManagerOpen(true)}>
                Manage Wallets
              </LinkStyleSpan>
            </IonCol>
          ) : (
            ''
          )
        }
      >
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
      </Card>
      <Modal
        title="Manage Wallets"
        isOpen={isManagerOpen}
        onClose={() => {
          setIsManagerOpen(false);
        }}
        noButton
      >
        <IonGrid class="ion-no-padding">
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
        </IonGrid>
      </Modal>
    </>
  );
};

export default WalletCard;
