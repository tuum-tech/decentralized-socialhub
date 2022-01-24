import React from 'react';
import { Link } from 'react-router-dom';

import essentials from 'src/assets/new/auth/essentials_black.png';
import style from './CreateProfileButton.module.scss';

interface Props {
  to?: string;
}
export const CreateProfileButton: React.FC<Props> = ({
  to = '/create-profile'
}) => (
  <Link className={style['button-container']} to={to}>
    <button className={style['button-content']}>
      <p className={style['button-text']}>Create a new profile</p>
    </button>
  </Link>
);

export const CreateProfileWithImgButton: React.FC<Props> = ({
  to = '/create-profile'
}) => (
  <Link className={style['button-container']} to={to}>
    <button className={style['button-content']}>
      <img src={essentials} alt="essentials" style={{ marginRight: '5px' }} />
      <p className={style['button-black-text']}>Sign in Here</p>
    </button>
  </Link>
);
