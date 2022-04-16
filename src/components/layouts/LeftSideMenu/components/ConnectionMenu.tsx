import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { ArrowUpSvg, ArrowDownSvg } from './icons';
import MenuItem from './MenuItem';

interface Props {
  session: ISessionItem;
}

const SubMenuContainer = styled.div`
  background: #fafafa;
  border-radius: 10px;
  margin: 0 10px;
`;

const ConnectionMenu: React.FC<Props> = ({ session }) => {
  const history = useHistory();
  const [showSubMenu, setShowSubMenu] = useState(false);

  useEffect(() => {
    if (
      history.location.pathname.includes('/connections/followers') ||
      history.location.pathname.includes('/connections/followings') ||
      history.location.pathname.includes('/connections/mutual-followers')
    ) {
      setShowSubMenu(true);
    } else {
      setShowSubMenu(false);
    }
  }, [history.location.pathname]);

  return (
    <>
      <MenuItem
        name="connections"
        title="Connections"
        tooltip={
          session.tutorialStep === 4
            ? ''
            : 'Please complete the tutorial to access your Connections'
        }
        active={
          history.location.pathname.includes('/connections/followers') ||
          history.location.pathname.includes('/connections/followings') ||
          history.location.pathname.includes('/connections/mutual-followers')
        }
        rightContent={showSubMenu ? <ArrowUpSvg /> : <ArrowDownSvg />}
        handleClick={() => setShowSubMenu(!showSubMenu)}
      />

      {showSubMenu && (
        <SubMenuContainer>
          <MenuItem
            name="connections"
            title="Followers"
            isChild
            active={history.location.pathname === '/connections/followers'}
            handleClick={() => history.push('/connections/followers')}
          />

          <MenuItem
            name="connections"
            title="Followings"
            isChild
            active={history.location.pathname === '/connections/followings'}
            handleClick={() => history.push('/connections/followings')}
          />

          <MenuItem
            name="connections"
            title="Mutual Followers"
            isChild
            active={
              history.location.pathname === '/connections/mutual-followers'
            }
            handleClick={() => history.push('/connections/mutual-followers')}
          />
        </SubMenuContainer>
      )}
    </>
  );
};

export default ConnectionMenu;
