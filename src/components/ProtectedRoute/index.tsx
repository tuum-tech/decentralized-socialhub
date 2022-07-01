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
  const authRoutes = [
    '/unlock-user',
    '/generate-did',
    '/sign-in',
    '/create-why',
    '/create-profile',
    'recover-account'
  ];

  let isLoggedIn = window.localStorage.getItem('isLoggedIn');

  const isAuthPage =
    authRoutes.findIndex(item => routeProps.path.includes(item)) > -1;

  if (!isLoggedIn && !isAuthPage) {
    return (
      <Route {...routeProps} render={() => <Redirect to="/create-profile" />} />
    );
  }
  if (isLoggedIn && isAuthPage) {
    return <Route {...routeProps} render={() => <Redirect to="/profile" />} />;
  }

  return <Route {...routeProps} render={props => <Component {...props} />} />;
};
export default ProtectedRoute;
