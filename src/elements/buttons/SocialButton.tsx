import React from 'react';
import styled from 'styled-components';

import twitter from '../../assets/icon/twitter.png';
import linkedin from '../../assets/icon/linkedin.png';
import google from '../../assets/icon/google.png';
import facebook from '../../assets/icon/facebook.png';
import shield from '../../assets/icon/shield.png';

interface Props {
  direction?: string;
  onClick?: () => void;
  type?: string;
}

const SocialBtn = styled.div`
  width: 68px;
  height: 53.32px;
  background: #ffffff;
  cursor: pointer;

  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.24),
    0px 3px 8px -1px rgba(50, 50, 71, 0.05);
  border-radius: 8px;
  margin: 8px;

  display: flex;
  justify-content: center;
  align-items: center;

  .linkedin {
    width: 26px;
  }
  .google {
    width: 23.18px;
  }
  .twitter {
    width: 23px;
  }
  .facebook {
    width: 14px;
  }
  .web3auth {
    width: 14px;
  }
`;

const SocialButton: React.FC<Props> = ({ type = 'web3auth', onClick }) => {
  return (
    <SocialBtn onClick={onClick}>
      {type === 'linkedin' && <img src={linkedin} alt="linkedin" />}
      {type === 'twitter' && <img src={twitter} alt="twitter" />}
      {type === 'google' && <img src={google} alt="google" />}
      {type === 'facebook' && <img src={facebook} alt="facebook" />}
      {type === 'web3auth' && <img src={shield} alt="web3auth" />}
    </SocialBtn>
  );
};

export default SocialButton;
