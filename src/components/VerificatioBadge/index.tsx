import React, { useState } from 'react';
import { IonModal } from '@ionic/react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useBreakpoint } from 'styled-breakpoints/react-styled';
import { down } from 'styled-breakpoints';

import Avatar from 'src/components/Avatar';
import { getDIDString, getShortenedDid } from 'src/utils/did';
import shieldIcon from '../../assets/icon/shield.svg';

const VerifierModal = styled(IonModal)`
  --border-radius: 16px;
  --width: 528px;
  --height: 478px;
  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

const Container = styled.div`
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow: auto;

  .title {
    text-align: center;
    margin: 20px;
    font-size: 24px;
    font-weight: bold;
  }

  .userRow {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 16px;
    box-shadow: 0px 3px 8px -1px rgb(50 50 71 / 5%);
    filter: drop-shadow(0px 0px 1px rgba(12, 26, 75, 0.24));
    margin-bottom: 20px;
    padding: 14px;

    cursor: pointer;

    span {
      text-decoration: underline;
    }
  }
`;

interface Props {
  users: {
    name: string;
    did: string;
  }[];
  userSession: ISessionItem;
}

const VerificationBadge: React.FC<Props> = ({ users, userSession }) => {
  const isSmDown = useBreakpoint(down('sm'));
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  return (
    <>
      <img
        alt="shield icon"
        src={shieldIcon}
        style={{ width: '1em', marginLeft: '5px' }}
        onClick={() => setShowModal(true)}
      />

      <VerifierModal
        isOpen={showModal}
        cssClass="my-custom-class"
        onDidDismiss={() => setShowModal(false)}
      >
        <Container>
          <p className="title">Verifiers</p>
          {users.map((user: any) => {
            return (
              <div className="userRow" key={user.did}>
                <Avatar did={user.did} width="45px" />
                <p
                  className="ml-2"
                  key={user.did}
                  onClick={() => {
                    setShowModal(false);
                    history.push(getDIDString('/did/' + user.did));
                  }}
                >
                  {user.name}
                  {user.did === userSession.did && ' (Self-Proclaimed)'}
                  <br />
                  <span>
                    {isSmDown ? getShortenedDid(user.did, 5) : user.did}
                  </span>
                </p>
              </div>
            );
          })}
        </Container>
      </VerifierModal>
    </>
  );
};

export default VerificationBadge;
