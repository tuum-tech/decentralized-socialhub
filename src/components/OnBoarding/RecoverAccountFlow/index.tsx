import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

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
import { getDIDString } from 'src/utils/did';

import DownloadEssentials from '../NewUserFlow/DownloadEssentials';
import OwnYourSelf from '../NewUserFlow/OwnYourSelf';
import LoadingModal from '../NewUserFlow/LoadingModal';
import Web3Identity from '../NewUserFlow/Web3Identity';
import Web3Storage from '../NewUserFlow/Web3Storage';
import ActivateProfile from '../NewUserFlow/ActivateProfile';
import AllIsSet from '../NewUserFlow/AllIsSet';

interface Props {
  changeStep: (step: number) => void;
  session: ISessionItem;
  close: (step: number) => void;
  onBoardingInfo: IOnboardingInfo;
  setCurrentTab: (active: string) => void;
}

const RecoverAccountFlow: React.FC<Props> = ({
  session,
  close,
  onBoardingInfo,
  changeStep,
  setCurrentTab
}: Props) => {
  const step = onBoardingInfo.step;
  const history = useHistory();
  const setDidDocument = useSetRecoilState(DIDDocumentAtom);

  const nextStep = async () => {
    await changeStep(step + 1);
  };

  const prevStep = async () => {
    if (step >= 1) {
      await changeStep(step - 1);
    }
  };

  const seeMyBades = async () => {
    await changeStep(step + 1);
    setCurrentTab('badges');
  };

  const shareLink = async () => {
    await changeStep(step + 1);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${process.env.REACT_APP_PROFILE_LANDING_PAGE}` +
          getDIDString('/did/' + session.did)
      );
      showNotify(`Copied Profile URL`, 'success');
    }
  };

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

        nextStep();
      } else {
        showNotify('Did is not published on the blockchain yet', 'error');
      }
    } else {
      showNotify('Unable to get credential from essential', 'error');
    }
  };

  if (step === 0) {
    return <OwnYourSelf next={nextStep} close={() => close(step)} />;
  }

  if (step === 1) {
    return (
      <DownloadEssentials
        next={connect}
        close={() => close(step)}
        back={prevStep}
      />
    );
  }

  // if (step === 2) {
  //   return (
  //     <Web3Identity
  //       session={session}
  //       next={nextStep}
  //       close={() => close(step)}
  //       back={prevStep}
  //     />
  //   );
  // }

  if (step === 2) {
    return (
      <Web3Storage
        session={session}
        complete={nextStep}
        close={() => close(step)}
      />
    );
  }

  if (step === 3) {
    return (
      <AllIsSet seeMyBades={seeMyBades} close={nextStep} share={shareLink} />
    );
  }

  return <LoadingModal />;
};

export default RecoverAccountFlow;
