/**
 * Stage1
 */

import React from 'react';
import { IonImg } from '@ionic/react';
import styled from 'styled-components';

import {
  OnBoardLayoutLeft,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
} from 'src/components/layouts/OnBoardLayout';

import ArrowButton from 'src/components/buttons/ArrowButton';
import { Text16, Text14, Title40, Text12 } from 'src/components/texts';

import whitelogo from '../../../assets/logo/whitelogo.png';

export const LeftContent = styled.div`
  margin: 0px 19.8%;
  display: flex;
  flex-direction: column;
  text-align: center;

  position: absolute;
  left: 0;
  bottom: 90px;
`;

export const NavigateButtons = styled.div`
  width: 114px;
  height: 42px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 41px auto 34px;
`;

export const BackToDashbaord = styled(Text12)`
  cursor: pointer;
`;

export const Logo = styled(IonImg)`
  width: 80px;
  margin: 0px auto 34.09px;
  display: block;
`;

interface Props {
  next: () => void;
  prev: () => void;
  back: () => void;
}

const Stage1: React.FC<Props> = ({ next, prev, back }) => {
  return (
    <React.Fragment>
      <OnBoardLayoutLeft>
        <LeftContent>
          <Logo src={whitelogo}></Logo>
          <Title40>Beginners tutorial</Title40>
          <Text14 className='mt-28px'>
            Learn a little about what Profile is, why you need it, and how it’s
            different to other platforms.
          </Text14>
          <NavigateButtons>
            <ArrowButton size={42} type='whitebtn' disabled onClick={prev} />
            <ArrowButton
              size={42}
              type='whitebtn'
              direction='right'
              onClick={next}
            />
          </NavigateButtons>
          <BackToDashbaord onClick={back}>Quit to dashboard</BackToDashbaord>
        </LeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle>
            What is Profile?
          </OnBoardLayoutRightContentTitle>
          <Text16>It’s free and easy to get set up.</Text16>
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </React.Fragment>
  );
};

export default Stage1;
