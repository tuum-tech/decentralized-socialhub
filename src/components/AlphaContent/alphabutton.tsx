import { IonButton } from '@ionic/react';
// import React from 'react';

// const ButtonDefault: React.FC = () => {
//   return (
//     <>
//       {/*-- Default Button --*/}
//       <IonButton className="btn">Sign in with DID</IonButton>
//     </>
//   )
// };

// export default ButtonDefault;

import styled from 'styled-components';

const AlphaButtonDefault = styled(IonButton)`
--ion-color-primary: #4C6FFF !important;
--ion-color-primary-tint: #4C7AFF;
  height: 46px;
  background: #4C6FFF 0% 0% no-repeat padding-box !important;
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
