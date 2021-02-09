import styled from 'styled-components';
import { IonPage, IonImg } from '@ionic/react';

import { Title40, Text18, Text12, Text28, Text16 } from 'src/elements/text';

export const OnBoardLayoutLogo = styled(IonImg)`
  margin: 35.23px 39.95px;
  width: 126.6px;
`;

export const WavingHandImg = styled(IonImg)`
  width: 38px;
`;

export const OnBoardLayout = styled(IonPage)`
  display: flex;
  flex-direction: row;
  font-style: normal;
`;

export const OnBoardLayoutLeft = styled.div`
  background: var(--theme-primary-blue);
  border-radius: 0px;
  width: 40%;
  color: #ffffff;
`;

export const OnBoardLayoutLeftContent = styled.div`
  width: 100%;
  max-width: 70%;
  display: block;
  margin: 132px auto;
`;

export const OnBoardLayoutLeftContentTitle = styled(Title40)`
  margin-top: 18px;
`;

export const OnBoardLayoutLeftContentDescription = styled(Text18)`
  margin-top: 25px;
  margin-bottom: 25px;
`;

export const OnBoardLayoutLeftContentIntro = styled(Text12)`
  margin-bottom: 25px;
`;

export const OnBoardLayoutRight = styled.div`
  background: #fbfbfd;
  border-radius: 0px;
  width: 60%;
`;

export const OnBoardLayoutRightContent = styled.div`
  width: 62%;
  margin: 161px auto;
  color: var(--txt-heading-dark);
`;

export const OnBoardLayoutRightContentTitle = styled(Text28)`
  margin-bottom: 12px;
`;
