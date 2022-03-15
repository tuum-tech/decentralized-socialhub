import React from 'react';
import { IonRow } from '@ionic/react';
import styled from 'styled-components';
import { StyledButton } from 'src/elements/buttons';
import { SnippetSvg } from 'src/elements/DidSnippet';
import { SpaceAvatar } from 'src/components/Space/SpaceCard';
import { CardOverview, CardContent } from 'src/components/cards/common';
import defaultAvatar from 'src/assets/icon/dp.png';
import icon_shield from 'src/assets/icon/shield.svg';
import style from './About.module.scss';

export const HorDOMSpace16 = styled(IonRow)`
  padding: 8px 0px;
`;
export const HorDOMSpace20 = styled(IonRow)`
  padding: 10px 0px;
`;

interface IProps {
  space: any;
  template?: string;
}

const AboutSpace: React.FC<IProps> = ({
  space,
  template = 'default'
}: IProps) => {
  return (
    <CardOverview template={template}>
      <CardContent>
        <IonRow>
          <SpaceAvatar>
            <img src={space.avatar || defaultAvatar} height={79} alt="avatar" />
          </SpaceAvatar>
        </IonRow>
        <HorDOMSpace20 />
        <IonRow>
          <div className={style['name']}>
            <h1>
              {space.name}
              <img src={icon_shield} />
            </h1>
            <h2>
              <SnippetSvg /> DID:iYio2....LzNf &nbsp;&nbsp;&nbsp;by{' '}
              <span>Phantz</span>
            </h2>
          </div>
        </IonRow>
        <HorDOMSpace16 />
        <IonRow>
          <span>
            {space.description ||
              'From the jungle to your hood, Phantz are taking over. One dusty desert day, an elephant noticed something shiny sticking out of the sand-Wayfarer sunglasses. The second the elephant placed them'}
          </span>
        </IonRow>
        <HorDOMSpace16 />
        <IonRow>
          <span className={style['btn-expand']}> + Expand</span>
        </IonRow>
        <HorDOMSpace20 />
        <IonRow>
          <StyledButton
            width={'94px'}
            height={'43px'}
            bgColor={
              'linear-gradient(145.76deg, #995AFF 14.97%, #DC59BF 87.23%)'
            }
            className={'mr-3'}
            onClick={() => {}}
          >
            Follow
          </StyledButton>
          <StyledButton
            width={'94px'}
            height={'43px'}
            bgColor={
              'linear-gradient(252.79deg, rgba(144, 75, 255, 0.084) -20.69%, rgba(190, 52, 160, 0.092) 151.16%);'
            }
            color={'#995AFF'}
            onClick={() => {}}
          >
            Share
          </StyledButton>
        </IonRow>
      </CardContent>
    </CardOverview>
  );
};

export default AboutSpace;
