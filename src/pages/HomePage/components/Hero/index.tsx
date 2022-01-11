import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import NavBar from '../NavBar';
import style from './style.module.scss';

const Content = styled.div`
  margin-top: 295px;
  margin-bottom: 270px;
  max-width: 560px;

  .title {
    font-family: SF Pro Display;
    font-style: normal;
    font-weight: 600;
    font-size: 60px;
    line-height: 70px;
    color: #ffffff;
  }

  .intro {
    font-family: SF Pro Display;
    font-style: normal;
    font-weight: 300;
    font-size: 22px;
    line-height: 35px;
    letter-spacing: 0.05em;

    color: #ffffff;

    margin-top: 12px;
    margin-bottom: 41px;
  }

  @media only screen and (max-width: 600px) {
    .title {
      font-size: 50px;
      text-align: center;
    }
    .intro {
      text-align: center;
      font-size: 20px;
      line-height: 30px;
    }
  }
`;

const CreateButton = styled.button`
  width: 280px;
  height: 54.17px;

  background: linear-gradient(178.87deg, #995aff -13.48%, #dc59bf 92.25%);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15),
    0px 10px 25px rgba(177, 40, 255, 0.25);
  border-radius: 10px;

  font-family: SF Pro Display;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 25px;
  text-align: center;
  color: #ffffff;

  text-decoration: none;
  line-height: 54.17px;

  transition: all 0.2s Ease-out;
  background-position: 0% 50%;
  background-size: 100%;

  &:hover {
    transition: all 0.2s Ease-out;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15),
      0px 10px 50px rgba(177, 40, 255, 0.3);
    background-size: 200%;
    background-position: bottom 400%;
    transform: scale(1.05);
  }

  &:focused {
    transition: all 0.5s Ease-out;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15),
      0px 10px 50px rgba(177, 40, 255, 0.25);
    background-color: rgba(115, 67, 192, 1);
  }

  @media only screen and (max-width: 600px) {
    margin-left: auto;
    margin-right: auto;
    display: block;
  }
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
          <p className="title">Own Yourself.</p>
          <p className="intro">
            With a Web3 Decentralized Identity on Profile communicate your
            personal story and build communities how you want with crypto, NFT,
            and blockchain enthusiasts you can trust.
          </p>
          <CreateButton onClick={() => history.push('/create-profile')}>
            Create Your Profile
          </CreateButton>
        </Content>
      </div>
    </div>
  );
};

export default Hero;
