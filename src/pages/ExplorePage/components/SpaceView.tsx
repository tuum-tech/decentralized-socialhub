import React, { useState, useEffect } from 'react';
import WelcomeSpace from './WelcomeSpace';
import RequestCommunity from './RequestCommunity';

import { SpaceService } from 'src/services/space.service';

import LoadingIndicator from 'src/elements/LoadingIndicator';
import SpaceListView from 'src/components/Space/SpaceListView';

const SpaceView = () => {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [loadingText, setLoadingText] = useState('');

  const setTimerForSpaces = useCallback(() => {
    const timer = setTimeout(async () => {
      await refreshSpaces();
      setTimerForSpaces();
    }, 4000);
    return () => clearTimeout(timer);
  });

  const refreshSpaces = async () => {
    const spaces = await SpaceService.getAllSpaces();
    setSpaces(spaces);
  };

  useEffect(() => {
    (async () => {
      setLoadingText('loading spaces...');
      await refreshSpaces();
      setLoadingText('');
    })();
    setTimerForSpaces();
  }, [setTimerForSpaces]);
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
