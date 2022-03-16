import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import WelcomeSpace from './WelcomeSpace';
import RequestCommunity from './RequestCommunity';

import { SpaceService } from 'src/services/space.service';

import LoadingIndicator from 'src/elements/LoadingIndicator';
import SpaceListView from 'src/pages/SpacePage/components/SpaceListView';

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
    const spaces = await SpaceService.getAllSpaces();
    setSpaces(spaces);
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
              <SpaceListView spaces={spaces} explore={true} />
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
