import React from 'react';
import { Redirect, Route } from 'react-router-dom';

type ProtectedRouteProps = {
  path: string;
  component: React.ElementType;
  exact?: boolean;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  ...routeProps
}) => {
  const invitecode = window.localStorage.getItem('invitecode');
  if (!invitecode && routeProps.path !== '/Alpha') {
    return <Route {...routeProps} render={() => <Redirect to="/Alpha" />} />;
  }

  const authRoutes = [
    '/twitter_callback',
    '/linkedin_callback',
    '/google_callback',
    '/facebook_callback',
    '/set-password',
    '/unlock-user',
    '/generate-did',
    '/sign-did',
    '/sign-qr',
    '/associated-profile',
    '/create-why',
    '/create-profile',
    '/create-profile-with-did',
    '/forgot-password',
    '/verify/email'
  ];

  const sessionInstance = window.localStorage.getItem('session_instance');
  const isAuthPage =
    authRoutes.findIndex(item => routeProps.path.includes(item)) > -1;

  if (!sessionInstance && !isAuthPage) {
    return (
      <Route {...routeProps} render={() => <Redirect to="/create-profile" />} />
    );
  }
  if (sessionInstance && isAuthPage) {
    return <Route {...routeProps} render={() => <Redirect to="/profile" />} />;
  }

  return <Route {...routeProps} render={props => <Component {...props} />} />;
};
export default ProtectedRoute;
