import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IonItem, IonLabel } from '@ionic/react';
import styled from 'styled-components';

import { ArrowUpSvg, ArrowDownSvg, MenuIcon } from './icons';

import style from '../style.module.scss';

interface Props {
  session: ISessionItem;
}

interface ContainerProps {
  showSubMenu: boolean;
}
const Container = styled(IonItem)<ContainerProps>`
  --background: ${props =>
    props.showSubMenu ? 'rgba(76, 111, 255, 0.05)' : 'white'};
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
      <Container
        showSubMenu={
          history.location.pathname.includes('/connections/followers') ||
          history.location.pathname.includes('/connections/followings') ||
          history.location.pathname.includes('/connections/mutual-followers')
        }
        disabled={session.tutorialStep !== 4}
        className={
          history.location.pathname === '/connections'
            ? style['item-active']
            : style['item-link']
        }
        onClick={async () => {
          setShowSubMenu(!showSubMenu);
        }}
      >
        <MenuIcon name="connections" active />
        <IonLabel
          title={
            session.tutorialStep === 4
              ? ''
              : 'Please complete the tutorial to access your Connections'
          }
        >
          <h3>Connections</h3>
        </IonLabel>
        {showSubMenu ? <ArrowUpSvg /> : <ArrowDownSvg />}
      </Container>

      {showSubMenu && (
        <>
          <IonItem
            className={
              history.location.pathname === '/connections/followers'
                ? style['item-active'] + ' ' + style['item-connections-active']
                : style['item-link'] + ' ' + style['item-connections-link']
            }
            onClick={async () => history.push('/connections/followers')}
          >
            <MenuIcon name="connections" active />
            <IonLabel>
              <h3>Followers</h3>
            </IonLabel>
          </IonItem>
          <IonItem
            className={
              history.location.pathname === '/connections/followings'
                ? style['item-active'] + ' ' + style['item-connections-active']
                : style['item-link'] + ' ' + style['item-connections-link']
            }
            onClick={async () => history.push('/connections/followings')}
          >
            <MenuIcon name="connections" active />
            <IonLabel>
              <h3>Followings</h3>
            </IonLabel>
          </IonItem>
          <IonItem
            className={
              history.location.pathname === '/connections/mutual-followers'
                ? style['item-active'] + ' ' + style['item-connections-active']
                : style['item-link'] + ' ' + style['item-connections-link']
            }
            onClick={async () => history.push('/connections/mutual-followers')}
          >
            <MenuIcon name="connections" active />
            <IonLabel>
              <h3>Mutual Followers</h3>
            </IonLabel>
          </IonItem>
        </>
      )}
    </>
  );
};

export default ConnectionMenu;
