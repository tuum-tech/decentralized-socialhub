import React, { forwardRef, useEffect, useState } from 'react';
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

const StyledModal = styled(IonModal)<{ autoWidth: boolean }>`
  --border-radius: 16px;
  --max-height: 80vh;
  --min-height: 400px;
  --max-width: ${props => (props.autoWidth ? 'auto' : '435px')};
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

const Title = styled(IonCardTitle)`
  font-weight: 600;
  font-size: 28px;
  color: #27272e;
`;

const Subtitle = styled.p`
  font-size: 14px;
  margin-bottom: 24px;
  color: #425466;
`;

const StyledContent = styled.div`
  overflow: auto;
  max-height: calc(80vh - 140px);
  min-height: 230px;
`;

type Props = {
  title: string;
  subtitle?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onOk?: () => void;
  onCancel?: () => void;
  okText?: string;
  noButton?: boolean;
  autoWidth?: boolean;
  backdropDismiss?: boolean;
  contentStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  children?: React.ReactNode;
};

const Modal = forwardRef<React.ReactNode, Props>(
  (
    {
      title,
      subtitle,
      isOpen = false,
      onClose,
      onOk,
      onCancel,
      okText = 'Ok',
      noButton = false,
      autoWidth = false,
      contentStyle,
      titleStyle,
      backdropDismiss = true,
      children
    }: Props,
    ref
  ) => {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
      setShowModal(isOpen);
    }, [isOpen]);

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

    const handleClose = () => {
      setShowModal(false);
      onClose && onClose();
    };

    return (
      <StyledModal
        isOpen={showModal}
        onDidDismiss={handleClose}
        autoWidth={autoWidth}
        backdropDismiss={backdropDismiss}
      >
        <StyledGrid className="ion-no-padding">
          <IonRow className="ion-no-padding ion-justify-content-between">
            <Title style={titleStyle}>{title}</Title>
            <IonButton
              fill="clear"
              size="small"
              onClick={() => {
                handleClose();
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
          <Subtitle>{subtitle}</Subtitle>
          <StyledContent className="ion-padding-bottom" style={contentStyle}>
            {children}
          </StyledContent>
          {!noButton && (
            <IonRow className="ion-justify-content-start ion-padding-vertical">
              <DefaultButton
                variant="contained"
                btnColor="primary-gradient"
                style={{ minWidth: 100 }}
                onClick={() => {
                  handleClose();
                  onOk && onOk();
                }}
              >
                {okText}
              </DefaultButton>
            </IonRow>
          )}
        </StyledGrid>
      </StyledModal>
    );
  }
);

export default Modal;
