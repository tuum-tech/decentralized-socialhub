import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { StaticContext, RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import {
  DID,
  connectivity
} from '@elastosfoundation/elastos-connectivity-sdk-js';
import { EssentialsConnector } from '@elastosfoundation/essentials-connector-client-browser';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
  NavContainer
} from 'src/components/layouts/OnBoardLayout';
import FooterLinks, {
  Footer
} from 'src/components/layouts/OnBoardLayout/FooterLinks';
import { Text16 } from 'src/elements/texts';
import { ThemeButton, ThemeTransparentButton } from 'src/elements/buttons';
import Navbar from 'src/components/layouts/NavBar';
import { alertError, showNotify } from 'src/utils/notify';
import { DidService } from 'src/services/did.service.new';
import { UserService } from 'src/services/user.service';

import leftBg from 'src/assets/new/auth/signin_left_bg.png';
import style from './style.module.scss';
import { LocationState, InferMappedProps } from './types';
import { SubState } from 'src/store/users/types';
import { HiveService } from 'src/services/hive.service';
import { DIDURL, VerifiablePresentation } from '@elastosfoundation/did-js-sdk/';
import { useSetRecoilState } from 'recoil';
import { DIDDocumentAtom } from 'src/Atoms/Atoms';

interface PageProps
  extends InferMappedProps,
    RouteComponentProps<{}, StaticContext, LocationState> {}

const SignInPage: React.FC<PageProps> = ({ eProps, ...props }) => {
  const history = useHistory();
  const setDidDocument = useSetRecoilState(DIDDocumentAtom);
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

        let userService = new UserService(didService);
        const res = await userService.SearchUserWithDID(did);
        window.localStorage.setItem(
          `temporary_${did.replace('did:elastos:', '')}`,
          JSON.stringify({
            mnemonic: mnemonic
          })
        );
        console.log('signinpage: ', res, name);
        if (res) {
          history.push('/profile');
          const session = await userService.LockWithDIDAndPwd(
            res,
            serviceEndpoint
          );
          session.isEssentialUser = true;
          eProps.setSession({ session });
        } else {
          history.push({
            pathname: '/create-profile-with-did',
            state: {
              did,
              mnemonic,
              user: {
                name: name,
                loginCred: {}
              }
            }
          });
        }
      } else {
        showNotify('Did is not published on the blockchain yet', 'error');
      }
    } else {
      showNotify('Unable to get credential from essential', 'error');
    }
  };

  return (
    <OnBoardLayout className={style['did-signin']}>
      <NavContainer>
        <Navbar navItemClicked={(item: string) => {}} />
      </NavContainer>
      <OnBoardLayoutLeft
        style={{
          backgroundImage: `url(${leftBg})`
        }}
      >
        <OnBoardLayoutLogo />
        <OnBoardLayoutLeftContent></OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>

      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle>
            Welcome back
          </OnBoardLayoutRightContentTitle>
          <Text16 style={{ marginBottom: '35px', maxWidth: '420px' }}>
            Don't forget to fill out as much of your profile as you can. You
            will earn badges and be set up for the future — where you can earn
            off your data, under your control!
          </Text16>
          <ThemeButton
            img="white"
            onClick={connect}
            style={{ width: '100%' }}
          />

          <OnBoardLayoutRightContentTitle style={{ marginTop: '100px' }}>
            New to Profile?
          </OnBoardLayoutRightContentTitle>
          <ThemeTransparentButton
            to="/create-profile"
            text="Create a new Profile"
          />
          <Footer>
            <FooterLinks />
          </Footer>
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  session: makeSelectSession()
});

export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      setSession: (props: { session: ISessionItem }) =>
        dispatch(setSession(props))
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SignInPage);
