import React, { useEffect } from 'react';
import styled from 'styled-components';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import {
  DID,
  connectivity
} from '@elastosfoundation/elastos-connectivity-sdk-js';
import { EssentialsConnector } from '@elastosfoundation/essentials-connector-client-browser';

import { DidService } from 'src/services/did.service.new';
import { HiveService } from 'src/services/hive.service';
import { DIDURL, VerifiablePresentation } from '@elastosfoundation/did-js-sdk/';
import { useSetRecoilState } from 'recoil';
import { DIDDocumentAtom } from 'src/Atoms/Atoms';
import { alertError, showNotify } from 'src/utils/notify';

import { ThemeButton } from 'src/elements/buttons';
import { OnBoardingTitle, OnBoardingContainer } from './LoadingModal';
import { TransparentButton } from './OwnYourSelf';
import TutorialSteps from './TutorialSteps';
import {
  TransparentWithBorderlineButton,
  RowContainer
} from './DownloadEssentials';

const Word = styled.div`
  width: 100%;
  margin-left: 5px;

  height: 42px;

  background: #edf2f7;

  box-shadow: 0px 1px 2px rgba(50, 50, 71, 0.08),
    0px 0px 1px rgba(50, 50, 71, 0.2);
  border-radius: 6px;

  font-size: 14px;
  line-height: 42px;
`;

const DisplayInfo = styled.div`
  background: rgba(229, 187, 255, 0.16);
  border-radius: 9px;

  padding: 10px;
  width: 100%;

  p {
    font-weight: 600;
    font-size: 13px;
    line-height: 160%;

    text-align: center;

    background: linear-gradient(90deg, #995aff 0%, #dc59bf 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
`;

interface Props {
  session: ISessionItem;
  next: () => void;
  back: () => void;
  close: () => void;
}
const Web3Identity: React.FC<Props> = ({ session, back, next, close }) => {
  const mnemonics = session.mnemonics.split(' ');
  const setDidDocument = useSetRecoilState(DIDDocumentAtom);

  useEffect(() => {
    (async () => {
      let connector: EssentialsConnector = connectivity.getActiveConnector() as EssentialsConnector;
      if (connector && connector.hasWalletConnectSession()) {
        connector.disconnectWalletConnect();
      }
    })();
  }, []);

  const getPresentation = async (): Promise<
    VerifiablePresentation | undefined
  > => {
    let connector: EssentialsConnector = connectivity.getActiveConnector() as EssentialsConnector;
    if (connector && connector.hasWalletConnectSession()) {
      connector.disconnectWalletConnect();
    }

    console.log('Entering on connect');
    let didAccess = new DID.DIDAccess();

    try {
      return await didAccess.requestCredentials({
        claims: [DID.simpleIdClaim('Your name', 'name', true)],
        didMustBePublished: true
      });
    } catch (error) {
      console.error(error);
    } finally {
      console.log('end of popup?');
    }

    return;
  };

  const connect = async () => {
    let presentation = await getPresentation();

    const didService = await DidService.getInstance();
    if (presentation !== null && presentation !== undefined) {
      let nameCredential = presentation!.getCredentials().find((c: any) => {
        return c.getId().getFragment() === 'name';
      });

      let owner = nameCredential!.getId().getDid();
      let did = 'did:elastos:' + owner.getMethodSpecificId();

      if (did != session.did) {
        alertError(null, 'Invalid Session');
        return;
      }

      let resolvedDocument = await owner.resolve();
      await didService.storeDocument(resolvedDocument);
      setDidDocument(resolvedDocument.toString(true));

      let serviceEndpoint = '';
      let isDidPublished = await didService.isDIDPublished(did);
      if (isDidPublished) {
        let didDocument = await didService.getDidDocument(did, false);
        if (didDocument.services && didDocument.services.size > 0) {
          let hiveUrl = new DIDURL(did + '#hivevault');
          if (didDocument.services?.has(hiveUrl)) {
            serviceEndpoint = didDocument.services.get(hiveUrl).serviceEndpoint;
          } else {
            hiveUrl = new DIDURL(did + '#HiveVault');
            if (didDocument.services?.has(hiveUrl)) {
              serviceEndpoint = didDocument.services.get(hiveUrl)
                .serviceEndpoint;
            }
          }
          if (serviceEndpoint) {
            let hiveVersion = await HiveService.getHiveVersion(serviceEndpoint);
            let isHiveValid = await HiveService.isHiveVersionSupported(
              hiveVersion
            );
            if (!isHiveValid) {
              alertError(
                null,
                `Hive version ${hiveVersion} not supported. The minimal supported version is ${process.env.REACT_APP_HIVE_MIN_VERSION} and maximun is ${process.env.REACT_APP_HIVE_MAX_VERSION}`
              );
              return;
            }
          } else {
            alertError(
              null,
              `This DID has no Hive Node set. Please set the hive node first using Elastos Essentials App`
            );
          }
        } else {
          alertError(
            null,
            `This DID has no Hive Node set. Please set the hive node first using Elastos Essentials App`
          );
          return;
        }

        next();
      } else {
        showNotify('Did is not published on the blockchain yet', 'error');
      }
    } else {
      showNotify('Unable to get credential from essential', 'error');
    }
  };

  const renderMnemonicInput = (index: number) => {
    return (
      <IonCol
        className="ion-no-padding"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}
      >
        <span style={{ width: '25px' }}>{(index + 1).toString()}</span>
        <Word>{mnemonics[index]}</Word>
      </IonCol>
    );
  };

  return (
    <OnBoardingContainer style={{ maxWidth: '545px' }}>
      <TutorialSteps step={2} />
      <OnBoardingTitle>Your Web3 Identity</OnBoardingTitle>

      <p
        style={{
          fontSize: '14px',
          marginBottom: '10px',
          lineHeight: '22px',
          color: '#27272E'
        }}
      >
        Your 12 secret words ("mnemonics" in web3 lingo) control your new
        Decentralized ID (DID). Open your Essentials app, select New Identity,
        and import your words to backup your account and activate your Profile.
      </p>

      <IonGrid>
        <IonRow>
          <IonCol>{renderMnemonicInput(0)}</IonCol>
          <IonCol>{renderMnemonicInput(1)}</IonCol>
          <IonCol>{renderMnemonicInput(2)}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{renderMnemonicInput(3)}</IonCol>
          <IonCol>{renderMnemonicInput(4)}</IonCol>
          <IonCol>{renderMnemonicInput(5)}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{renderMnemonicInput(6)}</IonCol>
          <IonCol>{renderMnemonicInput(7)}</IonCol>
          <IonCol>{renderMnemonicInput(8)}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{renderMnemonicInput(9)}</IonCol>
          <IonCol>{renderMnemonicInput(10)}</IonCol>
          <IonCol>{renderMnemonicInput(11)}</IonCol>
        </IonRow>
      </IonGrid>

      <DisplayInfo style={{ marginTop: '10px' }}>
        <p>
          Do not share your secret words with anyone & keep a backup in a secure
          location!
        </p>
      </DisplayInfo>

      <RowContainer style={{ maxWidth: '380px' }}>
        <TransparentWithBorderlineButton
          style={{ width: '170px' }}
          onClick={back}
        >
          <p>Back</p>
        </TransparentWithBorderlineButton>
        <ThemeButton
          style={{ width: '170px', fontSize: '14px' }}
          onClick={connect}
          text="Activate Profile"
        />
      </RowContainer>
      <TransparentButton onClick={close}>
        <p>Skip for now</p>
      </TransparentButton>
    </OnBoardingContainer>
  );
};

export default Web3Identity;
