import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTimeout, clearTimeout } from 'timers';
import WelcomeSpace from './WelcomeSpace';
import RequestCommunity from './RequestCommunity';

import LoadingIndicator from 'src/elements/LoadingIndicator';
import SpaceListView from 'src/components/Space/SpaceListView';
import { selectSpaces, selectSpacesLoading } from 'src/store/spaces/selectors';
import { fetchSpaces } from 'src/store/spaces/actions';

interface Props {
  searchKeyword?: string;
}

const SpaceView: React.FC<Props> = ({ searchKeyword }: Props) => {
  const dispatch = useDispatch();
  const loading = useSelector(state => selectSpacesLoading(state));
  const spaces = useSelector(state => selectSpaces(state));

  const filteredSpaces = useMemo(() => {
    if (searchKeyword) {
      return spaces.filter(
        v => v.name.includes(searchKeyword) || v.owner?.includes(searchKeyword)
      );
    }
    return spaces;
  }, [spaces, searchKeyword]);

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
  }, []);
  return (
    <>
      {loading ? (
        <LoadingIndicator loadingText="loading spaces..." />
      ) : (
        <>
          {filteredSpaces.length > 0 ? (
            <>
              <RequestCommunity />
              <SpaceListView spaces={filteredSpaces} explore={true} />
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
