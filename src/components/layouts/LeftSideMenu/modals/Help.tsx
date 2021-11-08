import React, { useState } from 'react';
import { IonModal } from '@ionic/react';
import styled from 'styled-components';

import contractIcon from 'src/assets/support/contact.png';
import helpIcon from 'src/assets/support/help.png';
import reportIcon from 'src/assets/support/report.png';
import supportIcon from 'src/assets/support/support.png';
import CloseButton from './CloseButton';

interface Props {
  session: ISessionItem;
}

export const HelpModal = styled(IonModal)`
  --border-radius: 16px;
  --width: 513px;
  --height: 325px;

  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

const Container = styled.div`
  padding: 20px 28px;
  .header {
    font-style: normal;
    font-weight: 600;
    font-size: 28px;
    line-height: 136.02%;
    color: #27272e;

    margin-bottom: 26px;
  }

  .item {
    display: flex;
    align-items: center;

    .title {
      font-style: normal;
      font-weight: bold;
      font-size: 16px;
      line-height: 162.02%;
      color: #27272e;
      flex: none;
      order: 0;
      flex-grow: 0;
      margin: 0px 0px;
    }

    .img {
      margin-right: 20px;
      width: 28px;
      img {
        display: block;
        margin: 0 auto;
      }
    }

    .intro {
      font-style: normal;
      font-weight: normal;
      font-size: 13px;
      line-height: 162.02%;
      font-feature-settings: 'salt' on;
      color: #718096;
      flex: none;
      order: 1;
      flex-grow: 0;
      margin: 0px 0px;
    }
  }
`;

const HelpModalContent: React.FC<Props> = ({ session }) => {
  return (
    <Container>
      <p className="header">HelpModalContent</p>
      <CloseButton onClick={() => {}} />
      <div className="item">
        <div className="img">
          <img src={supportIcon} alt="support" width={22} />
        </div>
        <div>
          <div className="title">Support Forum</div>
          <div className="intro">Questions, feedback, and latest updates</div>
        </div>
      </div>

      <div className="item">
        <div className="img">
          <img src={helpIcon} alt="help" width={21} />
        </div>
        <div>
          <div className="title">Help Articles</div>
          <div className="intro">Get to know more about profile </div>
        </div>
      </div>

      <div className="item">
        <div className="img">
          <img src={reportIcon} alt="report" width={24} />
        </div>
        <div>
          <div className="title">Report a problem</div>
          <div className="intro">Something not right? Report it to us</div>
        </div>
      </div>

      <div className="item">
        <div className="img">
          <img src={contractIcon} alt="contact" width={24} />
        </div>
        <div>
          <div className="title">Contact us</div>
          <div className="intro">Suggestions & feedbacks</div>
        </div>
      </div>
    </Container>
  );
};

export default HelpModalContent;
