import React from 'react';
import { IonImg } from '@ionic/react';
import styled from 'styled-components';
import { RequestStatus } from 'src/services/assist.service';
import waiting from '../../../../assets/icon/waiting.svg';
import ready from '../../../../assets/icon/ready.svg';

interface Props {
  status: RequestStatus;
}

const PublishingLabel: React.FC<Props> = ({ status }) => {
  const label = status === RequestStatus.Completed ? 'Ready' : 'Publishing';
  const icon = status === RequestStatus.Completed ? ready : waiting;
  const color = status === RequestStatus.Completed ? '#4c6fff' : '#ff5a5a';
  return (
    <Wrapper style={{ backgroundColor: color }}>
      <span>{label}</span>
      <IonImg src={icon} />
    </Wrapper>
  );
};

const Wrapper = styled('span')`
  display: inline-flex;
  padding: 0px 10px;
  border-radius: 16px;

  & span {
    margin-right: 6px;
    color: #ffffff;
    font-size: 12px;
    font-weight: bold;
  }
  & ion-img {
    display: inline-block;
    width: 15px;
  }
`;
export default PublishingLabel;
