import React, { useMemo } from 'react';
import styled from 'styled-components';
import Lottie from 'react-lottie';

import NavBar from 'src/components/layouts/NavBar';
import headerBg from 'src/assets/new/header-bg.svg';
import animationData from 'src/assets/new/animation/desktop/data';
import animationMobileData from 'src/assets/new/animation/mobile/data';

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

const HeroContainer = styled.div`
  width: 100%;
  background-image: url(${headerBg});
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  overflow-x: clip;

  .header-Image {
    min-width: 1400px;
    width: 100%;
    height: auto;
    margin: 0 auto;
    display: block;
  }

  .image-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  @media only screen and (max-width: 1400px) {
    .header-Image {
      min-width: 900px;
    }
  }
`;

const Content = styled.div`
  max-width: 1180px;
  margin: 150px auto 100px;
  text-align: center;

  width: 100%;
  padding-left: 13%;
  padding-right: 13%;

  @media only screen and (max-width: 600px) {
    padding-left: 13px;
    padding-right: 13px;
  }
`;

interface IProps {
  navItemClicked: (item: string) => void;
  windowDimensions: {
    width: number | null;
    height: number | null;
  };
}

const Hero: React.FC<IProps> = ({ navItemClicked, windowDimensions }) => {
  const defaultOptions = useMemo(() => {
    if (windowDimensions?.width && windowDimensions.width > 600) {
      return {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      };
    }

    return {
      loop: true,
      autoplay: true,
      animationData: animationMobileData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };
  }, [windowDimensions]);
  return (
    <HeroContainer>
      <NavBar navItemClicked={navItemClicked} />

      <Content>
        <HomeTitle>Own Yourself.</HomeTitle>
        <HomeIntro className="intro">
          With a Web3 Decentralized Identity on Profile communicate your
          personal story and build communities how you want with crypto, NFT,
          and blockchain enthusiasts you can trust.
        </HomeIntro>
      </Content>
      <Lottie
        options={defaultOptions}
        isStopped={false}
        isPaused={false}
        style={{
          marginTop:
            windowDimensions?.width && windowDimensions.width > 600
              ? -350
              : -480
        }}
      />
    </HeroContainer>
  );
};

export default Hero;
