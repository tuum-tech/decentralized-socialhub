import { IonButton } from '@ionic/react';

import styled from 'styled-components';

const AlphaButtonDefault = styled(IonButton)`
  --ion-color-primary: #4c6fff !important;
  --ion-color-primary-tint: #4c7aff;
  height: 46px;
  background: #4c6fff 0% 0% no-repeat padding-box !important;
  border-radius: 8px;
  opacity: 1;

  font-family: 'SF Pro Display';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  color: #ffffff;
`;

export default AlphaButtonDefault;
