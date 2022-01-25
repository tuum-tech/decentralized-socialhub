import React from 'react';
import { Link } from 'react-router-dom';

import essentials from 'src/assets/new/auth/essentials_black.png';
import style from './ThemeTransparentButton.module.scss';

interface Props {
  to?: string;
  text?: string;
  hasImg?: boolean;
}
const ThemeTransparentButton: React.FC<Props> = ({
  to = '/create-profile',
  text = 'Create a new profile',
  hasImg = false
}) => (
  <Link className={style['button-container']} to={to}>
    <button className={style['button-content']}>
      {hasImg && (
        <img src={essentials} alt="essentials" style={{ marginRight: '5px' }} />
      )}
      <p className={style['button-text']}>{text}</p>
    </button>
  </Link>
);

export default ThemeTransparentButton;
