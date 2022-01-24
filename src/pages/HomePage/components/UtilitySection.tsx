import React from 'react';
import styled from 'styled-components';

import authentically from 'src/assets/new/utility/1.png';
import password from 'src/assets/new/utility/2.png';
import nft from 'src/assets/new/utility/3.png';
import { SectionTitle, SectionIntro, SectionText } from '../index';
import { MainLayout } from '../components/AboutSection';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 75px auto 0;

  .content {
    margin: 30px 0 0 0;
    width: 100%;
    display: flex;
    justify-content: space-between;

    .item {
      margin-top: 30px;
      max-width: 317px;
      width: 30%;

      img {
        margin-bottom: 10px;
      }
    }
  }

  .width-68 {
    width: 68px;
  }

  @media only screen and (max-width: 600px) {
    .width-68 {
      width: 58px;
    }

    .content {
      display: block;

      .item {
        width: 100%;
        max-width: 100%;

        img {
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
      }
    }
  }
`;

interface Props {
  refProp: any;
}
const UtilitySection: React.FC<Props> = ({ refProp }) => {
  return (
    <MainLayout ref={refProp}>
      <Container>
        <SectionTitle>Utility</SectionTitle>
        <div className="content">
          <div className="item">
            <img src={authentically} className="width-68" alt="authentically" />
            <SectionIntro>Be authentically you, all in one place</SectionIntro>
            <SectionText>
              You are more than just a collection of social profiles siloed on
              the web… Reflect who you are through your assets, identity, and
              professional CV into one Profile
            </SectionText>
          </div>
          <div className="item">
            <img src={password} className="width-68" alt="authentically" />
            <SectionIntro>
              Eliminate endless usernames and passwords
            </SectionIntro>
            <SectionText>
              Replace passwords with one self-created Decentralized ID (DID),
              that serves as the master key to access various online platforms.
            </SectionText>
          </div>
          <div className="item">
            <img src={nft} className="width-68" alt="authentically" />
            <SectionIntro>Do more with Your NFTs</SectionIntro>
            <SectionText>
              Enter upcoming exclusive NFT community spaces on Profile, so
              you'll be able to become a part of your favorite digital
              communities and share ownership of NFTs.
            </SectionText>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
};

export default UtilitySection;
