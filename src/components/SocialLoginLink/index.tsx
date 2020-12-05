import { IonButton, IonLabel, IonText } from '@ionic/react';
import { render } from 'react-dom';
import styled from 'styled-components';

const SocialLoginLink = styled(IonButton)`
width: 46px;
height: 46px;
border: 1px solid #CBCBCB;
border-radius: 5px;
opacity: 1;
text-align: center;
--background: #FFF 0% 0% no-repeat padding-box;

&:hover {
    --background-hover: #FFF 0% 0% no-repeat padding-box;
}
`;

export default SocialLoginLink;