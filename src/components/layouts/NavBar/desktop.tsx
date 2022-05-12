import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import logo from 'src/assets/new/logo.svg';

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

  a,
  .natItem {
    font-family: SF Pro Display;
    font-style: normal;
    font-weight: 600;
    font-size: 19px;
    line-height: 35px;
    letter-spacing: 0.05em;
    color: #ffffff;

    display: block;
    margin: 0 16.5px;
    cursor: pointer;
  }

  img {
    height: 37px;
  }

  @media screen and (max-width: 1200px) {
    padding: 51px 23px;
    justify-content: flex-start;

    .center-content,
    .right-content {
      display: none;
    }

    img {
      height: 26px;
    }
  }
`;

const SignUpButton = styled.button`
  height: 54px;
  width: 157px;
  line-height: 54px;

  margin-left: 16.5px;

  background: linear-gradient(145.76deg, #995aff 14.97%, #dc59bf 87.23%);
  border-radius: 10px;

  font-family: SF Pro Display;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  color: #ffffff;
`;

interface DesktopProps {
  navItemClicked: (item: string) => void;
}
const DesktopNavContent: React.FC<DesktopProps> = ({ navItemClicked }) => {
  const history = useHistory();

  return (
    <DesktopContainer>
      <img src={logo} alt="log" />
      <div className="center-content">
        <div className="natItem" onClick={() => navItemClicked('About')}>
          About
        </div>
        <div className="natItem" onClick={() => navItemClicked('Community')}>
          Community
        </div>
        <div className="natItem" onClick={() => navItemClicked('Utility')}>
          Utility
        </div>
        <div className="natItem" onClick={() => navItemClicked('Ownership')}>
          Ownership
        </div>
        <div className="natItem" onClick={() => navItemClicked('Connect')}>
          Connect
        </div>
      </div>
      <div className="right-content">
        <div className="natItem" onClick={() => history.push('/sign-in')}>
          Log In
        </div>
        <SignUpButton onClick={() => history.push('/create-profile')}>
          Sign Up
        </SignUpButton>
      </div>
    </DesktopContainer>
  );
};

export default DesktopNavContent;
