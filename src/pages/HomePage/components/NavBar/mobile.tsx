import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const MobileContainer = styled.div`
  display: none;
  background: #04032b;

  padding: 71px 31px;

  justify-content: flex-start;
  flex-direction: column;

  .navItem {
    font-family: SF Pro Display;
    font-style: normal;
    font-weight: 600;
    font-size: 30px;
    line-height: 30px;

    margin: 12px 0;
    cursor: pointer;
  }

  .gradient {
    background: linear-gradient(145.76deg, #995aff 14.97%, #dc59bf 87.23%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .white {
    color: white;
  }

  @media screen and (max-width: 1200px) {
    display: flex;
  }
`;

interface MobileProps {
  navItemClicked: (item: string) => void;
}
const MobileNavContent: React.FC<MobileProps> = ({ navItemClicked }) => {
  const history = useHistory();
  return (
    <MobileContainer>
      <div className="navItem gradient" onClick={() => navItemClicked('About')}>
        About
      </div>
      <div
        className="navItem gradient"
        onClick={() => navItemClicked('Community')}
      >
        Community
      </div>
      <div
        className="navItem gradient"
        onClick={() => navItemClicked('Utility')}
      >
        Utility
      </div>
      <div
        className="navItem gradient"
        onClick={() => navItemClicked('Ownership')}
      >
        Ownership
      </div>
      <div
        className="navItem gradient"
        onClick={() => navItemClicked('Connect')}
      >
        Connect
      </div>
      <div className="navItem white" onClick={() => history.push('/sign-did')}>
        Login
      </div>
      <div
        className="navItem white"
        onClick={() => history.push('/create-profile')}
      >
        Sign Up
      </div>
    </MobileContainer>
  );
};

export default MobileNavContent;
