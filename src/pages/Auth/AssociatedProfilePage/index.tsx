import React, { memo, useState, useEffect } from 'react';
import { StaticContext, RouteComponentProps, useHistory } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import Modal from 'react-bootstrap/esm/Modal';
import Button from 'react-bootstrap/esm/Button';
import styled from 'styled-components';

import injector from 'src/baseplate/injectorWrap';
import { AccountType, UserService } from 'src/services/user.service';
import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLeftContentTitle,
  OnBoardLayoutLeftContentDescription,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
  WavingHandImg
} from 'src/components/layouts/OnBoardLayout';
import { ButtonWithLogo } from 'src/components/buttons';
import { Text16 } from 'src/components/texts';
import PageLoading from 'src/components/layouts/PageLoading';
import whitelogo from 'src/assets/logo/whitetextlogo.png';
import eye from 'src/assets/icon/eye.png';
import LoadingIndicator from 'src/components/LoadingIndicator';

import { makeSelectCounter, makeSelectAjaxMsg } from './selectors';
import { incrementAction, getSimpleAjax } from './actions';
import { NameSpace } from './constants';
import reducer from './reducer';
import saga from './saga';
import {
  InferMappedProps,
  SubState,
  UserProps,
  SessionProp,
  LocationState
} from './types';
import { requestForceCreateUser } from './fetchapi';
import GenerateDid from './components/GenerateDid';
import style from './style.module.scss';

export interface ICreateUserResponse {
  data: {
    return_code: string;
    did: string;
  };
}

const DisplayText = styled(Text16)`
  text-align: center;
  color: green;
  margin-top: 8px;
`;

const AssociatedProfilePage: React.FC<RouteComponentProps<
  {},
  StaticContext,
  LocationState
>> = props => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<UserProps | null>(null);
  const [screen, setScreen] = useState('');
  const [associatedInfo, setAssociatedIfno] = useState<SessionProp | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!associatedInfo && props.location.state && props.location.state.name) {
      const {
        name,
        email,
        users,
        id,
        request_token,
        service,
        credential
      } = props.location.state;
      setAssociatedIfno({
        name,
        email,
        users,
        id,
        request_token,
        service,
        credential
      });
      setUser(users[0]);
    }
  }, [associatedInfo]);

  if (!associatedInfo || !user) {
    return <PageLoading />;
  } else if (screen === '/generate-did') {
    return (
      <GenerateDid
        name={associatedInfo.name}
        email={associatedInfo.email}
        request_token={associatedInfo.request_token}
        credential={associatedInfo.credential}
        service={associatedInfo.service}
      />
    );
  }
  return (
    <OnBoardLayout>
      {loading && <LoadingIndicator loadingText="Creating new profie now..." />}
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={eye} />
          <OnBoardLayoutLeftContentTitle className="mt-18px">
            We have seen your social account before.
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentDescription className="mt-25px">
            Sorry, your sign in information has already been linked with another
            profile. You have two options, sign in to the associated profile or
            create a new one.
          </OnBoardLayoutLeftContentDescription>
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
          <ButtonWithLogo
            mode="dark"
            mt={32}
            text="Sign in to profile"
            onClick={() => {
              const signedUserDids = UserService.getSignedUsers();
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
                  pathname: '/sign-did',
                  state: {
                    name: associatedInfo.name,
                    email: associatedInfo.email,
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

          <ButtonWithLogo
            text={'Create new profile'}
            onClick={async () => {
              const { name, email, service } = associatedInfo;
              if (service === AccountType.Email) {
                setLoading(true);
                let response = (await requestForceCreateUser(
                  name,
                  email
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
                setScreen('/generate-did');
              }
            }}
            mt={42}
          />
          {displayText !== '' && <DisplayText>{displayText}</DisplayText>}
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

/** @returns {object} Contains state props from selectors */
export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  counter: makeSelectCounter(),
  msg: makeSelectAjaxMsg()
});

/** @returns {object} Contains dispatchable props */
export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      // eProps - Emitter proptypes thats binds to dispatch
      /** dispatch for counter to increment */
      onCount: (count: { counter: number }) => dispatch(incrementAction(count)),
      onSimpleAjax: () => dispatch(getSimpleAjax())
    }
  };
}

/**
 * Injects prop and saga bindings done via
 * useInjectReducer & useInjectSaga
 */
const withInjectedMode = injector(AssociatedProfilePage, {
  key: NameSpace,
  reducer,
  saga
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo
)(withInjectedMode) as React.ComponentType<InferMappedProps>;

// export default Tab1;
