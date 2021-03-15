import { IonButton } from '@ionic/react';

import styled from 'styled-components';

const ButtonDisabled = styled(IonButton)`
  width: 273px;
  height: 49px;

  background: #f0f0f0 0% 0% no-repeat padding-box;
  --background: #f0f0f0;
  border-radius: 8px;
  opacity: 1;

  text-align: center;
  font: normal normal 600 18px/21px 'Open Sans';
  text-transform: none;
  letter-spacing: 0px;
  color: #d0d0d0;
`;

export default ButtonDisabled;
