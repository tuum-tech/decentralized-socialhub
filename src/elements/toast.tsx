import React from 'react';
import styled from 'styled-components';

import { DefaultLinkButton } from 'src/elements/buttons';
import toastSuccess from 'src/assets/icon/toast_success.svg';
import toastWarning from 'src/assets/icon/toast_warning.svg';
import toastInfo from 'src/assets/icon/toast_info.svg';
import toastError from 'src/assets/icon/toast_error.svg';

interface IToastProps {
  type: string;
  title: string;
  text: string;
  onOK: () => void;
}

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
`;
export const CardTitle = styled.p`
  color: black;
  font-size: 20px;
  font-weight: bold;
  line-height: 26px;
`;
export const CardText = styled.p`
  margin-top: 5px;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 25px;
  color: #425466;
  max-width: 315px;
  maring-bottom: 15px;
`;

export const LinkButton = styled(DefaultLinkButton)`
  margin-top: 25px;
  width: 64px;
  height: 32px;
  color: white;
  background-color: #4c6fff;
  text-align: left !important;
  padding: 15px 25px;
`;

const ToastBox: React.FC<IToastProps> = ({ type, title, text, onOK }) => {
  const toastIcons = {
    success: toastSuccess,
    error: toastError,
    warning: toastWarning,
    info: toastInfo
  };
  const toastColors = {
    success: '#2fd5dd',
    error: '#ff5a5a',
    warning: '#ff9840',
    info: '#4c6fff'
  };
  return (
    <>
      <CardHeader>
        <CardTitle style={{ color: (toastColors as any)[type] }}>
          {title}
        </CardTitle>
        <img src={(toastIcons as any)[type]} alt="toast-icon" />
      </CardHeader>
      <CardText
        style={{
          marginTop: '4px',
          marginBottom: '26px'
        }}
      >
        {text}
      </CardText>

      <LinkButton onClick={onOK} target="_blank">
        OK
      </LinkButton>
    </>
  );
};

export default ToastBox;
