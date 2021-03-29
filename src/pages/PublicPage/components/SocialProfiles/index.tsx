import React from 'react';
import {
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCard,
  IonGrid,
  IonCol,
  IonRow
} from '@ionic/react';
import styled from 'styled-components';

import widgetstyle from 'src/components/cards/WidgetCards.module.scss';
import style from './style.module.scss';

import facebook from '../../../../assets/icon/Facebook.svg';
import twitter from '../../../../assets/icon/Twitter.svg';
import google from '../../../../assets/icon/Google.svg';
import linkedin from '../../../../assets/icon/Linkedin.svg';

export const CardHeaderContent = styled(IonCardHeader)`
  padding: 20px 20px 0px;
`;

export const CardContentContainer = styled(IonCardContent)`
  padding: 5px 5px 20px 5px;
`;

const ImgTag = styled.img`
  width: 18px;
  height: 18px;
`;

interface Props {
  sProfile: string[];
}

const SocialProfiles: React.FC<Props> = ({ sProfile }) => {
  const renderComponents = () => {
    const socialData = [
      {
        name: 'facebook',
        img: facebook
      },
      {
        name: 'twitter',
        img: twitter
      },
      {
        name: 'google',
        img: google
      },
      {
        name: 'linkedin',
        img: linkedin
      }
    ];

    const res = [];
    for (let i = 0; i < socialData.length; i++) {
      if (sProfile.includes(socialData[i].name)) {
        res.push(
          <IonCol
            size="6"
            className={style['ion-no-padding-bottom']}
            key={socialData[i].name}
          >
            <IonGrid className={style['ion-no-padding-bottom']}>
              <IonRow className={style['ion-no-padding-bottom']}>
                <IonCol size="auto" className={style['ion-no-padding-bottom']}>
                  <ImgTag src={socialData[i].img} alt="linkedin icon" />
                </IonCol>
                <IonCol size="*" className={style['ion-no-padding-bottom']}>
                  {socialData[i].name}
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCol>
        );
      }
    }
    return res;
  };
  return (
    <IonCard className={widgetstyle['overview']}>
      <CardHeaderContent>
        <IonCardTitle>Social Profiles</IonCardTitle>
      </CardHeaderContent>

      <CardContentContainer>
        <IonGrid>
          <IonRow>{renderComponents()}</IonRow>
        </IonGrid>
      </CardContentContainer>
    </IonCard>
  );
};

export default SocialProfiles;
