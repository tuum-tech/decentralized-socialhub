import React from 'react';
import styled from 'styled-components';

import essentialsWhite from 'src/assets/new/auth/essentials_white.png';
import essentialsBlack from 'src/assets/new/auth/essentials_black.png';

interface Props {
  text?: string;
  img?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const ButtonContainer = styled.div`
  border-radius: 10px;
  padding: 13px 28px;
  cursor: pointer;

  color: white;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;

  text-align: cneter;

  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;

  img {
    width: 19px;
    height: 17px;
    margin-right: 10px;
  }

  width: 100%;

  background: linear-gradient(204.71deg, #9a5bff 15.76%, #dd5ac0 136.38%);
`;

const ThemeButton: React.FC<Props> = ({
  text = 'Sign in with Essentials',
  img = '',
  onClick,
  style
}) => {
  const renderImg = () => {
    if (img === '') return <></>;
    if (img === 'white') {
      return <img src={essentialsWhite} alt="eseentials" />;
    }
    return <img src={essentialsBlack} alt="eseentials" />;
  };
  return (
    <ButtonContainer onClick={onClick} style={style}>
      {renderImg()}
      {text}
    </ButtonContainer>
  );
};

export default ThemeButton;
