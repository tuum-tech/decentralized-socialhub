import React from 'react';

import { Route, Switch } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import * as Sentry from '@sentry/react';

import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';

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
import SupportForum from './pages/SupportForum';
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
  SignInPage,
  SignQRPage,
  ForgotPasswordPage,
  UnlockUserPage,
  CreateProfileWithDidPage,
  RecoverAccountPage,
  EmailVerificationPage
} from './pages/Auth';

import HomePage from './pages/HomePage';
import DefaultPage from './pages/404Page';
import ExplorePage from './pages/ExplorePage';
import SettingsPage from './pages/SettingsPage/Loadable';
import DashboardPage from './pages/DashboardPage/Loadable';
import PublicPage from './pages/PublicPage/Loadable';
import ManagerPage from './pages/ManagerPage';
import ActivityPage from './pages/ActivityPage';
import SpacePage from './pages/SpacePage';
import SpaceDashboardPage from './pages/SpaceDashboardPage';
import SpacePublicPage from './pages/SpacePublicPage';
import SyncPage from './pages/SyncPage';
import FollowersPage from './pages/FollowersPage';
import FollowingsPage from './pages/FollowingsPage';
import MutualFollowersPage from './pages/MutualFollowersPage';

import ProtectedRoute from './components/ProtectedRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { DidService } from './services/did.service.new';
import LoadDid from './pages/LoadDid';
import { connectivity } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { EssentialsConnector } from '@elastosfoundation/essentials-connector-client-browser';
import { RecoilRoot } from 'recoil';
import SimplePage from './pages/SimplePage';

const StyledToastContainer = styled(ToastContainer)`
  & .Toastify__toast-body {
    padding: 20px 25px;
  }
`;

function getLibrary(provider: any) {
  return new Web3(provider);
}

const App: React.FC = () => {
  // TODO: find a good place for this static initialization
  DidService.InitializeMainnet();
  // Elastos essential connector
  const essentialConnector = new EssentialsConnector();
  connectivity.setApplicationDID(process.env.REACT_APP_APPLICATION_DID || '');
  let connectors = connectivity.getAvailableConnectors();
  if (!connectors.find(connector => connector.name === 'essentials'))
    connectivity.registerConnector(essentialConnector);
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <RecoilRoot>
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
                  path="/connections/mutual-followers"
                  component={MutualFollowersPage}
                  exact={true}
                />
                <ProtectedRoute
                  path="/explore/:did?"
                  component={ExplorePage}
                  exact={false}
                />
                {/* in a progress */}
                <ProtectedRoute
                  path="/spaces"
                  component={SpacePage}
                  exact={true}
                />
                <ProtectedRoute
                  path="/spaces/edit/:name"
                  component={SpaceDashboardPage}
                  exact={true}
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
                  path="/manager/:badge"
                  component={ManagerPage}
                  exact={true}
                />
                <ProtectedRoute
                  path="/activities"
                  component={ActivityPage}
                  exact={true}
                />

                <ProtectedRoute
                  path="/sync"
                  component={SyncPage}
                  exact={true}
                />

                {/* // login workflow */}
                <Route path="/twitter_callback" component={TwitterCallback} />
                <Route path="/linkedin_callback" component={LinkedinCallback} />
                <Route path="/google_callback" component={GoogleCallback} />
                <Route path="/facebook_callback" component={FacebookCallback} />
                <Route path="/github_callback" component={GithubCallback} />
                <Route path="/discord_callback" component={DiscordCallback} />

                {/* ok */}
                <ProtectedRoute
                  path="/set-password"
                  component={CreatePasswordPage}
                  exact={true}
                />
                <ProtectedRoute
                  path="/email-verification"
                  component={EmailVerificationPage}
                  exact={true}
                />

                {/* ok */}
                <ProtectedRoute
                  path="/unlock-user"
                  component={UnlockUserPage}
                  exact={true}
                />
                {/* to test */}
                <ProtectedRoute
                  path="/generate-did"
                  component={GenerateDidPage}
                  exact={true}
                />
                {/* to test */}
                <ProtectedRoute
                  path="/sign-in"
                  component={SignInPage}
                  exact={true}
                />
                <ProtectedRoute
                  path="/recover-account"
                  component={RecoverAccountPage}
                  exact={true}
                />

                {/* ok */}
                <ProtectedRoute
                  path="/sign-qr"
                  component={SignQRPage}
                  exact={true}
                />
                {/* ok */}
                <ProtectedRoute
                  path="/associated-profile"
                  component={AssociatedProfilePage}
                  exact={true}
                />
                {/* to ckeck */}
                <ProtectedRoute
                  path="/create-why"
                  component={CreateWhyPage}
                  exact={true}
                />
                {/* to test */}
                <ProtectedRoute
                  path="/create-profile"
                  component={CreateProfilePage}
                  exact={true}
                />
                {/* to test */}
                <ProtectedRoute
                  path="/create-profile-with-did"
                  component={CreateProfileWithDidPage}
                  exact={true}
                />

                <ProtectedRoute
                  path="/forgot-password"
                  component={ForgotPasswordPage}
                  exact={true}
                />
                <ProtectedRoute
                  path="/support-forum/:num"
                  component={SupportForum}
                  exact={true}
                />
                <Route
                  path="/support-forum"
                  component={SupportForum}
                  exact={true}
                />
                <Route
                  path="/terms-of-use"
                  component={TermsPage}
                  exact={true}
                />

                {/* ====== Public URLs ==== */}
                <Route path="/" component={HomePage} exact={true} />
                <Route path="/did/:did" component={PublicPage} exact={true} />
                <Route
                  path="/did/:did/spaces/:name"
                  component={SpacePublicPage}
                  exact={true}
                />
                <Route
                  path="/community-spaces/:name"
                  component={SpacePublicPage}
                  exact={true}
                />
                <Route path="/load" component={LoadDid} />
                <Route path="/test" component={SimplePage} />
                <Route component={DefaultPage} />
              </IonRouterOutlet>
            </Switch>
          </IonReactRouter>
        </IonApp>
      </RecoilRoot>
    </Web3ReactProvider>
  );
};

export default Sentry.withProfiler(App);
