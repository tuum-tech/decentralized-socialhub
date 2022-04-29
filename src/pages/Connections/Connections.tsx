import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import MainLayout from 'src/components/layouts/MainLayout';
import FollowersPage from './FollowersPage';
import FollowingsPage from './FollowingsPage';
import MutualFollowersPage from './MutualFollowersPage';

const Connections = () => {
  return (
    <MainLayout>
      <Switch>
        <Route path="/connections/followers" component={FollowersPage} exact />
        <Route
          path="/connections/followings"
          component={FollowingsPage}
          exact
        />
        <Route
          path="/connections/mutual-followers"
          component={MutualFollowersPage}
          exact
        />
        <Route exact path="/connections">
          <Redirect to="/connections/followers" />
        </Route>
      </Switch>
    </MainLayout>
  );
};

export default Connections;
