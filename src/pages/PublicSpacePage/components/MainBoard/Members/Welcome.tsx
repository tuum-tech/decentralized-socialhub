import React from 'react';
import { IonRow, IonImg, IonText } from '@ionic/react';
import { StyledButton } from 'src/elements/buttons';
import { CardContent, CardOverview } from 'src/components/cards/common';
import { HorDOMSpace16 } from '../../Highlight/About';
import icon_member from 'src/assets/space/member.svg';
import style from './Welcome.module.scss';

interface IProps {}

const Welcome: React.FC<IProps> = ({}: IProps) => {
  return (
    <CardOverview template={'default'}>
      <CardContent className={style['card-content']}>
        <IonRow>
          <IonImg src={icon_member}></IonImg>
        </IonRow>
        <IonRow>
          <IonText>
            <h3>Members Area</h3>
          </IonText>
        </IonRow>
        <IonRow>
          <IonText>
            <h4>
              Welcome to the Official Phantz community. This area is ony
              accessible for the Phantz holders only
            </h4>
          </IonText>
        </IonRow>
        <HorDOMSpace16 />
        <IonRow>
          <StyledButton
            width={'140px'}
            height={'43px'}
            bgColor={
              'linear-gradient(252.79deg, rgba(144, 75, 255, 0.084) -20.69%, rgba(190, 52, 160, 0.092) 151.16%);'
            }
            color={'#995AFF'}
            onClick={() => {}}
          >
            Connect Wallet
          </StyledButton>
        </IonRow>
      </CardContent>
    </CardOverview>
  );
};

export default Welcome;
