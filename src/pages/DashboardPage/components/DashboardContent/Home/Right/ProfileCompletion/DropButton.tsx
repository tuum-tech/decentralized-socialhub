import React from 'react';
import styled from 'styled-components';

import DropDown from '../../../../../../../elements/svg/DropDown';
import DropUp from '../../../../../../../elements/svg/DropUp';

interface IProps {
  onClick: () => void;
  isUp: boolean;
}

const Container = styled.div`
  cursor: pointer;
  width: 21px;
`;

const DropButton: React.FC<IProps> = ({ onClick, isUp }) => {
  return (
    <Container onClick={onClick}>{isUp ? <DropUp /> : <DropDown />}</Container>
  );
};

export default DropButton;
