/**
 * Stage1
 */

import React from 'react';
import styled from 'styled-components';

import {
  OnBoardLayoutLeft,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
} from 'src/components/layouts/OnBoardLayout';

import ArrowButton from 'src/elements/buttons/ArrowButton';
import { Text16, Text14, Title40, Text12 } from 'src/elements/texts';

export const LeftContent = styled.div`
  width: 114px;
  margin: 41px auto 34px;
  position: absolute;
  left: calc(50% - 57px);
  bottom: 90px;
`;

export const NavigateButtons = styled.div`
  width: 114px;
  height: 42px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 34px;
`;

export const BackToDashbaord = styled(Text12)`
  cursor: pointer;
  text-align: center;
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
          <NavigateButtons>
            <ArrowButton size={42} type='whitebtn' onClick={prev} />
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
            So why do I need a Profile?
          </OnBoardLayoutRightContentTitle>
          <Text16>It’s free and easy to get set up.</Text16>
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </React.Fragment>
  );
};

export default Stage1;
