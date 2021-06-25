import React from 'react';

import { Route, Switch, Redirect } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import * as Sentry from '@sentry/react';

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

import PublishIdentityPage from './pages/PublishIdentityPage';
import ChooseVaultPage from './pages/ChooseVaultPage';
import TermsPage from './pages/TermsPage';
import {
  GoogleCallback,
  TwitterCallback,
  LinkedinCallback,
  FacebookCallback,
  GithubCallback,
  DiscordCallback,
  AssociatedProfilePage,
  CreateProfilePage,
  CreateWhyPage,
  CreatePasswordPage,
  GenerateDidPage,
  SignDidPage,
  SignDidPageNew,
  SignQRPage,
  ForgotPasswordPage,
  UnlockUserPage,
  VerifyEmailPage,
  CreateProfileWithDidPage,
  CreateProfileWithDidPageNew
} from './pages/Auth';

import TestPage from './pages/TestPage';
import DefaultPage from './pages/404Page';
import AccessCodePage from './pages/AlphaAccess/AccessCode';
import ExplorePage from './pages/ExplorePage';
import SettingsPage from './pages/SettingsPage/Loadable';
import DashboardPage from './pages/DashboardPage/Loadable';
import PublicPage from './pages/PublicPage/Loadable';
import ManagerPage from './pages/ManagerPage';
import ActivityPage from './pages/ActivityPage';
import FollowersPage from './pages/FollowersPage';
import FollowingsPage from './pages/FollowingsPage';

import ProtectedRoute from './components/ProtectedRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

const StyledToastContainer = styled(ToastContainer)`
  & .Toastify__toast-body {
    padding: 20px 25px;
  }
`;
const App: React.FC = () => {
  return (
    <IonApp>
      <StyledToastContainer
        autoClose={10000}
        closeButton={false}
        hideProgressBar={true}
        closeOnClick={true}
        position="top-right"
      />
      <IonReactRouter>
        <Switch>
          <IonRouterOutlet>
            {/* ====== Private URLs that are log in required ==== */}

            <ProtectedRoute
              path="/publish"
              component={PublishIdentityPage}
              exact={true}
            />
            <ProtectedRoute
              path="/choosevault"
              component={ChooseVaultPage}
              exact={true}
            />
            <ProtectedRoute
              path="/profile"
              component={DashboardPage}
              exact={true}
            />
            <ProtectedRoute
              path="/connections"
              component={FollowersPage}
              exact={true}
            />
            <ProtectedRoute
              path="/connections/followings"
              component={FollowingsPage}
              exact={true}
            />
            <ProtectedRoute
              path="/connections/followers"
              component={FollowersPage}
              exact={true}
            />
            <ProtectedRoute
              path="/explore/:did?"
              component={ExplorePage}
              exact={false}
            />
            <ProtectedRoute
              path="/settings"
              component={SettingsPage}
              exact={true}
            />
            <ProtectedRoute
              path="/manager"
              component={ManagerPage}
              exact={true}
            />
            <ProtectedRoute
              path="/activities"
              component={ActivityPage}
              exact={true}
            />
            {/* // login workflow */}
            <Route path="/twitter_callback" component={TwitterCallback} />
            <Route path="/linkedin_callback" component={LinkedinCallback} />
            <Route path="/google_callback" component={GoogleCallback} />
            <Route path="/facebook_callback" component={FacebookCallback} />
            <Route path="/github_callback" component={GithubCallback} />
            <Route path="/discord_callback" component={DiscordCallback} />
            <ProtectedRoute
              path="/set-password"
              component={CreatePasswordPage}
              exact={true}
            />
            <ProtectedRoute
              path="/unlock-user"
              component={UnlockUserPage}
              exact={true}
            />
            <ProtectedRoute
              path="/generate-did"
              component={GenerateDidPage}
              exact={true}
            />
            <ProtectedRoute
              path="/sign-did"
              component={SignDidPage}
              exact={true}
            />
            <ProtectedRoute
              path="/sign-did-new"
              component={SignDidPageNew}
              exact={true}
            />
            <ProtectedRoute
              path="/sign-qr"
              component={SignQRPage}
              exact={true}
            />
            <ProtectedRoute
              path="/associated-profile"
              component={AssociatedProfilePage}
              exact={true}
            />
            <ProtectedRoute
              path="/create-why"
              component={CreateWhyPage}
              exact={true}
            />
            <ProtectedRoute
              path="/create-profile"
              component={CreateProfilePage}
              exact={true}
            />
            <ProtectedRoute
              path="/create-profile-with-did"
              component={CreateProfileWithDidPage}
              exact={true}
            />

            <ProtectedRoute
              path="/create-profile-with-did-new"
              component={CreateProfileWithDidPageNew}
              exact={true}
            />
            <ProtectedRoute
              path="/forgot-password"
              component={ForgotPasswordPage}
              exact={true}
            />
            <Route path="/terms-of-use" component={TermsPage} />
            <Route path="/verify/email/:code" component={VerifyEmailPage} />

            {/* ====== Public URLs ==== */}
            <Route exact path="/" render={() => <Redirect to="/Alpha" />} />
            <Route path="/Alpha" component={AccessCodePage} exact={true} />
            <Route path="/did/:did" component={PublicPage} exact={true} />
            <Route path="/test" component={TestPage} exact={true} />
            <Route component={DefaultPage} />
          </IonRouterOutlet>
        </Switch>
      </IonReactRouter>
    </IonApp>
  );
};

export default Sentry.withProfiler(App);
