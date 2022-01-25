import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import footerBG from 'src/assets/new/footer/footer-bg.png';
import footerImg from 'src/assets/new/footer/footer-img.png';
import footerPeople from 'src/assets/new/footer/footer-people.png';
import logo from 'src/assets/new/logo.png';
import {
  Github,
  Reddit,
  Twitter,
  Discord,
  Medium,
  Telegram
} from 'src/components/Icons';
import { HomeIntro, HomeTitle } from '../Hero';

const CreateButton = styled.button`
  background: linear-gradient(204.71deg, #9a5bff 15.76%, #dd5ac0 136.38%);
  border-radius: 8px;
  width: 200px;
  height: 53px;
  margin-top: 35px;

  font-style: normal;
  font-weight: 600;
  font-size: 15.6825px;
  line-height: 25px;
  color: #ffffff;
`;

const Container = styled.div<{ bgImg: string }>`
  margin-top: 300px;
  background-image: url(${props => props.bgImg});
  background-size: cover;
  background-repeat: no-repeat;

  width: 100%;
  position: relative;

  .logo {
    position: absolute;
    left: 50px;
    top: 50px;
  }

  .people {
    position: absolute;
    width: 480px;
    top: -150px;
    left: calc(50% - 240px);
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    margin: 270px auto 0;
    width: 100%;
    max-width: 905px;
  }

  .footerImg {
    position: absolute;
    bottom: 0;
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
    display: flex;
    justify-content: center;

    .three-icons {
      display: flex;
      justify-content: center;
    }

    svg {
      width: 59px;
      height: 59px;
      margin: 27px 20px;
    }
  }

  @media only screen and (max-width: 1200px) {
    .icons {
      display: block;

      .three-icons {
        margin-top: 5px;
        margin-bottom: 5px;

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

  background-image: url(${footerImg});
  min-height: 191px;
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: 100% auto;

  .footerMenucontent {
    padding: 20px;
    width: 100%;
    max-width: 1190px;
    margin: 0 auto;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  svg {
    margin: 0 25px;
  }

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

  @media only screen and (max-width: 790px) {
    margin-top: 62px;
    display: block;

    .footerMenucontent {
      display: block;
    }

    .items {
      justify-content: center;
    }

    .item {
      text-align: center;
      margin-top: 20px;
    }
  }
`;

interface Props {
  refProp: any;
}

const Footer: React.FC<Props> = ({ refProp }) => {
  const history = useHistory();
  return (
    <Container bgImg={footerBG} ref={refProp}>
      <img src={logo} alt="logo" className="logo" />
      <img src={footerPeople} alt="footerPeople" className="people" />

      <div className="content">
        <HomeTitle>Own Yourself with Profile</HomeTitle>
        <HomeIntro>
          Explore the universe of countless community and ownership
          opportunities
        </HomeIntro>
        <CreateButton onClick={() => history.push('/create-profile')}>
          Create Profile
        </CreateButton>
      </div>

      <FooterMenu>
        <div className="footerMenucontent">
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

          <div className="item">Copyright Profile © 2022</div>
        </div>
      </FooterMenu>
    </Container>
  );
};

export default Footer;
