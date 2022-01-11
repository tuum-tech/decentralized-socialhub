import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import web3 from 'src/assets/new/web.png';
import { MainLayout } from '../components/AboutSection';

const Content = styled.div`
  margin-top: 257px;
  margin-bottom: 170px;

  background: #6937bc;
  box-shadow: 0px 20px 50px 10px rgba(193, 203, 244, 0.2);
  border-radius: 31px;

  position: relative;
  padding: 54px 4%;

  img {
    position: absolute;
    width: 591px;
    bottom: 0;
    right: -200px;
  }

  .title {
    font-family: SF Pro Display;
    font-style: normal;
    font-weight: 600;
    font-size: 60px;
    line-height: 65px;
    text-align: center;

    background: -webkit-linear-gradient(#995aff, #dc59bf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .text {
    font-family: SF Pro Display;
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 30px;
    text-align: center;
    color: #ffffff;

    margin-top: 37px;
    max-width: 620px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
  }

  @media only screen and (max-width: 600px) {
    padding-top: 200px;
    margin-top: 157px;
    margin-bottom: 70px;

    img {
      bottom: 250px;
      right: -150px;
    }

    .title {
      font-size: 40px;
      line-height: 45px;
    }
    .text {
      font-size: 15px;
      line-height: 24px;
    }
  }
`;

const CreateButton = styled.button`
  width: 280px;
  height: 54.17px;
  margin: 37px auto 0;
  display: block;

  background: #dc59bf;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;

  font-family: SF Pro Display;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 25px;
  text-align: center;
  color: #ffffff;

  @media only screen and (max-width: 600px) {
    height: 50px;

    font-size: 13.2075px;
    line-height: 21px;
  }
`;

interface Props {
  refProp: any;
}
const ConnectSection: React.FC<Props> = ({ refProp }) => {
  const history = useHistory();

  return (
    <MainLayout ref={refProp}>
      <Content>
        <p className="title">Own Yourself with a Web3 Profile</p>
        <p className="text">
          Once your digital footprint is created, the doors are opened to
          countless communities and ownership opportunities.{' '}
        </p>

        <img src={web3} alt="web3" />
        <CreateButton onClick={() => history.push('/create-profile')}>
          Create Your Profile
        </CreateButton>
      </Content>
    </MainLayout>
  );
};

export default ConnectSection;
