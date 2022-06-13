/**
 * Page
 */
import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import { useBreakpoint } from 'styled-breakpoints/react-styled';
import { up } from 'styled-breakpoints';

import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';

import { LinkButton } from 'src/elements-v2/buttons';
import ProfileEditor from './components/ProfileEditor';
import { getDIDString } from 'src/utils/did';
import MainLayout from 'src/components/layouts/MainLayout';
import useSession from 'src/hooks/useSession';
import { Header } from 'src/components/layouts/MainLayout/Header';
import HeaderMenu from 'src/elements-v2/HeaderMenu';

const WarningText = styled.div`
  color: red;
  font-size: 15px;
  margin-top: 20px;
  padding: 0 40px;
`;

const ManagerPage: React.FC<RouteComponentProps> = (
  props: RouteComponentProps
) => {
  const { session, setSession } = useSession();
  const [user, setUser] = useState<ISessionItem>({} as ISessionItem);
  const isSmUp = useBreakpoint(up('sm'));

  useEffect(() => {
    if (session) {
      setUser(session);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainLayout>
      <Header>
        <HeaderMenu title="Profile Manager" />
        {isSmUp && (
          <LinkButton
            variant="contained"
            btnColor="primary-gradient"
            icon="open-outline"
            size="large"
            href={getDIDString('/did/' + user.did)}
            target="_blank"
            style={{
              cursor: user.tutorialStep === 4 ? ' pointer' : 'not-allowed'
            }}
          >
            View Profile
          </LinkButton>
        )}
      </Header>
      {user.tutorialStep !== 4 && (
        <WarningText>
          Please complete the tutorial first before managing your Profile.
        </WarningText>
      )}

      {user && user.did && user.did !== '' && (
        <ProfileEditor
          session={user}
          badgeUrl={props.match.params}
          updateSession={async (newSession: { session: ISessionItem }) => {
            let userService = new UserService(await DidService.getInstance());
            setSession(await userService.updateSession(newSession.session));
            setUser(newSession.session);
          }}
        />
      )}
    </MainLayout>
  );
};

export default ManagerPage;
