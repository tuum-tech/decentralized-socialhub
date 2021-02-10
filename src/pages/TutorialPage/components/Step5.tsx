/**
 * Stage1
 */

import React from 'react';

import {
  OnBoardLayoutLeft,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
} from 'src/components/layouts/OnBoardLayout';

import ArrowButton from 'src/elements/buttons/ArrowButton';
import { Text16, Text14, Title40, Text12 } from 'src/elements/texts';
import { LeftContent, NavigateButtons, BackToDashbaord } from './Step2';

interface Props {
  next: () => void;
  prev: () => void;
  back: () => void;
}

const Stage1: React.FC<Props> = ({ next, prev, back }) => {
  return (
    <React.Fragment>
      <OnBoardLayoutLeft style={{ backgroundColor: '#FF9840' }}>
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
            Dashboard
          </OnBoardLayoutRightContentTitle>
          <Text16>It’s free and easy to get set up.</Text16>
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </React.Fragment>
  );
};

export default Stage1;
