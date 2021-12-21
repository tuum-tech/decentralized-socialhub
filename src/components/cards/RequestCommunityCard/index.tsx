import React, { useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonRow,
  IonText,
  IonModal,
} from '@ionic/react';
import styled from 'styled-components';
import style from './RequestCommunityCard.module.scss';
import { StyledButton } from 'src/elements/buttons';
import { MyModal, ModalFooter } from '../common';
import RequestCommunityForm from './RequestCommunityForm';

const CustomModal = styled(IonModal)`
  --height: 540px;
  --width: 450px;
  --min-height: 400px;
  --border-radius: 16px;
`;
const RequestCommunityCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <IonCard className={style['request-community-card']}>
        <IonCardContent className={style['card-content']}>
          <IonRow>
            <div>
              <IonText>
                <h3>Request for a community page?</h3>
              </IonText>
              <IonText>
                <h4>
                  Suggest us content like NFT Collections, pages, profiles,
                  etc..
                </h4>
              </IonText>
            </div>
            <div>
              <StyledButton
                width="200px"
                height="40px"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                Request Community Page
              </StyledButton>
            </div>
          </IonRow>
        </IonCardContent>
      </IonCard>
      <CustomModal
        onDidDismiss={() => {
          setIsModalOpen(false);
        }}
        isOpen={isModalOpen}
        cssClass="my-custom-class"
      >
        <RequestCommunityForm
          onClose={() => {
            setIsModalOpen(false);
          }}
          sendRequest={() => {
            setIsModalOpen(false);
          }}
        />
      </CustomModal>
    </>
  );
};

export default RequestCommunityCard;
