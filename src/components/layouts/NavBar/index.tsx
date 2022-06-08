import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import {
  NavCollapseOpenButton,
  NavCollapseCloseButton
} from 'src/components/Icons';

import DesktopNavContent from './desktop';
import MobileNavContent from './mobile';

const NavContainer = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
  z-index: 99;

  .content {
    width: 100%;
    position: relative;

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
  }
`;

interface IProps {
  navItemClicked: (item: string) => void;
}

const NavBar: React.FC<IProps> = ({ navItemClicked }) => {
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
      <div className="content">
        <DesktopNavContent navItemClicked={navItemClicked} />
        {toggleMenu && (
          <MobileNavContent
            navItemClicked={path => {
              setToggleMenu(false);
              navItemClicked(path);
            }}
          />
        )}
        <button
          className="btn"
          style={{ outline: 0 }}
          onClick={() => setToggleMenu(!toggleMenu)}
        >
          {toggleMenu ? <NavCollapseCloseButton /> : <NavCollapseOpenButton />}
        </button>
      </div>
    </NavContainer>
  );
};

export default NavBar;
