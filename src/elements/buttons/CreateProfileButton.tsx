import React from 'react';
import { Link } from 'react-router-dom';

import style from './CreateProfileButton.module.scss';

interface Props {}

const CreateProfileButton: React.FC<Props> = ({}) => (
  <Link className={style['button-container']} to="/create-profile">
    <button className={style['button-content']}>
      <p className={style['button-text']}>Create a new profile</p>
    </button>
  </Link>
);

export default CreateProfileButton;
