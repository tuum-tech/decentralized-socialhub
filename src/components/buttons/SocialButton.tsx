import React from 'react';

import style from './SocialButton.module.scss';
import twitter from '../../assets/icon/twitter.png';
import linkedin from '../../assets/icon/linkedin.png';
import google from '../../assets/icon/google.png';
import facebook from '../../assets/icon/facebook.png';

interface Props {
  direction?: string;
  onClick?: () => void;
  type?: string;
}

const SocialButton: React.FC<Props> = ({ type = 'linkedin', onClick }) => {
  return (
    <div onClick={onClick} className={style['social-btn']}>
      {type === 'linkedin' && <img src={linkedin} alt="linkedin" />}
      {type === 'twitter' && <img src={twitter} alt="twitter" />}
      {type === 'google' && <img src={google} alt="google" />}
      {type === 'facebook' && <img src={facebook} alt="facebook" />}
    </div>
  );
};

export default SocialButton;
