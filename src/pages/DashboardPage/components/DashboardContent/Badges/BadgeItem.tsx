import React from 'react';
import { IonCard, IonCardContent, IonText } from '@ionic/react';

import styled from 'styled-components';
import style from './BadgeItem.module.scss';

import { timeSince } from 'src/utils/time';

interface Props {
  image: string;
  title: string;
  description: string;
  archived: number | boolean;
}

const BadgeItem: React.FC<Props> = ({
  image,
  title,
  description,
  archived
}) => {
  return (
    <IonCard className={style['badge-item']}>
      <IonCardContent>
        <BadgeIcon>
          <img src={image} height={60} />
        </BadgeIcon>
        <BadgeContent>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </BadgeContent>
      </IonCardContent>
      <TimeSince>{archived ? timeSince(archived) : ' '}</TimeSince>
    </IonCard>
  );
};

const BadgeIcon = styled.div`
  display: flex;
  justify-content: center;

  margin: 1em 1.4em 1.7em 1.4em;
`;
const Title = styled(IonText)`
  display: block;
  font-size: 14px;

  margin-bottom: 10px;
`;
const Description = styled(IonText)`
  display: block;
  font-size: 12px;
`;
const TimeSince = styled(IonText)`
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);

  font-size: 10px;
`;
const BadgeContent = styled.div`
  text-align: center;
`;
export default BadgeItem;
