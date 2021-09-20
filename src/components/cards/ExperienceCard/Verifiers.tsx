import React, { useState } from 'react';
import { IonCol, IonModal } from '@ionic/react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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

  .userRow {
    display: flex;
    align-items: center;
    justify-content: space-around;
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
          {users.map((user: any) => (
            <div className="userRow">
              <Avatar did={user.did} width="45px" />
              <Link className="ml-2" key={user.did} to={'/did/' + user.did}>
                {user.name} &nbsp; ({user.did})
              </Link>
            </div>
          ))}
        </Container>
      </VerifierModal>
    </IonCol>
  );
};

export default Verifiers;
