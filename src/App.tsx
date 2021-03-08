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
//import MnemonicPage from './pages/OldPages/pages/MnemonicPage(Obsolete)/Loadable';
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
  AssociatedProfile,
  EmailAssociatedProfile,
  CreateProfilePage,
  CreateWhyPage,
  CreatePasswordPage,
  GenerateDidPage,
  SignDidPage,
  SignQRPage,
  ForgotPasswordPage,
  UnlockUserPage,
  VerifyEmailPage,
  CreateProfileWithDidPage,
} from './pages/Auth'

import AccessCodePage from './pages/AlphaAccess/AccessCode'
import TutorialPage from './pages/TutorialPage'
import ExplorePage from './pages/ExplorePage'
import SettingsPage from './pages/SettingsPage/Loadable'
import ProfilePage from './pages/ProfilePage/Loadable'
import PublicPage from './pages/PublicPage/Loadable'

import ProtectedRoute from './components/ProtectedRoute'

// import RequestCodePage from './pages/AlphaAccess/RequestCode';
// import InviteCodePage from './pages/AlphaAccess/InviteCode';
import ManagerPage from './pages/ManagerPage'
import ElastosMnemonicPage from './pages/OldPages/ElastosMnemonicPage'

const App: React.FC = () => {
  // const [session, setSession] = useState({});

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* <Route path="/login/mnemonic" component={MnemonicPage} exact={true} /> */}
          {/* <Route path="/register/mnemonic" component={MnemonicPage} exact={true} /> */}
          <Route
            path='/login/elastos/mnemonic'
            component={ElastosMnemonicPage}
            exact
          />
          {/* <Route
            path='/login/elastos/qrcode'
            component={ElastosLoginQRPage}
            exact
          />
          <Route path='/register' component={RegisterPage} exact={true} />
          <Route path='/home' component={HomePage} exact={true} /> */}

          <Route path='/create' component={CreateIdentityPage} exact={true} />
          <Route path='/confirm' component={ConfirmMnemonicPage} exact={true} />
          <Route path='/publish' component={PublishIdentityPage} exact={true} />
          <Route path='/choosevault' component={ChooseVaultPage} exact={true} />
          {/* <Route path='/home' component={HomePage} exact={true} /> */}

          <Route path='/Alpha' component={AccessCodePage} exact={true} />
          <ProtectedRoute
            path='/profile'
            component={ProfilePage}
            exact={true}
            proctedby='password'
          />
          <Route path='/explore' component={ExplorePage} exact={true} />
          <Route path='/settings' component={SettingsPage} exact={true} />
          <Route path='/tutorial' component={TutorialPage} exact={true} />
          <Route path='/did/:did' component={PublicPage} exact={true} />
          <Route path='/manager' component={ManagerPage} exact={true} />
          <Route exact path='/' render={() => <Redirect to='/Alpha' />} />

          {/* // login workflow */}
          <Route path='/twitter_callback' component={TwitterCallback} />
          <Route path='/linkedin_callback' component={LinkedinCallback} />
          <Route path='/google_callback' component={GoogleCallback} />
          <Route path='/facebook_callback' component={FacebookCallback} />
          <ProtectedRoute
            path='/set-password'
            component={CreatePasswordPage}
            exact={true}
          />
          <ProtectedRoute
            path='/unlock-user'
            component={UnlockUserPage}
            exact={true}
          />
          <ProtectedRoute
            path='/generate-did'
            component={GenerateDidPage}
            exact={true}
          />
          <ProtectedRoute
            path='/sign-did'
            component={SignDidPage}
            exact={true}
          />
          <ProtectedRoute path='/sign-qr' component={SignQRPage} exact={true} />
          <ProtectedRoute
            path='/associated-profile'
            component={AssociatedProfile}
            exact={true}
          />
          <ProtectedRoute
            path='/email-associated-profile'
            component={EmailAssociatedProfile}
            exact={true}
          />
          <ProtectedRoute
            path='/create-why'
            component={CreateWhyPage}
            exact={true}
          />
          <ProtectedRoute
            path='/create-profile'
            component={CreateProfilePage}
            exact={true}
          />
          <ProtectedRoute
            path='/create-profile-with-did'
            component={CreateProfileWithDidPage}
            exact={true}
          />
          <ProtectedRoute
            path='/forgot-password'
            component={ForgotPasswordPage}
            exact={true}
          />
          <Route path='/verify/email/:code' component={VerifyEmailPage} />

          <Route
            path='*'
            render={() => <Redirect to='/Alpha' />}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
}

export default Sentry.withProfiler(App)
