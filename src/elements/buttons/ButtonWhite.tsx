import { IonButton } from '@ionic/react';
import styled from 'styled-components';

const ButtonWhite = styled(IonButton)`
  border-radius: 6px;
  background-color: #ffffff;

  text-align: center;
  font: 'SF Pro Display';
  text-transform: none;
  letter-spacing: 0px;
  color: #000;
  font-size: 12px;
  font-weight: 600;
  --background: #fff 0% 0% no-repeat padding-box;
  --background-activated: #fff 0% 0% no-repeat padding-box;
  margin-top: 1em;

  &:hover {
    --background-hover: #fff 0% 0% no-repeat padding-box;
  }
`;

export default ButtonWhite;
