import React, { forwardRef, useState } from 'react';
import {
  IonModal,
  IonRow,
  IonGrid,
  IonCardTitle,
  IonButton
} from '@ionic/react';
import styled from 'styled-components';
import { DefaultButton } from 'src/elements-v2/buttons';
import Icon from './icons';

const StyledModal = styled(IonModal)`
  --border-radius: 16px;
  --max-height: 80vh;
  --max-width: 435px;
  --height: auto;

  .ion-page {
    position: relative;
    display: block;
    contain: content;
  }
`;

const StyledGrid = styled(IonGrid)`
  margin: 20px 25px;
`;

const StyledTitle = styled(IonCardTitle)`
  font-weight: 600;
  font-size: 28px;
  color: #27272e;
`;

const StyledContent = styled.div`
  overflow: auto;
  max-height: calc(80vh - 140px);
`;

type Props = {
  title: string;
  onOk?: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  children?: React.ReactNode;
};

const Modal = forwardRef<React.ReactNode, Props>(
  (
    {
      title,
      onOk,
      onCancel,
      okText = 'Ok',
      cancelText = 'Cancel',
      children
    }: Props,
    ref
  ) => {
    const [showModal, setShowModal] = useState(false);

    React.useImperativeHandle(
      ref,
      () => ({
        open: () => {
          setShowModal(true);
        },
        close: () => {
          setShowModal(false);
        }
      }),
      []
    );

    return (
      <StyledModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <StyledGrid className="ion-no-padding">
          <IonRow className="ion-no-padding ion-justify-content-between">
            <StyledTitle>{title}</StyledTitle>
            <IonButton
              fill="clear"
              size="small"
              onClick={() => {
                setShowModal(false);
                onCancel && onCancel();
              }}
            >
              <Icon
                name="close-outline"
                style={{ fontSize: 20 }}
                color="dark"
              />
            </IonButton>
          </IonRow>
          <StyledContent className="ion-padding-bottom">
            {children}
          </StyledContent>
          <IonRow className="ion-justify-content-start ion-padding-vertical">
            <DefaultButton
              variant="contained"
              btnColor="primary-gradient"
              style={{ minWidth: 100 }}
              onClick={() => {
                setShowModal(false);
                onOk && onOk();
              }}
            >
              {okText}
            </DefaultButton>
          </IonRow>
        </StyledGrid>
      </StyledModal>
    );
  }
);

export default Modal;
