import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import LoginPage from './pages/LoginPage/Loadable';
import ProfilePage from './pages/ProfilePage/Loadable';
import LinkedinCallback from './pages/LinkedinCallback/Loadable';

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
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/login" component={LoginPage} exact={true} />
        <Route path="/register" component={RegisterPage} exact={true} />
        <Route path="/home" component={HomePage} exact={true} />
        <Route path="/profile" component={ProfilePage} exact={true} />
        <Route path="/linkedin_callback" component={LinkedinCallback} exact={false} />
        <Route exact path="/" render={() => <Redirect to="/login" />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
