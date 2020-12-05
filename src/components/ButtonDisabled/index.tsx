import { IonButton } from '@ionic/react';
// import React from 'react';

// const ButtonDisabled: React.FC = () => {
//   return (
//     <>
//       {/*-- Default Button --*/}
//       <IonButton className="btn">Sign in with DID</IonButton>
//     </>
//   )
// };

// export default ButtonDisabled;

import styled from 'styled-components';

const ButtonDisabled = styled(IonButton)`
    width: 273px;
    height: 49px;

    background: #C9C9C9 0% 0% no-repeat padding-box;
    --background: #C9C9C9;
    border-radius: 8px;
    opacity: 1;

    text-align: center;
    font: normal normal 600 18px/21px "Open Sans";
    text-transform: none;
    letter-spacing: 0px;
    color: #FFFFFF;
`;

export default ButtonDisabled;