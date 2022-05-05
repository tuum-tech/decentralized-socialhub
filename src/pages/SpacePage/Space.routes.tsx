import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import MainLayout from 'src/components/layouts/MainLayout';
import CreateSpace from './components/CreateSpace';
import SpaceList from './SpaceList';

const SpaceRoutes: React.FC = () => {
  return (
    <MainLayout>
      <Switch>
        <Route exact path="/spaces/list" component={SpaceList} />
        <Route exact path="/spaces/create" component={CreateSpace} />

        <Route exact path="/spaces">
          <Redirect to="/spaces/list" />
        </Route>
      </Switch>
    </MainLayout>
  );
};

export default SpaceRoutes;
