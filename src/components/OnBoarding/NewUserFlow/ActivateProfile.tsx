import React, { useEffect } from 'react';
import styled from 'styled-components';
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
import { UserService } from 'src/services/user.service';

import { ThemeButton, ThemeTransparentButton } from 'src/elements/buttons';
import { OnBoardingTitle, OnBoardingContainer } from './LoadingModal';
import { TransparentButton } from './OwnYourSelf';
import TutorialSteps from './TutorialSteps';
import { TransparentWithBorderlineButton } from './DownloadEssentials';

const Container = styled.div`
  margin-top: 32px;
  display: block;

  .intro {
    font-weight: 400;
    font-size: 16px;
    line-height: 162.02%;
    text-align: center;
    color: #27272e;
    margin-bottom: 32px;
  }

  button {
    display: block;
    margin: 0 auto;
  }
`;

interface Props {
  session: ISessionItem;
  next: () => void;
  back: () => void;
  close: () => void;
}

const ActivateProfile: React.FC<Props> = ({
  session,
  next,
  back,
  close
}: Props) => {
  const setDidDocument = useSetRecoilState(DIDDocumentAtom);

  useEffect(() => {
    (async () => {
      let connector: EssentialsConnector = connectivity.getActiveConnector() as EssentialsConnector;
      if (connector && connector.hasWalletConnectSession()) {
        connector.disconnectWalletConnect();
      }
    })();
  }, []);

  console.log('====>props', session);

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
      let name = nameCredential!.getSubject().getProperty('name');
      let owner = nameCredential!.getId().getDid();
      let did = 'did:elastos:' + owner.getMethodSpecificId();
      let mnemonic = '';

      if (did !== session.did) {
        alertError(null, 'You should login with previously created DID user');
        return;
      }

      let resolvedDocument = await owner.resolve();
      await didService.storeDocument(resolvedDocument);
      setDidDocument(resolvedDocument.toString(true));

      let isDidPublished = await didService.isDIDPublished(did);
      let serviceEndpoint = '';

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

        let userService = new UserService(didService);
        const res = await userService.SearchUserWithDID(did);
        if (res) {
          showNotify(
            "Please approve Profile's multiple requests on Esssentials App.",
            'warning'
          );
          const session = await userService.LockWithDIDAndPwd(
            res,
            serviceEndpoint
          );
          session.isEssentialUser = true;
        }
      } else {
        showNotify('Did is not published on the blockchain yet', 'error');
      }
    } else {
      showNotify('Unable to get credential from essential', 'error');
    }
  };

  return (
    <OnBoardingContainer style={{ maxWidth: '545px' }}>
      <TutorialSteps step={3} />
      <OnBoardingTitle>Activate Your Profile</OnBoardingTitle>

      <Container>
        <ThemeButton
          text="Activate Your Profile"
          img="white"
          onClick={connect}
        />

        <TransparentWithBorderlineButton
          style={{ width: '170px', marginTop: '20px' }}
          onClick={back}
        >
          <p>Back</p>
        </TransparentWithBorderlineButton>
        <TransparentButton onClick={close}>
          <p>Skip for now</p>
        </TransparentButton>
      </Container>
    </OnBoardingContainer>
  );
};

export default ActivateProfile;
