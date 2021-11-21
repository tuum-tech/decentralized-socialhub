import React, { useState } from 'react';
import { IonCard, IonCardContent, IonText } from '@ionic/react';
import { useHistory } from 'react-router';

import styled from 'styled-components';
import clsx from 'clsx';
import style from './BadgeItem.module.scss';

import { timeSince } from 'src/utils/time';
import { DefaultButton } from 'src/elements/buttons/DefaultButton';

interface Props {
  image: string;
  title: string;
  description: string;
  archived: number | boolean;
  badgeCategory?: string;
}

const BadgeItem: React.FC<Props> = ({
  image,
  title,
  description,
  archived,
  badgeCategory
}) => {
  const history = useHistory();
  const [showGetBadgeButton, setShowGetBadgeButton] = useState<boolean>(false);

  const handleMouseEvent = (isHover: boolean) => {
    if (
      !archived &&
      (badgeCategory === 'account' || badgeCategory === 'socialVerify')
    ) {
      setShowGetBadgeButton(isHover);
    }
  };

  const handleAddExperience = () => {
    history.push(`/manager/${title}`);
  };

  return (
    <IonCard
      className={clsx(
        style['badge-item'],
        showGetBadgeButton && style['non-archived']
      )}
      onMouseEnter={() => handleMouseEvent(true)}
      onMouseLeave={() => handleMouseEvent(false)}
    >
      <IonCardContent>
        <BadgeIcon>
          <img alt="badge icon" src={image} height={60} />
        </BadgeIcon>
        <BadgeContent>
          <Title>{title}</Title>
          {!showGetBadgeButton ? (
            <Description>{description}</Description>
          ) : (
            <DefaultButton
              borderColor="white"
              padding="3px 5px"
              width="60%"
              onClick={handleAddExperience}
            >
              Add Experience
            </DefaultButton>
          )}
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
