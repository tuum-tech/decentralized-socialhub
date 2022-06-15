import { IonCardTitle } from '@ionic/react';
import styled from 'styled-components';

export const ModalTitle = styled(IonCardTitle)`
  color: #27272e;
  width: 100%;
  text-align: center;
  padding-top: 10px;
  font-weight: 700;
  font-size: 36px;
`;

export const ErrorTxt = styled.p`
  font-size: 13px;
  line-height: 15px;
  text-align: center;
  color: red;
  margin-top: 10px;
  position: absolute;
  width: 100%;
`;
