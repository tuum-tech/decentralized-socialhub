import React from 'react';
import styled from 'styled-components';
import { IonButton } from '@ionic/react';
import closeSvg from 'src/assets/new/close.svg';

export const ToastIntro = styled.p`
  font-family: 'Rubik';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  color: #ffffff;

  @media only screen and (max-width: 600px) {
    font-size: 12px;
  }
`;

const ToastContainer = styled.div`
  width: 100%;
  background: #824dd9;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  .close-Image {
    position: absolute;
    right: 15px;
    cursor: pointer;
  }

  @media only screen and (max-width: 600px) {
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 30px;
    padding-right: 30px;
  }
`;

interface IProps {
  onClose: () => void;
}

const Toast: React.FC<IProps> = ({ onClose }) => {
  return (
    <ToastContainer>
      <ToastIntro className="intro">
        Are you an NFT club member? We invite you to join NFT Spaces on Profile.
        Contact us to Join {'>'}
      </ToastIntro>
      <img
        src={closeSvg}
        alt="closeSvg"
        className="close-Image"
        onClick={onClose}
      />
    </ToastContainer>
  );
};

export default Toast;
