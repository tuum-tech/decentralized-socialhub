import React from 'react';

import { CardHeader, CardTitle, CardText, LinkButton } from './Common';
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
