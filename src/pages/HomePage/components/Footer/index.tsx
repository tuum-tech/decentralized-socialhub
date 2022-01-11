import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import footerBG from 'src/assets/new/footer-bg.png';
import logo from 'src/assets/new/logo.png';
import {
  Github,
  Reddit,
  Twitter,
  Discord,
  Medium,
  Telegram
} from 'src/components/Icons';

const Container = styled.div<{ bgImg: string }>`
  background-image: url(${props => props.bgImg});
  background-size: cover;
  background-repeat: no-repeat;

  width: 100%;
  padding: 207px 9% 74px;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  img {
    width: 127px;
  }

  .intro {
    margin-top: 30px;
    width: 100%;
    text-align: center;

    font-family: SF Pro Display;
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 33px;
    letter-spacing: 0.05em;
    color: #ffffff;
  }

  .icons {
    width: 100%;
    display: flex;
    justify-content: center;

    .three-icons {
      display: flex;
      margin-top: 28px;
      justify-content: center;
    }

    svg {
      width: 59px;
      height: 59px;
      margin: 27px 20px;
    }
  }

  @media only screen and (max-width: 600px) {
    .icons {
      display: block;

      .three-icons {
        margin-left: auto;
        margin-right: auto;
      }

      svg {
        width: 53px;
        height: 53px;
        margin: 0 17px;
      }
    }
  }
`;

const FooterMenu = styled.div`
  margin-top: 137px;
  width: 100%;
  display: flex;
  justify-content: space-between;

  .items {
    display: flex;
  }

  .item {
    font-family: SF Pro Display;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 30px;

    color: #ffffff;
    margin: 0 15.5px;
    display: block;
    cursor: pointer;
  }

  @media only screen and (max-width: 600px) {
    margin-top: 62px;
    display: block;

    .items {
      justify-content: center;
    }

    .item {
      text-align: center;
      margin-top: 20px;
    }
  }
`;

const Footer = () => {
  const history = useHistory();
  return (
    <Container bgImg={footerBG}>
      <img src={logo} alt="logo" />
      <p className="intro">
        We are on a mission to empower Web3 users and communities to become
        self-sufficient online, returning the power of managing, facilitating,
        and accessing decentralized internet features back to the individual.
      </p>
      <div className="icons">
        <div className="three-icons">
          <Github />
          <Reddit />
          <Twitter />
        </div>
        <div className="three-icons">
          <Medium />
          <Telegram />
          <Discord />
        </div>
      </div>
      <FooterMenu>
        <div className="items">
          <div className="item" onClick={() => {}}>
            Privacy Policy
          </div>
          <div className="item" onClick={() => history.push('/terms-of-use')}>
            Terms
          </div>
          <a href="mailto:contact@tuum.tech" className="item">
            Contact
          </a>
        </div>
        <div className="item">Copyright Profile © 2022</div>
      </FooterMenu>
    </Container>
  );
};

export default Footer;
