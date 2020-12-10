import { IonButton } from '@ionic/react';
import styled from 'styled-components';

const ButtonLight = styled(IonButton)`
    width: 273px;
    height: 49px;

    border: 1px solid #000000;
    border-radius: 5px;
    opacity: 1;

    text-align: center;
    font: normal normal 600 18px/21px "Open Sans";
    text-transform: none;
    letter-spacing: 0px;
    color: #000;
    --background: #FFF 0% 0% no-repeat padding-box;
    --background-activated: #FFF 0% 0% no-repeat padding-box;

    &:hover {
        --background-hover: #FFF 0% 0% no-repeat padding-box;
    }    
`;

export default ButtonLight;