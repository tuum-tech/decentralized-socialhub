import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { IonApp, IonRouterOutlet } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import * as Sentry from '@sentry/react'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import './theme/variables.css'
// import './theme/theme-clearlyme.css';

import './styles/app.scss'

/* Pages */
// import HomePage from './pages/HomePage'
// import LoginPage from './pages/OldPages/LoginPage/Loadable'
// import LoginPage from './pages/LoginPage/Loadable';
// import ElastosLoginPage from './pages/OldPages/ElastosLoginPage/Loadable';
// import MnemonicPage from './pages/OldPages/pages/MnemonicPage/Loadable';
// import RegisterPage from './pages/OldPages/RegisterPage/Loadable'
// import ElastosMnemonicPage from './pages/OldPages/ElastosMnemonicPage'
// import ElastosLoginQRPage from './pages/OldPages/ElastosLoginQRPage'
// import SessionContext from './context/session.context';
// import TwitterCallback from './pages/TwitterCallback';

import CreateIdentityPage from './pages/OldPages/CreateIdentityPage'
import ConfirmMnemonicPage from './pages/OldPages/ConfirmMnemonicPage'
import PublishIdentityPage from './pages/PublishIdentityPage'
import ChooseVaultPage from './pages/ChooseVaultPage'

import {
  GoogleCallback,
  TwitterCallback,
  LinkedinCallback,
  FacebookCallback,
} from './pages/SocialCallback'
import AssociatedProfile from './pages/AssociatedProfilePage/Loadable'
import CreateProfilePage from './pages/CreateProfilePage/Loadable'
import CreateWhyPage from './pages/CreateWhyPage/Loadable'
import CreatePasswordPage from './pages/CreatePasswordPage/Loadable'
import GenerateDidPage from './pages/GenerateDidPage/Loadable'
import SignDidPage from './pages/SignDidPage/Loadable'
import SignQRPage from './pages/SignQRPage/Loadable'
import ForgotPasswordPage from './pages/ForgotPasswordPage/Loadable'
import SignHelpPage from './pages/SignHelpPage/Loadable'

import VerifyEmailPage from './pages/VerifyEmailPage'
import AccessCodePage from './pages/AlphaAccess/AccessCode'

import TutorialPage from './pages/TutorialPage'
import ExplorePage from './pages/ExplorePage'
import ProfilePage from './pages/ProfilePage/Loadable'
import PublicPage from './pages/PublicPage/Loadable'

const App: React.FC = () => {
  // const [session, setSession] = useState({});

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* <Route path='/login' component={LoginPage} exact={true} />
          <Route path="/login/mnemonic" component={MnemonicPage} exact={true} />
          <Route path="/register/mnemonic" component={MnemonicPage} exact={true} />
          <Route
            path='/login/elastos/mnemonic'
            component={ElastosMnemonicPage}
            exact
          />
          <Route
            path='/login/elastos/qrcode'
            component={ElastosLoginQRPage}
            exact
          />
          <Route path='/register' component={RegisterPage} exact={true} />
          <Route path='/home' component={HomePage} exact={true} />
          */}

          <Route path='/create' component={CreateIdentityPage} exact={true} />
          <Route path='/confirm' component={ConfirmMnemonicPage} exact={true} />
          <Route path='/publish' component={PublishIdentityPage} exact={true} />
          <Route path='/choosevault' component={ChooseVaultPage} exact={true} />
          {/* <Route path='/home' component={HomePage} exact={true} /> */}

          <Route
            path='/'
            render={() => <Redirect to='/Alpha' />}
            exact={true}
          />
          <Route path='/Alpha' component={AccessCodePage} exact={true} />
          <Route path='/profile' component={ProfilePage} exact={true} />
          <Route path='/explore' component={ExplorePage} exact={true} />
          <Route path='/tutorial' component={TutorialPage} exact={true} />
          <Route path='/did/:did' component={PublicPage} exact={true} />

          {/* // login workflow */}
          <Route path='/twitter_callback' component={TwitterCallback} />
          <Route path='/linkedin_callback' component={LinkedinCallback} />
          <Route path='/google_callback' component={GoogleCallback} />
          <Route path='/facebook_callback' component={FacebookCallback} />

          <Route
            path='/generate-did'
            component={GenerateDidPage}
            exact={true}
          />
          <Route
            path='/set-password'
            component={CreatePasswordPage}
            exact={true}
          />
          <Route path='/sign/help' component={SignHelpPage} exact={true} />
          <Route path='/sign-did' component={SignDidPage} exact={true} />
          <Route path='/sign/qr' component={SignQRPage} exact={true} />
          <Route path='/a-profile' component={AssociatedProfile} exact={true} />
          <Route path='/create/why' component={CreateWhyPage} exact={true} />
          <Route
            path='/create-profile'
            component={CreateProfilePage}
            exact={true}
          />
          <Route
            path='/forgot-password'
            component={ForgotPasswordPage}
            exact={true}
          />

          <Route
            path='/verify/email/:code'
            component={VerifyEmailPage}
            exact={true}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
}

export default Sentry.withProfiler(App)
