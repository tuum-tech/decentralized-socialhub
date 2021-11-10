import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

interface Props {
  session: ISessionItem;
  toggleHelpSupport: () => void;
}

const Container = styled.div`
  padding: 0 32px;
  width: 100%;
  position: absolute;
  bottom: 20px;
  text-align: left;

  .item {
    font-style: normal;
    font-weight: 500;
    font-size: 11px;
    line-height: 162.02%;

    font-feature-settings: 'salt' on;
    color: #a0aec0;

    width: 100px;
    display: block;
    cursor: pointer;
    margin-bottom: 10px;
    float: left;
  }
`;

const FooterLinks: React.FC<Props> = ({ session, toggleHelpSupport }) => {
  const history = useHistory();

  return (
    <Container>
      <div className="item" onClick={() => history.push('/terms-of-use')}>
        Terms of use
      </div>

      <div className="item" onClick={toggleHelpSupport}>
        <span>&middot;</span>
        Help &amp; Support
      </div>
      <div
        className="item"
        onClick={() => window.open('https://www.tuum.tech/products/profile')}
      >
        About Profile
      </div>

      <div
        className="item"
        onClick={() => window.open('https://www.tuum.tech')}
      >
        <span>&middot;</span>Tuum.Tech
      </div>
    </Container>
  );
};

export default FooterLinks;
