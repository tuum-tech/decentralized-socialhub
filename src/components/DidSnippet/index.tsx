import React from 'react';
import { IonText } from '@ionic/react';
import styled from 'styled-components';
import did from '../../assets/icon/did.svg';
import { AddressDTO, BasicDTO } from 'src/pages/PublicPage/types';

interface IProp {
  basicDTO: BasicDTO
}

const DidSnippet: React.FC<IProp> = ({ basicDTO }: IProp) => {
  return (

    <ProfileDesignation>
      <img src={did} alt="pin" />&nbsp;<span>{basicDTO.did}</span>
    </ProfileDesignation>
  )
};

export default DidSnippet;


const ProfileDesignation = styled(IonText)`
font-family: 'SF Pro Display';
font-size: 14px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: 1.62;
letter-spacing: normal;
text-align: left;
color: #979797;
`;