import React from 'react';
import styled from 'styled-components';
import { IonButton } from '@ionic/react';
import closeSvg from 'src/assets/new/close.svg';
import { LinkButton } from 'src/elements-v2/buttons';
import { Link } from 'react-router-dom';

export const ToastIntro = styled.p`
  font-family: 'SF Pro Display';
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
      <LinkButton
        variant="text"
        href="https://try.profile.site"
        target="_blank"
      >
        <ToastIntro className="intro">
          Ready to be discovered and grow your NFT community? Submit your
          collection today!
        </ToastIntro>
      </LinkButton>
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
