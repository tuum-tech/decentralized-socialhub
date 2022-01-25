import { connect } from 'react-redux';
import { compose } from 'redux';
import { useHistory } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import injector from 'src/baseplate/injectorWrap';
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors';
import { incrementAction, getSimpleAjax } from './actions';
import React, { memo } from 'react';
import style from './style.module.scss';
import { NameSpace } from './constants';
import reducer from './reducer';
import saga from './saga';
import { InferMappedProps, SubState } from './types';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
  WavingHandImg
} from 'src/components/layouts/OnBoardLayout';
import { ButtonLink, ArrowButton, ThemeButton } from 'src/elements/buttons';
import { Title40, Text18, Text12, Text28 } from 'src/elements/texts';

import whitelogo from 'src/assets/logo/whitetextlogo.png';
import weird from 'src/assets/icon/weird.png';

const ForgotPasswordPage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const history = useHistory();
  return (
    <OnBoardLayout className={style['associated-profile']}>
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={weird} />
          <Title40 className="mt-18px">Forgot password?</Title40>
          <Text18 className="mt-25px">
            There is no way we can help. This is a decentralized platform and
            you need to be responsible for your password and security words.
          </Text18>
          <Text18 className="mt-25px">
            You have three options, go see if you can find your profile password
            and go back and enter the password, or sign in to profile as normal
            (if you know your main security passwords, or create a new profile.
          </Text18>
          <Text12 className="my-25px">Why has this happened? Help</Text12>
          <ButtonLink width={26} to="/unlock-user">
            <ArrowButton />
          </ButtonLink>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle>
            Sign in
          </OnBoardLayoutRightContentTitle>
          <ThemeButton
            text="Sign in to profile"
            onClick={() => {
              window.localStorage.clear();
              history.push({
                pathname: '/sign-did'
              });
            }}
          />

          <OnBoardLayoutRightContentTitle style={{ marginTop: '96px' }}>
            Create new profile
          </OnBoardLayoutRightContentTitle>
          <ThemeButton
            text="Create new profile"
            onClick={() => {
              history.push({
                pathname: '/create-profile'
              });
            }}
          />
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

/** @returns {object} Contains state props from selectors */
export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  counter: makeSelectCounter(),
  msg: makeSelectAjaxMsg()
});

/** @returns {object} Contains dispatchable props */
export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      // eProps - Emitter proptypes thats binds to dispatch
      /** dispatch for counter to increment */
      onCount: (count: { counter: number }) => dispatch(incrementAction(count)),
      onSimpleAjax: () => dispatch(getSimpleAjax())
    }
  };
}

/**
 * Injects prop and saga bindings done via
 * useInjectReducer & useInjectSaga
 */
const withInjectedMode = injector(ForgotPasswordPage, {
  key: NameSpace,
  reducer,
  saga
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo
)(withInjectedMode) as React.ComponentType<InferMappedProps>;

// export default Tab1;
