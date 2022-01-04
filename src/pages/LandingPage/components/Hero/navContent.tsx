import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import logo from 'src/assets/new/logo.png';
import style from './style.module.scss';

const DesktopContainer = styled.nav`
  width: 100%;
  height: 50px;
  padding: 51px 71px;
  background: transparent;

  display: flex;
  align-items: center;
  justify-content: space-around;

  .center-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .right-content {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  a {
    font-family: SF Pro Display;
    font-style: normal;
    font-weight: 600;
    font-size: 19px;
    line-height: 35px;
    letter-spacing: 0.05em;
    color: #ffffff;

    display: block;
    margin: 0 16.5px;
  }

  @media screen and (max-width: 1200px) {
    padding: 51px 31px;
    justify-content: flex-start;

    .center-content,
    .right-content {
      display: none;
    }
  }
`;

const SignUpButton = styled.div`
  height: 71px;
  width: 157px;
  line-height: 71px;

  margin-left: 16.5px;

  background: #995aff;
  border-radius: 10px;

  font-family: SF Pro Display;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  color: #ffffff;
`;

export const DesktopNavContent = () => {
  return (
    <DesktopContainer>
      <img src={logo} alt="log" />
      <div className="center-content">
        <a href="/">About</a>
        <a href="/">Community</a>
        <a href="/">Utility</a>
        <a href="/">Ownership</a>
        <a href="/">Connect</a>
      </div>
      <div className="right-content">
        <a href="/">Log In</a>
        <SignUpButton>Sign Up</SignUpButton>
      </div>
    </DesktopContainer>
  );
};

const MobileContainer = styled.div`
  display: none;

  padding: 71px 31px;

  justify-content: flex-start;
  flex-direction: column;

  a {
  }

  @media screen and (max-width: 1200px) {
    display: flex;
  }
`;

export const MobileNavContent = () => {
  return (
    <MobileContainer className={style['mobile-nav']}>
      <a href="/" className={style['pink']}>
        About
      </a>
      <a href="/" className={style['pink']}>
        Community
      </a>
      <a href="/" className={style['pink']}>
        Utility
      </a>
      <a href="/" className={style['pink']}>
        Ownership
      </a>
      <a href="/" className={style['pink']}>
        Connect
      </a>
      <a href="/" className={style['pink']}>
        Login
      </a>
      <a href="/">Sign Up</a>
    </MobileContainer>
  );
};
