import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTimeout, clearTimeout } from 'timers';
import WelcomeSpace from './WelcomeSpace';
import RequestCommunity from './RequestCommunity';

import LoadingIndicator from 'src/elements/LoadingIndicator';
import SpaceListView from 'src/components/Space/SpaceListView';
import { selectSpaces, selectSpacesLoading } from 'src/store/spaces/selectors';
import { fetchSpaces } from 'src/store/spaces/actions';

const SpaceView = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => selectSpacesLoading(state));
  const spaces = useSelector(state => selectSpaces(state));

  const refreshSpaces = async () => {
    dispatch(fetchSpaces());
  };

  useEffect(() => {
    dispatch(fetchSpaces(true));

    let timer = setTimeout(function start() {
      refreshSpaces();
      timer = setTimeout(start, 5000);
    }, 5000);

    return () => clearTimeout(timer);
  }, [dispatch, refreshSpaces]);
  return (
    <>
      {loading ? (
        <LoadingIndicator loadingText="loading spaces..." />
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
