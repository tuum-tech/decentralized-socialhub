import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Icon from 'src/elements-v2/icons';
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
  const [activeMenu, setActiveMenu] = useState(false);

  useEffect(() => {
    if (
      history.location.pathname.includes('/connections/followers') ||
      history.location.pathname.includes('/connections/followings') ||
      history.location.pathname.includes('/connections/mutual-followers')
    ) {
      setActiveMenu(true);
      setShowSubMenu(true);
    } else {
      setActiveMenu(false);
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
        active={activeMenu}
        rightContent={
          showSubMenu ? (
            <Icon
              name="chevron-up-outline"
              color={activeMenu ? 'primary' : 'dark'}
            ></Icon>
          ) : (
            <Icon
              name="chevron-down-outline"
              color={activeMenu ? 'primary' : 'dark'}
            ></Icon>
          )
        }
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
