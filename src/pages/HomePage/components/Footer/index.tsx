import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import TextInput from 'src/elements/inputs/TextInput';
import { IonCol, IonGrid, IonRow, IonInput, IonTextarea } from '@ionic/react';

import footerBG from 'src/assets/new/footer/footer-bg.svg';
import footerImg from 'src/assets/new/footer/footer-img.svg';
import footerPeople from 'src/assets/new/footer/footer-people.svg';
import arrowtop from 'src/assets/new/arrow-top.svg';
import logo from 'src/assets/new/logo.svg';
import { Twitter, Discord, Medium } from 'src/components/Icons';
import { HomeIntro, HomeTitle } from '../Hero';
import { showNotify } from 'src/utils/notify';

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

  .arrowtop {
    position: absolute;
    top: -128px;
    right: 40px;
    cursor: pointer;

    img {
      width: 76px;
      height: 76px;
    }
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

  .form {
    margin-top: 50px;
  }

  .input {
    background: rgba(237, 242, 247, 0.09);
    backdrop-filter: blur(16px);
    border-radius: 20px;
    height: 65px;
    border: 1px solid #edf2f717;
    font-weight: 700;
    font-size: 18px;
    color: rgba(255, 255, 255);
    padding: 20px 40px !important;
  }

  .textarea {
    background: rgba(237, 242, 247, 0.09);
    backdrop-filter: blur(16px);
    border-radius: 20px;
    max-width: 100%;
    border: 1px solid #edf2f717;
    font-weight: 700;
    font-size: 18px;
    color: rgba(255, 255, 255, 0.6);
    padding: 30px 34px !important;
  }

  .mobile-logo {
    display: none;
  }

  @media only screen and (max-width: 1200px) {
    .logo {
      display: none;
    }
    .mobile-logo {
      display: block;
      margin: 0 auto;
      margin-top: 70px;
      margin-bottom: 0;
    }
    .arrowtop {
      position: absolute;
      top: 30px;
      right: 10px;

      img {
        width: 36px;
        height: 36px;
      }
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
      padding-left: 16px;
      padding-right: 16px;

      p {
        max-width: 400px;
      }
    }
  }

  @media only screen and (max-width: 742px) {
    .form {
      margin-top: 77px;
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
      margin-top: 0;
    }
  }
`;

interface Props {
  refProp: any;
  rootRef: any;
}

const Footer: React.FC<Props> = ({ refProp, rootRef }) => {
  const history = useHistory();
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  const goToTop = () => {
    (rootRef.current as any).scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  const send = async (e: any) => {
    e.preventDefault();
    const userinfo = {
      name: email,
      email: email
    };
    const bodyContact = {
      subject: `[Contact Us]`,
      userinfo: userinfo,
      description: description
    };

    const emailresponse: Response = await fetch(
      `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/support_router/send_email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`
        },
        body: JSON.stringify(bodyContact)
      }
    );

    if (emailresponse.status === 200) {
      showNotify('Email sent successfully', 'success');
      setDescription('');
    } else {
      showNotify('Error sending email. Please try again another time', 'error');
    }
  };

  return (
    <Container bgImg={footerBG} ref={refProp}>
      <img src={logo} alt="logo" className="logo" />

      <img src={footerPeople} alt="footerPeople" className="people" />

      <div className="content">
        <HomeTitle>Get your NFT Collection listed!</HomeTitle>
        <HomeIntro style={{ marginBottom: 0 }}>
          Ready to be discovered and grow your NFT community? <br />
          Submit your collection today!
        </HomeIntro>

        <form noValidate className="form">
          <IonGrid>
            <IonRow className="ion-justify-content-between ion-no-padding">
              <IonCol size="12" size-md>
                <IonInput
                  value={email}
                  className="input"
                  type="email"
                  placeholder="Email"
                  onIonChange={e => setEmail(e.detail.value!)}
                />
              </IonCol>
              <IonCol size="12" size-md>
                <IonInput
                  value={description}
                  className="input"
                  placeholder="Link your NFT Marketplace"
                  onIonChange={e => setDescription(e.detail.value!)}
                />
              </IonCol>
            </IonRow>
            <IonRow className="ion-justify-content-center ion-no-padding">
              <CreateButton type="submit" onClick={send}>
                Send
              </CreateButton>
            </IonRow>
          </IonGrid>
        </form>
      </div>
      <img src={logo} alt="logo" className="mobile-logo" />
      <div className="arrowtop" onClick={goToTop}>
        <img src={arrowtop} alt="arrowtop" />
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
                onClick={() => window.open('https://discord.gg/profile-mtrl')}
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
