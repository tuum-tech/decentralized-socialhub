import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import NavBar from '../NavBar';
import style from './style.module.scss';

export const HomeTitle = styled.p`
  font-family: SF Pro Display;
  font-style: normal;
  font-weight: 600;
  font-size: 60px;
  line-height: 70px;
  color: #ffffff;

  @media only screen and (max-width: 600px) {
    font-size: 50px;
    text-align: center;
  }
`;

export const HomeIntro = styled.p`
  font-family: SF Pro Display;
  font-style: normal;
  font-weight: 300;
  font-size: 22px;
  line-height: 35px;
  letter-spacing: 0.05em;

  color: #ffffff;

  margin-top: 12px;
  margin-bottom: 41px;

  @media only screen and (max-width: 600px) {
    text-align: center;
    font-size: 20px;
    line-height: 30px;
  }
`;

const Content = styled.div`
  margin-top: 295px;
  margin-bottom: 270px;
  max-width: 1180px;
  text-align: center;
`;

interface IProps {
  navItemClicked: (item: string) => void;
}
const Hero: React.FC<IProps> = ({ navItemClicked }) => {
  const history = useHistory();
  return (
    <div className={style['hero-container']}>
      <NavBar navItemClicked={navItemClicked} />

      <div className={style['main-layout']}>
        <Content>
          <HomeTitle>Own Yourself.</HomeTitle>
          <HomeIntro className="intro">
            With a Web3 Decentralized Identity on Profile communicate your
            personal story and build communities how you want with crypto, NFT,
            and blockchain enthusiasts you can trust.
          </HomeIntro>
          {/* <CreateButton onClick={() => history.push('/create-profile')}>
            Create Your Profile
          </CreateButton> */}
        </Content>
      </div>
    </div>
  );
};

export default Hero;
