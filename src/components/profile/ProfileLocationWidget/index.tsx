import React from 'react';
import { IonText } from '@ionic/react';
import styled from 'styled-components';
import pin from '../../assets/icon/pin.svg';
import { AddressDTO } from 'src/pages/PublicPage/types';

interface IProp {
  address: AddressDTO;
}

const ProfileLocationWidget: React.FC<IProp> = ({ address }: IProp) => {
  return (
    <ProfileDesignation>
      <img src={pin} alt="pin" />
      &nbsp;
      <span>
        {address.state}, {address.country}
      </span>
    </ProfileDesignation>
  );
};

export default ProfileLocationWidget;

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
