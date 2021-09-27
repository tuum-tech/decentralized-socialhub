import React, { useState } from 'react';
import { IonCol, IonModal } from '@ionic/react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import Avatar from 'src/components/Avatar';
import shieldIcon from '../../../assets/icon/shield.svg';

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
    justify-content: space-around;
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
}

const Verifiers: React.FC<Props> = ({ users }) => {
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  return (
    <IonCol>
      <img
        alt="shield icon"
        src={shieldIcon}
        style={{ width: '1em' }}
        onClick={() => setShowModal(true)}
      />

      <VerifierModal
        isOpen={showModal}
        cssClass="my-custom-class"
        onDidDismiss={() => setShowModal(false)}
      >
        <Container>
          <p className="title">Verifiers</p>
          {users.map((user: any) => (
            <div className="userRow">
              <Avatar did={user.did} width="45px" />
              <p
                className="ml-2"
                key={user.did}
                onClick={() => {
                  setShowModal(false);
                  history.push('/did/' + user.did);
                }}
              >
                {user.name}
                <br />
                <span>{user.did}</span>
              </p>
            </div>
          ))}
        </Container>
      </VerifierModal>
    </IonCol>
  );
};

export default Verifiers;
