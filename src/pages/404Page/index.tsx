import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutRight,
  WavingHandImg
} from 'src/components/layouts/OnBoardLayout';
import { ThemeButton } from 'src/elements/buttons';
import { Title40, Text12, Text18 } from 'src/elements/texts';
import weird from 'src/assets/icon/weird.png';

import style from './style.module.scss';

const DefaultPage = () => {
  const history = useHistory();
  return (
    <OnBoardLayout className={style['create-profile']}>
      <OnBoardLayoutLeft>
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={weird} />
          <Title40 className="mt-18px">404 Not found</Title40>
          <Text18 className="mt-25px">
            We can't find the right page for you
          </Text18>
          <Text12 className="mt-86px mb-0">Already have a profile?</Text12>
          <ThemeButton
            onClick={() => history.push('/sign-did')}
            text="Sign in Here"
            style={{ width: '200px' }}
          />
          <Text12 className="mt-25px mb-0">Or create new profile here</Text12>

          <ThemeButton
            style={{ width: '200px' }}
            onClick={() => history.push('/create-profile')}
            text="Create new Profile"
          />
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight />
    </OnBoardLayout>
  );
};

export default DefaultPage;
