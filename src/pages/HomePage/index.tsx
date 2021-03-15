/**
 * Page
 */
import { IonHeader, IonPage, IonImg } from '@ionic/react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injector from 'src/baseplate/injectorWrap';
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors';
import { incrementAction, getSimpleAjax } from './actions';
import React, { memo } from 'react';
import style from './style.module.scss';
import { NameSpace } from './constants';
import reducer from './reducer';
import saga from './saga';
import { InferMappedProps, SubState } from './types';
import {
  requestLinkedinLogin,
  requestGoogleLogin,
  requestFacebookLogin
} from './fetchapi';
import Header from 'src/components/layouts/Header';
import ClearlyMeContent from 'src/components/ClearlyMeContent';
import ButtonDefault from 'src/components/buttons/ButtonDefault';
import ButtonLight from 'src/components/buttons/ButtonLight';
import SocialLoginLink from 'src/components/SocialLoginLink';
import TwitterApi from 'src/shared-base/api/twitter-api';
// import MnemonicContext from 'src/context/MnemonicContext';

const HomePage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  // const [msg, setMsg] = useState('');
  // const simpleAjaxDirect = async ()=>{
  //   const msg = await fetchSimpleApi() as string;
  //   setMsg(msg);
  // }

  localStorage.setItem('mnemonic', '');

  const linkedinlogin = async () => {
    type MyType = { meta: string; data: string };

    // gets the linkedin auth endpoint
    const url = (await requestLinkedinLogin()) as MyType;

    // redirects
    window.location.href = url.data;
  };

  const facebooklogin = async () => {
    type MyType = { meta: string; data: string };

    // gets the linkedin auth endpoint
    const url = (await requestFacebookLogin()) as MyType;

    // redirects
    window.location.href = url.data;
  };

  const googlelogin = async () => {
    type MyType = { meta: string; data: string };

    // gets the linkedin auth endpoint
    const url = (await requestGoogleLogin()) as MyType;

    // redirects
    window.location.href = url.data;
  };

  const twitterlogin = async () => {
    type MyType = { meta: string; data: { request_token: string } };

    // gets the linkedin auth endpoint
    const response = (await TwitterApi.GetRequestToken()) as MyType;

    // redirects
    window.location.replace(
      `https://api.twitter.com/oauth/authorize?oauth_token=${response.data.request_token}`
    );
  };

  // const openMenu = async function () {
  //   await menuController.open();
  // };

  return (
    <IonPage className={style['homepage']}>
      <ClearlyMeContent>
        <IonHeader style={{ height: '80px' }}>
          <Header />
        </IonHeader>
        <div className={style['main-container']}>
          <h2>
            Digital Identity
            <br /> Your Profile, Your Data
          </h2>
          <br />
          <br />
          <div style={{ textAlign: 'center' }}>
            <ButtonDefault href="/login/elastos/mnemonic">
              Sign in with DID
            </ButtonDefault>
          </div>

          <div style={{ textAlign: 'center' }}>
            <ButtonLight href="/create">Create New DID</ButtonLight>
          </div>

          {/* <ButtonGhost /> */}
          <br />
          <p>Continue with</p>
          <div className="social-login">
            <SocialLoginLink href="/login/elastos/qrcode">
              <IonImg
                src="../../assets/logo_elastos.svg"
                style={{ minWidth: '24px' }}
              />
            </SocialLoginLink>
            <SocialLoginLink>
              <IonImg
                onClick={googlelogin}
                src="../../assets/logo_google.svg"
                style={{ minWidth: '24px' }}
              />
            </SocialLoginLink>
            <SocialLoginLink>
              <IonImg
                onClick={linkedinlogin}
                src="../../assets/logo_linkedin.svg"
                style={{ minWidth: '24px' }}
              />
            </SocialLoginLink>
            <SocialLoginLink>
              <IonImg
                onClick={twitterlogin}
                src="../../assets/logo_twitter.svg"
                style={{ minWidth: '24px' }}
              />
            </SocialLoginLink>
            <SocialLoginLink>
              <IonImg
                onClick={facebooklogin}
                src="../../assets/logo_facebook.svg"
                style={{ minWidth: '24px' }}
              />
            </SocialLoginLink>
          </div>
        </div>
      </ClearlyMeContent>
    </IonPage>
  );
};

/** @returns {object} Contains state props from selectors */
export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  counter: makeSelectCounter(),
  msg: makeSelectAjaxMsg()
});

/** @returns {object} Contains dispatchable props */
export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      // eProps - Emitter proptypes thats binds to dispatch
      /** dispatch for counter to increment */
      onCount: (count: { counter: number }) => dispatch(incrementAction(count)),
      onSimpleAjax: () => dispatch(getSimpleAjax())
    }
  };
}

/**
 * Injects prop and saga bindings done via
 * useInjectReducer & useInjectSaga
 */
const withInjectedMode = injector(HomePage, {
  key: NameSpace,
  reducer,
  saga
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo
)(withInjectedMode) as React.ComponentType<InferMappedProps>;

// export default Tab1;
