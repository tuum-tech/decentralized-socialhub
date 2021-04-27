import React from 'react';
import { IonCard, IonCardContent, IonText } from '@ionic/react';

import styled from 'styled-components';
import style from './BadgeItem.module.scss';

interface Props {
  image: string;
  title: string;
  description: string;
}

const BadgeItem: React.FC<Props> = ({ image, title, description }) => {
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
  font-size: 12px;
`;
const BadgeContent = styled.div`
  text-align: center;
`;
export default BadgeItem;
