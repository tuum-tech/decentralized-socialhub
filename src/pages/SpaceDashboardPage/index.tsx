/**
 * Page
 */
import React, { useState, useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components';

import { useRecoilState } from 'recoil';
import { SyncSpaceAtom } from 'src/Atoms/Atoms';

import useQuery from 'src/hooks/useQuery';

import ProfileEditor from './components/ProfileEditor';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import { defaultSpace, SpaceService } from 'src/services/space.service';
import HeaderMenu from 'src/elements-v2/HeaderMenu';
import useSession from 'src/hooks/useSession';

const Header = styled.div`
  width: 100%;
  height: 83px;
  background: #fff;
  padding: 10px 48px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface MatchParams {
  name: string;
}

interface PageProps extends RouteComponentProps<MatchParams> {}

const SpaceDashboardPage: React.FC<PageProps> = (props: PageProps) => {
  const spaceName = props.match.params.name;
  const query = useQuery();
  const type = query.get('type');
  const { session } = useSession();
  const [syncSpace, setSyncSpace] = useRecoilState(SyncSpaceAtom);
  const [spaceProfile, setSpaceProfile] = useState<any>(defaultSpace);
  const isOwner = useMemo(() => {
    const owners = spaceProfile.owner
      ? typeof spaceProfile.owner === 'string'
        ? [spaceProfile.owner]
        : spaceProfile.owner
      : [];
    return owners.includes(session.did);
  }, [spaceProfile, session]);

  const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const updateSpace = async () => {
    if (!spaceName) return;
    let names = [...new Set([spaceName, capitalize(spaceName)])];
    let spaces = [];
    if (type === 'community') {
      spaces = await SpaceService.getCommunitySpaceByNames(names);
    } else {
      spaces = await SpaceService.getSpaceByNames(session, names);
    }
    if (spaces.length > 0) {
      setSpaceProfile(spaces[0]);
    }
  };
  useEffect(() => {
    if (session && spaceName) {
      (async () => {
        await updateSpace();
      })();
    }
  }, [session, spaceName, type]);

  useEffect(() => {
    if (syncSpace) {
      (async () => {
        await updateSpace();
        setSyncSpace(false);
      })();
    }
  }, [syncSpace]);

  return (
    <>
      <Header>
        <HeaderMenu
          title="Spaces"
          subtitle={spaceProfile.name}
          back
          backUrl="/spaces"
        />
      </Header>
      {isOwner ? (
        <ProfileEditor session={session} profile={spaceProfile} />
      ) : (
        <LoadingIndicator loadingText="Loading..." />
      )}
    </>
  );
};

export default SpaceDashboardPage;
