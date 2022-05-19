/**
 * Page
 */
import React, { useState, useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';

import { useRecoilState } from 'recoil';
import { SyncSpaceAtom } from 'src/Atoms/Atoms';

import useQuery from 'src/hooks/useQuery';

import SpaceEditor from './components/SpaceEditor';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import { defaultSpace, SpaceService } from 'src/services/space.service';
import HeaderMenu from 'src/elements-v2/HeaderMenu';
import useSession from 'src/hooks/useSession';
import { Guid } from 'guid-typescript';

const Header = styled.div`
  width: 100%;
  height: 83px;
  background: #fff;
  padding: 10px 48px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${down('sm')} {
    padding: 10px 20px 10px;
    height: fit-content;
  }
`;

interface MatchParams {
  guid: string;
}

interface PageProps extends RouteComponentProps<MatchParams> {}

const SpaceDashboardPage: React.FC<PageProps> = (props: PageProps) => {
  const guid = props.match.params.guid;
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
    return true; //owners.includes(session.did);
  }, [spaceProfile, session]);

  const updateSpace = async () => {
    if (!guid) return;
    let spaces = [];
    if (type === 'community') {
      spaces = await SpaceService.getCommunitySpaceByIds([Guid.parse(guid)]);
    } else {
      spaces = await SpaceService.getSpaceByIds(session, [Guid.parse(guid)]);
    }
    if (spaces.length > 0) {
      setSpaceProfile(spaces[0]);
    }
  };
  useEffect(() => {
    if (session && guid) {
      console.log({ session, guid });
      (async () => {
        await updateSpace();
      })();
    }
  }, [session, guid, type]);

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
        <SpaceEditor session={session} profile={spaceProfile} />
      ) : (
        <LoadingIndicator loadingText="Loading..." />
      )}
    </>
  );
};

export default SpaceDashboardPage;
