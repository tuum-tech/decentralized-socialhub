import { IonButton } from '@ionic/react';
import styled from 'styled-components';

const SocialLoginLink = styled(IonButton)`
  width: 46px;
  height: 46px;
  border: 1px solid #cbcbcb;
  border-radius: 5px;
  opacity: 1;
  text-align: center;
  --background: #fff 0% 0% no-repeat padding-box;

  &:hover {
    --background-hover: #fff 0% 0% no-repeat padding-box;
  }
`;

export default SocialLoginLink;
