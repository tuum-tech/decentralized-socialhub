import React from 'react';
import { useHistory } from 'react-router-dom';
import { IonModal } from '@ionic/react';
import styled from 'styled-components';

import contractIcon from 'src/assets/support/contact.png';
import helpIcon from 'src/assets/support/help.png';
import reportIcon from 'src/assets/support/report.png';
import supportIcon from 'src/assets/support/support.png';
import CloseButton from './CloseButton';

interface Props {
  session: ISessionItem;
  toggleHelpSupport: () => void;
  toggleReportProblem: () => void;
  toggleContactUs: () => void;
}

export const HelpModal = styled(IonModal)`
  --border-radius: 16px;
  --width: 513px;
  --height: 345px;

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

    margin-bottom: 18px;
  }

  .item {
    display: flex;
    align-items: center;
    padding: 8px 0;
    cursor: pointer;

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

const HelpModalContent: React.FC<Props> = ({
  session,
  toggleHelpSupport,
  toggleReportProblem,
  toggleContactUs
}) => {
  const history = useHistory();
  const toSupportForum = () => {
    toggleHelpSupport();
    history.push('/support-forum');
  };

  const handleReportProblem = () => {
    toggleHelpSupport();
    toggleReportProblem();
  };

  const handleContactUs = () => {
    toggleHelpSupport();
    toggleContactUs();
  };

  return (
    <Container>
      <p className="header">Help &amp; Support</p>
      <CloseButton onClick={toggleHelpSupport} />
      <div className="item" onClick={toSupportForum}>
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
          <a href="https://docs.tuum.tech" style={{ textDecoration: 'none' }}>
            <div className="title">Help Articles</div>
          </a>
          <div className="intro">Get to know more about profile </div>
        </div>
      </div>

      <div className="item" onClick={handleReportProblem}>
        <div className="img">
          <img src={reportIcon} alt="report" width={24} />
        </div>
        <div>
          <div className="title">Report a problem</div>
          <div className="intro">Something not right? Report it to us</div>
        </div>
      </div>

      <div className="item" onClick={handleContactUs}>
        <div className="img">
          <img src={contractIcon} alt="contact" width={24} />
        </div>
        <div>
          <div className="title">Contact us</div>
          <div className="intro">Suggestions &amp; feedbacks</div>
        </div>
      </div>
    </Container>
  );
};

export default HelpModalContent;
