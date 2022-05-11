import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import style from './style.module.scss';

import { SectionSubTitle, SectionText } from '../../index';
import monetizeBg from 'src/assets/new/monetize-bg.svg';
import monetizeBgmobile from 'src/assets/new/mobile.svg';
export const ContentContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  display: flex;
  justify-content: space-between;
  align-items: center;

  flex-direction: row-reverse;

  .item {
    width: 47%;
    margin-top: 50px;

    .subtitle {
      color: #000000;
      margin-bottom: 10px;
      max-width: 430px;
    }

    img {
      width: 100%;
      max-width: 544px;
      margin: 0 auto;
      display: block;
    }
  }

  @media only screen and (max-width: 600px) {
    display: block;

    .item {
      width: 100%;
      max-width: 100%;

      .subtitle {
        max-width: 100%;
        width: 100%;
        text-align: center;
      }
    }
  }
`;

const MonetizeContent = styled(ContentContainer)`
  flex-direction: row;
  position: relative;
  .item {
    .subtitle {
      color: white;
    }
    p {
      color: white;
    }
  }

  @media only screen and (max-width: 600px) {
    display: block;
    margin-top: 430px;
    padding-bottom: 47px;
  }
`;

const CommunitySection = () => {
  const hasWindow = typeof window !== 'undefined';

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [hasWindow]);

  console.log(12312, windowDimensions);

  return (
    <div
      className={style['monetize']}
      style={{
        backgroundImage:
          windowDimensions?.width && windowDimensions.width > 600
            ? `url(${monetizeBg})`
            : `url(${monetizeBgmobile})`
      }}
    >
      <MonetizeContent>
        <div className="item"></div>
        <div className="item">
          <SectionSubTitle className="subtitle">
            Monetize via rewards- based incentives
          </SectionSubTitle>
          <SectionText className="text">
            Earn rewards simply by participating and engaging with communities
            while helping contribute to the ecosystem. Become your own financial
            vehicle with Profile.
          </SectionText>
        </div>
      </MonetizeContent>
    </div>
  );
};

export default CommunitySection;
