import React from 'react';
import { IonSpinner, IonContent, IonInput } from '@ionic/react';
import styled from 'styled-components';

const StyledIonInput = styled(IonInput)`
--background:#edf2f7 !important;
 width: 90%;
 height: 32.7px;
 margin-top:2px;
 padding: 7px 16px 9.7px 5px !important;
 --padding-top: 13px !important;
 --padding-start: 16px !important;
 --padding-end: 16px !important;
 border-radius: 6px;
 box-shadow: 0 0 1px 0 rgba(50, 50, 71, 0.2), 0 1px 2px 0 rgba(50, 50, 71, 0.08);
 background-color: #edf2f7;
 font-family: 'SF Pro Display';
 font-size: 13px !important;
 font-weight: 500 !important;
 font-stretch: normal !important;
 font-style: normal !important;
 line-height: 1.15 !important;
 letter-spacing: normal;
 text-align: left !important;
 color: #6b829a;
`;

const StyledLabel = styled.span`
padding: 1px 0px 3px 0;
font-family: 'SF Pro Display';
font-size: 14px;
font-weight: 500;
font-stretch: normal;
font-style: normal;
line-height: normal;
letter-spacing: normal;
text-align: left;
color: #425466;
`;



const LabeledInput: React.FC = () => {
  return (
    <>
      <StyledLabel>First Name</StyledLabel>
      <StyledIonInput />
    </>
  )
};

export default LabeledInput;
