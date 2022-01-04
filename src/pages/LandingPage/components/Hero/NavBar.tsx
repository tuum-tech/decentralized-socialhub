import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import {
  NavCollapseOpenButton,
  NavCollapseCloseButton
} from 'src/components/Icons';

import { DesktopNavContent, MobileNavContent } from './navContent';

const NavContainer = styled.div`
  .btn {
    display: none;
    position: absolute;
    right: 25px;
    top: 27px;
    padding: 5px;

    outline: 0px;
    box-shadow: none;
  }

  @media screen and (max-width: 1200px) {
    .btn {
      display: block;
    }
  }
`;

const NavBar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const changeWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', changeWidth);

    return () => {
      window.removeEventListener('resize', changeWidth);
    };
  }, []);

  return (
    <NavContainer>
      <DesktopNavContent />
      {toggleMenu && <MobileNavContent />}
      <button
        className="btn"
        style={{ outline: 0 }}
        onClick={() => setToggleMenu(!toggleMenu)}
      >
        {toggleMenu ? <NavCollapseCloseButton /> : <NavCollapseOpenButton />}
      </button>
    </NavContainer>
  );
};

export default NavBar;
