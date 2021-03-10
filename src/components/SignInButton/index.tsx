import { IonRouterLink } from '@ionic/react';
import React from 'react';
import styled from 'styled-components';
import { ButtonLink } from '../buttons';

const SignInButton = styled(IonRouterLink)`
width: 140px;
height: 40px;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
gap: 10px;
padding: 12px 20px;
border-radius: 9px;
background-color: #4c6fff;
flex-grow: 0;
font-family: 'SF Pro Display';
font-size: 12px;
font-weight: 600;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: left;
color: #ffffff;

`;


export default SignInButton;
