import { IonToggle } from '@ionic/react';
import React from 'react';
import styled from 'styled-components';
import styles from './style.module.scss';

const StyledToggle = styled(IonToggle)`
  --background-checked: ${styles['primary-gradient']};
  width: 25px;
  height: 14px;
  --handle-width: 10px;
  --handle-height: 10px;
`;

interface IProps {
  checked: boolean;
  mode?: 'ios' | 'md';
  handleChange?: React.FormEventHandler<HTMLIonToggleElement> | undefined;
  handleClick?: React.MouseEventHandler<HTMLIonToggleElement> | undefined;
}

const Toggle: React.FC<IProps> = ({
  checked,
  mode = 'ios',
  handleChange,
  handleClick
}: IProps) => {
  return (
    <StyledToggle
      checked={checked}
      mode={mode}
      onChange={handleChange}
      onClick={handleClick}
    />
  );
};

export default Toggle;
