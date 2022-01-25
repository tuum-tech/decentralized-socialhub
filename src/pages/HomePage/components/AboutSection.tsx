import React from 'react';
import styled from 'styled-components';

import aboutImg from 'src/assets/new/about.png';

export const MainLayout = styled.div`
  width: 100%;
  padding-left: 9%;
  padding-right: 9%;

  @media only screen and (max-width: 600px) {
    padding-left: 13px;
    padding-right: 13px;
  }
}
`;

const Container = styled.div`
  width: 100%;
  max-width: 1138px;
  margin: 138px auto 50px;

  img {
    width: 100%;
    max-width: 800px;
    display: block;
    margin: 50px auto 0;
  }

  .title {
    font-family: SF Pro Display;
    font-style: normal;
    font-weight: 600;
    font-size: 60px;
    line-height: 65px;

    text-align: center;
    color: #000000;

    margin-bottom: 50px;
  }

  .text {
    font-family: SF Pro Display;
    font-style: normal;
    font-weight: 300;
    font-size: 25px;
    line-height: 40px;

    text-align: center;
    letter-spacing: 0.05em;
    color: #000000;
  }

  @media only screen and (max-width: 600px) {
    .title {
      margin-top: 0px;
      font-size: 40px;
      line-height: 45px;

      margin-bottom: 30px;
    }

    .text {
      font-size: 20px;
      line-height: 30px;

      text-align: center;
      letter-spacing: 0.05em;

      color: #4a5568;
    }
  }
`;

interface Props {
  refProp: any;
}
const AboutSection: React.FC<Props> = ({ refProp }) => {
  return (
    <MainLayout ref={refProp}>
      <Container>
        <p className="title">
          Take ownership of <span style={{ color: '#995AFF' }}>You</span> with a
          Web3 Decentralized Identity on Profile
        </p>
        <p className="text">
          Web3 is the next digital revolution of a decentralized
          blockchain-based internet  empowering you to take back what’s yours.
          Your Identity, and your community.
          <br />
          <br />
          With Profile enabled by Web3, you can tell and verify your personal
          and professional story the way you want with digital spaces and share
          them with whomever you want. Take social ownership back and build your
          online repertoire by joining and building monetization with rewards,
          self-sufficient communities, opening up a whole new decentralized
          world of possibilities.
        </p>

        <img src={aboutImg} alt="about" />
      </Container>
    </MainLayout>
  );
};

export default AboutSection;
