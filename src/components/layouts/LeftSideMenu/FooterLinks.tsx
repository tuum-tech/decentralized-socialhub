import React from 'react';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';

interface Props {
  session: ISessionItem;
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
  }
`;

const FooterLinks: React.FC<Props> = ({ session }) => {
  const history = useHistory();

  return (
    <Container>
      <div
        className="item"
        onClick={async () => history.push('/terms-of-use')}
        style={{ float: 'left' }}
      >
        Terms of use
      </div>
      <div
        className="item"
        onClick={async () => window.open('/terms-of-use')}
        style={{ float: 'left' }}
      >
        Help & Support
      </div>
      <div
        className="item"
        onClick={async () =>
          window.open('https://www.tuum.tech/products/profile')
        }
      >
        About Profile
      </div>
    </Container>
  );
};

export default FooterLinks;
