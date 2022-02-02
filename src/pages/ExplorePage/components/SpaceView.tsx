import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import WelcomeSpace from './WelcomeSpace';
import RequestCommunity from './RequestCommunity';

import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';
import { TuumTechScriptService } from 'src/services/script.service';
import { SpaceService } from 'src/services/space.service';

import LoadingIndicator from 'src/elements/LoadingIndicator';
import MySpaces from 'src/pages/SpacePage/components/MySpaces';

const SpaceView = () => {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [loadingText, setLoadingText] = useState('');
  useEffect(() => {
    (async () => {
      setLoadingText('loading spaces...');
      await refreshSpaces();
      setLoadingText('');
    })();
    setTimerForSpaces();
  }, []);

  const setTimerForSpaces = () => {
    const timer = setTimeout(async () => {
      await refreshSpaces();
      setTimerForSpaces();
    }, 4000);
    return () => clearTimeout(timer);
  };

  const refreshSpaces = async () => {
    const all = await TuumTechScriptService.getAllSpaces();
    const groups = _.groupBy(all, 'owner');
    let didService = await DidService.getInstance();
    let userService = new UserService(didService);

    let _spaces = await Promise.all(
      Object.keys(groups).map(async (did: any) => {
        const tuumUser = await userService.SearchUserWithDID(did);
        const spaceNames = groups[did].map((x: any) => x.name);
        const spaces = await SpaceService.getSpaceByNames(tuumUser, spaceNames);
        return spaces.map((x: any) => ({ ...x, owner: did }));
      })
    );
    _spaces = _spaces.reduce((total, x) => total.concat(x), []);
    setSpaces(_spaces);
  };
  return (
    <>
      {loadingText && loadingText !== '' ? (
        <LoadingIndicator loadingText={loadingText} />
      ) : (
        <>
          {spaces.length > 0 ? (
            <>
              <RequestCommunity />
              <MySpaces spaces={spaces} explore={true} />
            </>
          ) : (
            <>
              <WelcomeSpace />
              <RequestCommunity />
            </>
          )}
        </>
      )}
    </>
  );
};

export default SpaceView;
