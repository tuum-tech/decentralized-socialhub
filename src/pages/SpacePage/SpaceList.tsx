import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTimeout, clearTimeout } from 'timers';

import SpacePageHeader, {
  Header,
  SpaceTabsContainer
} from './components/SpacePageHeader';
import SpaceListView from 'src/components/Space/SpaceListView';
import { LinkButton } from 'src/elements-v2/buttons';
import SpaceFirstPage from './components/SpaceFirstPage';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import useSession from 'src/hooks/useSession';
import { selectSpaces, selectSpacesLoading } from 'src/store/spaces/selectors';
import { fetchSpaces } from 'src/store/spaces/actions';
import HeaderMenu from 'src/elements-v2/HeaderMenu';

const SpaceList: React.FC = () => {
  const dispatch = useDispatch();
  const { session } = useSession();
  const loading = useSelector(state => selectSpacesLoading(state));
  const spaces = useSelector(state => selectSpaces(state));
  const [active, setActive] = useState('my spaces');

  const refreshSpaces = useCallback(() => {
    dispatch(fetchSpaces());
  }, [dispatch]);

  const mySpaces = useMemo(
    () =>
      spaces?.filter((x: any) => {
        const owners = typeof x.owner === 'string' ? [x.owner] : x.owner;
        return owners.includes(session.did);
      }) ?? [],
    [session, spaces]
  );
  const followingSpaces = useMemo(
    () =>
      spaces?.filter((x: any) => {
        return (x.followers || []).includes(session.did);
      }) ?? [],
    [session, spaces]
  );

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
      <Header>
        <HeaderMenu title="Spaces" />
        {!loading && mySpaces.length > 0 && (
          <LinkButton
            variant="contained"
            btnColor="primary-gradient"
            href="/spaces/create"
          >
            Create New Space
          </LinkButton>
        )}
      </Header>
      <SpaceTabsContainer template="default">
        <SpacePageHeader active={active} setActive={setActive} />
        {loading ? (
          <LoadingIndicator loadingText={'loading spaces...'} />
        ) : (
          <>
            {active === 'my spaces' &&
              (mySpaces.length > 0 ? (
                <SpaceListView spaces={mySpaces} />
              ) : (
                <SpaceFirstPage />
              ))}
            {active === 'following' && (
              <SpaceListView
                spaces={followingSpaces.filter((x: any) =>
                  (x.followers || []).includes(session.did)
                )}
                explore
              />
            )}
          </>
        )}
      </SpaceTabsContainer>
    </>
  );
};

export default SpaceList;
