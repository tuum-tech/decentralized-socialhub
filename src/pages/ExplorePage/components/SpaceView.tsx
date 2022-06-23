import React, { useState, useEffect, useMemo } from 'react';
import { setTimeout, clearTimeout } from 'timers';
import RequestCommunity from './RequestCommunity';

import LoadingIndicator from 'src/elements/LoadingIndicator';
import SpaceListView from 'src/components/Space/SpaceListView';
import { SpaceService } from 'src/services/space.service';
import NoDataCard from 'src/components/NoDataCard';
import welcomeSpacesImg from 'src/assets/nodata/welcome-spaces.svg';

interface Props {
  searchKeyword?: string;
}

const SpaceView: React.FC<Props> = ({ searchKeyword }: Props) => {
  // const loading = useSelector(state => selectSpacesLoading(state));
  // const spaces = useSelector(state => selectSpaces(state));
  const [loading, setLoading] = useState(false);
  const [spaces, setSpaces] = useState<any[]>([]);

  const filteredSpaces = useMemo(() => {
    if (searchKeyword) {
      return spaces.filter(
        v => v.name.includes(searchKeyword) || v.owner?.includes(searchKeyword)
      );
    }
    return spaces;
  }, [spaces, searchKeyword]);

  const refreshSpaces = async (anim: boolean = false) => {
    // dispatch(fetchSpaces());
    anim && setLoading(true);
    const _spaces = await SpaceService.getAllSpaces();
    setSpaces(_spaces);
    anim && setLoading(false);
  };

  useEffect(() => {
    // dispatch(fetchSpaces(true));
    refreshSpaces(true);

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
          {filteredSpaces.length ? (
            <>
              <RequestCommunity />
              <SpaceListView spaces={filteredSpaces} explore={true} />
            </>
          ) : (
            <>
              <NoDataCard
                img={welcomeSpacesImg}
                title="Welcome to Profile Spaces"
                description="Connect with your favorite communities and individuals across the Web3 ecosystem"
                noBorder={false}
              />
              <RequestCommunity />
            </>
          )}
        </>
      )}
    </>
  );
};

export default SpaceView;
