import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import ProfilePage from './pages/ProfilePage/Loadable';
import PublicPage from './pages/PublicPage/Loadable';

// import LinkedinCallback from './pages/LinkedinCallback/Loadable';
// import FacebookCallback from './pages/FacebookCallback/Loadable';
// import GoogleCallback from './pages/SocialCallback/GoogleCallback';
// import GenerateDID from './pages/GenerateDID';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
// import './theme/theme-clearlyme.css';

import './styles/app.scss';

/* Pages */
// import LoginPage from './pages/OldPages/LoginPage/Loadable';
// import LoginPage from './pages/LoginPage/Loadable';
// import ElastosLoginPage from './pages/ElastosLoginPage/Loadable';
// import MnemonicPage from './pages/MnemonicPage/Loadable';
// import RegisterPage from './pages/RegisterPage';
// import HomePage from './pages/HomePage';
// import ElastosMnemonicPage from './pages/OldPages/ElastosMnemonicPage';
// import ElastosLoginQRPage from './pages/OldPages/ElastosLoginQRPage';
// import CreateIdentityPage from './pages/OldPages/CreateIdentityPage';
// import ConfirmMnemonicPage from './pages/OldPages/ConfirmMnemonicPage';
// import PublishIdentityPage from './pages/PublishIdentityPage';
// import ChooseVaultPage from './pages/ChooseVaultPage';
// import RegisterPage from './pages/OldPages/RegisterPage';
// import SessionContext from './context/session.context';
// import TwitterCallback from './pages/TwitterCallback';

import {
  GoogleCallback,
  TwitterCallback,
  LinkedinCallback,
  GenerateDID,
  FacebookCallback,
} from './pages/Auth/SocialCallback';

// import LoadingPage from './pages/LoadingPage';

import CreateProfilePage from './pages/Auth/Create/CreateProfilePage';
import CreatePasswordPage from './pages/Auth/Create/CreatePassword';
import AssociatedProfilePage from './pages/Auth/Create/AssociatedProfilePage';

import CreateWhyPage from './pages/Auth/Create/CreateWhyPage';
import PasswordSignPage from './pages/Auth/Sign/PasswordSignPage';
import DIDSingPage from './pages/Auth/Sign/DIDSignPage';
import QRSignPage from './pages/Auth/Sign/QRSignPage';
import SignHelpPage from './pages/Auth/Sign/SignHelp';
import ForgotPasswordPage from './pages/Auth/Sign/ForgotPasswordPage';

import TutorialPage from './pages/TutorialPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ExplorePage from './pages/ExplorePage';

import AccessCodePage from './pages/AlphaAccess/AccessCode';
import RequestCodePage from './pages/AlphaAccess/RequestCode';
import InviteCodePage from './pages/AlphaAccess/InviteCode';

const App: React.FC = () => {
  // const [session, setSession] = useState({});

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* <Route path='/login' component={LoginPage} exact={true} />
          <Route
            path='/login/elastos/mnemonic'
            component={ElastosMnemonicPage}
            exact={true}
          />
          <Route
            path='/login/elastos/qrcode'
            component={ElastosLoginQRPage}
            exact={true}
          />
          <Route path='/register' component={RegisterPage} exact={true} />

          <Route path='/create' component={CreateIdentityPage} exact={true} />
          <Route path='/confirm' component={ConfirmMnemonicPage} exact={true} />
          <Route path='/publish' component={PublishIdentityPage} exact={true} />

          <Route path='/choosevault' component={ChooseVaultPage} exact={true} /> */}

          {/* <Route path='/home' component={HomePage} exact={true} /> */}
          <Route path='/profile' component={ProfilePage} exact={true} />
          <Route path='/explore' component={ExplorePage} exact={true} />
          {/* <Route path="/login/mnemonic" component={MnemonicPage} exact={true} /> */}
          {/* <Route path="/register/mnemonic" component={MnemonicPage} exact={true} /> */}
          {/* <Route exact path='/' render={() => <Redirect to='/Alpha' />} /> */}

          {/* // login workflow */}
          <Route path='/profile' component={ProfilePage} exact={true} />
          <Route path='/twitter_callback' component={TwitterCallback} />
          <Route path='/linkedin_callback' component={LinkedinCallback} />
          <Route path='/google_callback' component={GoogleCallback} />
          <Route path='/facebook_callback' component={FacebookCallback} />
          <Route path='/social_login_success' component={GenerateDID} />
          <Route path='/sign/help' component={SignHelpPage} exact={true} />
          <Route
            path='/sign/password'
            component={PasswordSignPage}
            exact={true}
          />
          <Route path='/sign/did' component={DIDSingPage} exact={true} />
          <Route path='/sign/qr' component={QRSignPage} exact={true} />
          <Route
            path='/forgot-password'
            component={ForgotPasswordPage}
            exact={true}
          />
          <Route
            path='/create/profile'
            component={CreateProfilePage}
            exact={true}
          />
          <Route
            path='/create/associated-profile'
            component={AssociatedProfilePage}
            exact={true}
          />
          <Route
            path='/create/password'
            component={CreatePasswordPage}
            exact={true}
          />
          <Route path='/create/why' component={CreateWhyPage} exact={true} />
          <Route path='/did/:did' component={PublicPage} exact={true} />

          {/* <Route path='/loading' component={LoadingPage} exact={true} /> */}

          <Route path='/Alpha' component={AccessCodePage} exact={true} />
          <Route
            path='/Alpha/request'
            component={RequestCodePage}
            exact={true}
          />
          <Route path='/Alpha/invite' component={InviteCodePage} exact={true} />

          <Route path='/tutorial' component={TutorialPage} exact={true} />

          <Route
            path='/verify/email/:code'
            component={VerifyEmailPage}
            exact={true}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
