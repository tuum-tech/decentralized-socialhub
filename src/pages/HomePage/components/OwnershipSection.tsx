import React from 'react';
import styled from 'styled-components';

import ownership from 'src/assets/new/ownership.svg';
import { SectionTitle, SectionIntro, SectionText } from '../index';

const Container = styled.div`
  width: 100%;
  padding-left: 9%;
  padding-right: 9%;
  margin-top: 130px;

  @media only screen and (max-width: 600px) {
    padding-left: 13px;
    padding-right: 13px;
    margin-top: 55px;
  }
`;

const OwnershipContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .item {
    width: 47%;
    margin-top: 50px;

    .right-content {
      display: flex;
      flex-direction: column;
      min-height: 400px;
      justify-content: space-between;
    }

    img {
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

      .text {
        margin-top: 30px;
        margin-bottom: 50px;
      }
    }
  }
`;

interface Props {
  refProp: any;
}
const OwnershipSection: React.FC<Props> = ({ refProp }) => {
  return (
    <Container ref={refProp}>
      <SectionTitle>Ownership</SectionTitle>
      <OwnershipContent>
        <div className="item">
          <img src={ownership} width="100%" alt="ownership" />
        </div>

        <div className="item">
          <div className="right-content ">
            <div>
              <SectionIntro>Finally own Your own data</SectionIntro>
              <SectionText className="text">
                For the first time, you can now determine how and where your
                data is stored, without a middle man.
              </SectionText>
            </div>
            <div>
              <SectionIntro>
                Get security as it should be, blockchain verified
              </SectionIntro>
              <SectionText className="text">
                Profile does not store user data, and our core identity code is
                open source. We've made it our mission to be fully transparent
                and provide a secure product for everyone.
              </SectionText>
            </div>
            <div>
              <SectionIntro>So you can rest assured</SectionIntro>
              <SectionText className="text">
                Empower yourself by becoming the owner of the decentralized
                communities you build and grow from the ground up, absent of any
                censorship so you can rest assured.
              </SectionText>
            </div>
          </div>
        </div>
      </OwnershipContent>
    </Container>
  );
};

export default OwnershipSection;
