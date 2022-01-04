import React from 'react';

import NavBar from './NavBar';
import style from './style.module.scss';

const Hero = () => {
  return (
    <div className={style['hero-container']}>
      <NavBar />
    </div>
  );
};

export default Hero;
