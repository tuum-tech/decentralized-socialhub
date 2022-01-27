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

    p {
      text-align: center;
    }
  }

  .icons {
    display: flex;
    justify-content: center;
    svg {
      cursor: pointer;
    }

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
    .logo {
      display: none;
    }
    .icons {
      display: block;

      .three-icons {
        margin-top: 15px;
        margin-bottom: 15px;

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
  @media only screen and (max-width: 600px) {
    margin-top: 150px;

    .people {
      width: 320px;
      left: calc(50% - 160px);
    }

    .content {
      margin-top: 100px;

      p {
        max-width: 400px;
      }
    }
  }
`;

const FooterMenu = styled.div`
  margin-top: 67px;
  width: 100%;

  background-image: url(${footerImg});
  min-height: 191px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

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
    margin-top: 30px;
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
        <HomeTitle>Own Yourself with a Web3 Profile</HomeTitle>
        <HomeIntro style={{ marginBottom: 0 }}>
          Once your digital footprint is created, the doors are opened to
          countless communities and ownership opportunities.
        </HomeIntro>
        <CreateButton onClick={() => history.push('/create-profile')}>
          Create Your Profile
        </CreateButton>
      </div>

      <FooterMenu>
        <div className="footerMenucontent">
          <div className="items">
            <div className="item" onClick={() => history.push('/terms-of-use')}>
              Privacy Policy & Terms
            </div>
            <a href="mailto:contact@tuum.tech" className="item">
              Contact
            </a>
          </div>

          <div className="icons">
            <div className="three-icons">
              <Twitter
                onClick={() => window.open('https://twitter.com/tryProfile')}
              />
              <Medium
                onClick={() => window.open('https://medium.com/web3profile')}
              />
              <Discord
                onClick={() => window.open('https://discord.gg/PgtTKBBQ')}
              />
            </div>
            {/* <div className="three-icons">
              <Telegram onClick={() => {}} />
              <Github
                onClick={() => window.open('https://github.com/tuum-tech')}
              />
              <Reddit onClick={() => {}} />
            </div> */}
          </div>
          <div className="item">Tuum Technologies © 2022</div>
        </div>
      </FooterMenu>
    </Container>
  );
};

export default Footer;
