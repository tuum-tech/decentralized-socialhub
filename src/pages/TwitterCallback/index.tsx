/**
 * Page
 */
import React, { memo, useEffect, useState } from 'react';
 import { connect } from 'react-redux';
 import { Redirect, RouteComponentProps, useParams } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injector from 'src/baseplate/injectorWrap';
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors';
import { incrementAction, getSimpleAjax } from './actions';

import style from './style.module.scss';
import { NameSpace } from './constants';
import reducer from './reducer';
import saga from './saga';
import { InferMappedProps, SubState, TokenResponse } from './types';

import { UserService } from 'src/services/user.service';
import { requestTwitterToken } from './fetchapi';



const FacebookCallback : React.FC<RouteComponentProps> = (props) => {
  /** 
   * Direct method implementation without SAGA 
   * This was to show you dont need to put everything to global state 
   * incoming from Server API calls. Maintain a local state.
  */

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const getToken = async (code: string, state: string): Promise<TokenResponse> => {
    return await requestTwitterToken(code, state) as TokenResponse;
  }

  let code: string = new URLSearchParams(props.location.search).get("oauth_token") || "";
  let state: string = new URLSearchParams(props.location.search).get("oauth_verifier") || "";

  useEffect(() => {
    (async () => {
      if (code != "" && state != "") {
        let t = await getToken(code, state);
        let items: string[] = atob(t.data.request_token).split(";")
        console.log(items)

        await UserService.SignInWithTwitter(items[1], items[0], `${code}[-]${state}`)

        setIsLoggedIn(true);
      }
    })();
  });

  const getRedirect = () => {
    if (isLoggedIn) {
      return (<Redirect to={{ pathname: "/profile"}} />)
    } else
      return <div></div>
  }
  return getRedirect();
};

/** @returns {object} Contains state props from selectors */
export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  counter: makeSelectCounter(),
  msg: makeSelectAjaxMsg()
});

/** @returns {object} Contains dispatchable props */
export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: { // eProps - Emitter proptypes thats binds to dispatch
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
const withInjectedMode = injector(
  FacebookCallback,
  {
    key: NameSpace,
    reducer,
    saga
  }
);

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(withInjectedMode) as React.ComponentType<InferMappedProps>;

// export default Tab1;
