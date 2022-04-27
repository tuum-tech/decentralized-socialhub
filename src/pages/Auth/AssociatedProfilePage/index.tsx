import React, { useState, useEffect } from 'react';
import {
  StaticContext,
  RouteComponentProps,
  useHistory,
  Redirect
} from 'react-router';
import Modal from 'react-bootstrap/esm/Modal';
import Button from 'react-bootstrap/esm/Button';
import styled from 'styled-components';

import { AccountType, UserService } from 'src/services/user.service';
import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
  WavingHandImg
} from 'src/components/layouts/OnBoardLayout';
import { ThemeButton } from 'src/elements/buttons';
import { Text16, Title40, Text18 } from 'src/elements/texts';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import { DidService } from 'src/services/did.service.new';

import eye from 'src/assets/icon/eye.png';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import {
  SubState,
  UserProps,
  SessionProp,
  LocationState,
  InferMappedProps
} from './types';

import { requestForceCreateUser } from './fetchapi';
import style from './style.module.scss';
import FooterLinks, {
  Footer
} from 'src/components/layouts/OnBoardLayout/FooterLinks';

const DisplayText = styled(Text16)`
  text-align: center;
  color: green;
  margin-top: 8px;
`;

interface PageProps
  extends InferMappedProps,
    RouteComponentProps<{}, StaticContext, LocationState> {}

const AssociatedProfilePage: React.FC<PageProps> = ({ eProps, ...props }) => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<UserProps | null>(null);
  const [associatedInfo, setAssociatedIfno] = useState<SessionProp | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!associatedInfo && props.location.state && props.location.state.name) {
      const { name, loginCred, users, id, service } = props.location.state;
      setAssociatedIfno({
        name,
        loginCred,
        users,
        id,
        service
      });
      setUser(users[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [associatedInfo]);

  if (!associatedInfo || !user) {
    return <LoadingIndicator />;
  }

  return (
    <OnBoardLayout>
      {loading && <LoadingIndicator loadingText="Creating new profie now..." />}
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={eye} />
          <Title40 className="mt-18px">
            We have seen your social account before.
          </Title40>
          <Text18 className="mt-25px">
            Sorry, your sign in information has already been linked with another
            profile. You have two options, sign in to the associated profile or
            create a new one.
          </Text18>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle>
            Sign into the associated profile
          </OnBoardLayoutRightContentTitle>
          <Text16>Decentralized Identity (DID):</Text16>
          <div className={style['did-select']}>
            <select
              value={user._id}
              onChange={event => {
                const selectedId = (event.target as HTMLSelectElement).value;
                const selectedIndex = associatedInfo.users.findIndex(
                  (item: UserProps) => item._id === selectedId
                );
                setUser(associatedInfo.users[selectedIndex]);
              }}
            >
              {associatedInfo &&
                associatedInfo.users &&
                associatedInfo.users.length > 0 &&
                associatedInfo.users.map((user: UserProps) => (
                  <option key={user._id} value={user._id}>
                    {user.did || `${user._id}(Email not verified)`}
                  </option>
                ))}
            </select>
          </div>
          <Text16 style={{ marginTop: '17px' }}>
            Has been already linked to profile registered, sign into this
            profile below.
          </Text16>
          <ThemeButton
            text="Sign in to profile"
            onClick={async () => {
              const signedUserDids = await UserService.getSignedUsers();
              if (user.did === '') {
                setShowModal(true);
              } else if (
                signedUserDids &&
                signedUserDids.length > 0 &&
                signedUserDids.includes(user.did)
              ) {
                history.push({
                  pathname: '/unlock-user',
                  state: {
                    dids: [user.did]
                  }
                });
              } else {
                history.push({
                  pathname: '/sign-in',
                  state: {
                    name: associatedInfo.name,
                    loginCred: associatedInfo.loginCred,
                    service: AccountType.DID
                  }
                });
              }
            }}
          />
          <OnBoardLayoutRightContentTitle style={{ marginTop: '96px' }}>
            Create new profile
          </OnBoardLayoutRightContentTitle>
          <Text16>Use your email to create a new profile.</Text16>

          <ThemeButton
            text="Create new profile"
            onClick={async () => {
              const { name, loginCred, service } = associatedInfo;
              if (service === AccountType.Email) {
                if (!loginCred.email) return;
                setLoading(true);
                let response = (await requestForceCreateUser(
                  name,
                  loginCred.email
                )) as ICreateUserResponse;
                setLoading(false);
                if (
                  response &&
                  response.data &&
                  response.data.return_code === 'WAITING_CONFIRMATION'
                ) {
                  setDisplayText(
                    'Verification email is sent to you. Please confirm to complete your registration.'
                  );
                }
              } else {
                setLoading(true);
                let userService = new UserService(
                  await DidService.getInstance()
                );
                const sessionItem = await userService.CreateNewUser(
                  name,
                  service,
                  loginCred,
                  '',
                  '',
                  '',
                  '',
                  ''
                );
                setLoading(false);

                eProps.setSession({ session: sessionItem });
                history.push('/profile');
              }
            }}
          />
          {displayText !== '' && <DisplayText>{displayText}</DisplayText>}

          <Footer>
            <FooterLinks />
          </Footer>
        </OnBoardLayoutRightContent>

        <Modal show={showModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Not verified user</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This email is not verified yet. We already sent verification email,
            so please verify first and continue process.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  session: makeSelectSession()
});

export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      setSession: (props: { session: ISessionItem }) =>
        dispatch(setSession(props))
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssociatedProfilePage);
