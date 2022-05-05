import React, { useEffect, useState, useCallback } from 'react';
import { SpaceService } from 'src/services/space.service';

import SpacePageHeader, {
  Header,
  PageTitle,
  SpaceTabsContainer
} from './components/SpacePageHeader';
import SpaceListView from 'src/components/Space/SpaceListView';
import { LinkButton } from 'src/elements-v2/buttons';
import SpaceFirstPage from './components/SpaceFirstPage';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import useSession from 'src/hooks/useSession';

const SpaceList: React.FC = () => {
  const { session } = useSession();
  const [loadingText, setLoadingText] = useState('');
  const [mySpaces, setMySpaces] = useState<any[]>([]);
  const [followingSpaces, setFollowingSpaces] = useState<any[]>([]);
  const [active, setActive] = useState('my spaces');

  const setTimerForSpaces = () => {
    const timer = setTimeout(async () => {
      await refreshSpaces();
      setTimerForSpaces();
    }, 5000);
    return () => clearTimeout(timer);
  };

  const refreshSpaces = useCallback(async () => {
    const spaces: any[] = await SpaceService.getAllSpaces();
    const mySpaces = spaces.filter((x: any) => {
      const owners = typeof x.owner === 'string' ? [x.owner] : x.owner;
      return owners.includes(session.did);
    });
    const followingSpaces = spaces.filter((x: any) => {
      return (x.followers || []).includes(session.did);
    });
    setMySpaces(mySpaces);
    setFollowingSpaces(followingSpaces);
  }, [session]);

  useEffect(() => {
    (async () => {
      setLoadingText('loading spaces...');
      await refreshSpaces();
      setLoadingText('');
    })();
    setTimerForSpaces();
  }, []);

  return (
    <>
      <Header>
        <PageTitle>Spaces</PageTitle>
        {mySpaces.length > 0 && (
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
        {loadingText && loadingText !== '' ? (
          <LoadingIndicator loadingText={loadingText} />
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
