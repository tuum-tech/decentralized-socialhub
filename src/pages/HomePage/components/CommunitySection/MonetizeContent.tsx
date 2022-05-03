import React from 'react';
import styled from 'styled-components';

import style from './style.module.scss';

import { SectionSubTitle, SectionText } from '../../index';
import monetizeBg from 'src/assets/new/monetize-bg.jpg';

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

  .item {
    .subtitle {
      color: white;
    }
    p {
      color: white;
    }
  }
`;

const CommunitySection = () => {
  return (
    <div
      className={style['monetize']}
      style={{ backgroundImage: `url(${monetizeBg})` }}
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
