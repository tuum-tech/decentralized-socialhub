import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonIcon, IonItem, IonLabel, IonList } from '@ionic/react';

import { UserService } from 'src/services/user.service';
import { defaultUserInfo } from 'src/services/profile.service';

import style from './style.module.scss';

const Navbar: React.FC = ({}) => {
  const history = useHistory();
  const [userInfo, setUserInfo] = useState<ISessionItem>(
    UserService.GetUserSession() || defaultUserInfo
  );

  return (
    <IonContent>
      <div className={style['navbar']}>
        <IonList>
          <IonItem
            className={
              // active === 'dashboard'
              history.location.pathname === '/profile'
                ? style['item-active']
                : style['item-link']
            }
            onClick={async () => history.push('/profile')}
          >
            <IonIcon
              slot="start"
              src="../../assets/icon_dashboard.svg"
              className={style['img']}
            ></IonIcon>
            <IonLabel>
              <h3>Dashboard</h3>
            </IonLabel>
          </IonItem>
          <IonItem
            className={
              // active === 'profile_manager'
              history.location.pathname === '/manager'
                ? style['item-active']
                : style['item-link']
            }
            onClick={async () => history.push('/manager')}
          >
            <IonIcon
              slot="start"
              src="../../assets/icon_profile_manager.svg"
              className={style['img']}
            ></IonIcon>
            <IonLabel>
              <h3>Profile Manager</h3>
            </IonLabel>
          </IonItem>
          <IonItem
            disabled={userInfo.tutorialStep !== 4}
            className={
              // active === 'connections-followers' ||
              // active === 'connections-followings'
              history.location.pathname === '/connections/followers' ||
              history.location.pathname === '/connections/followings'
                ? style['item-active']
                : style['item-link']
            }
            onClick={async () => history.push('/connections/followers')}
          >
            <IonIcon
              slot="start"
              src="../../assets/icon_connections.svg"
              className={style['img']}
              title={
                userInfo.tutorialStep === 4
                  ? ''
                  : 'Please complete the tutorial to access your Connections'
              }
            ></IonIcon>
            <IonLabel
              title={
                userInfo.tutorialStep === 4
                  ? ''
                  : 'Please complete the tutorial to access your Connections'
              }
            >
              <h3>Connections</h3>
            </IonLabel>
          </IonItem>

          {history.location.pathname.includes('/connections/') && (
            <>
              <IonItem
                className={
                  // active === 'connections-followers'
                  history.location.pathname === '/connections/followers'
                    ? style['item-active'] +
                      ' ' +
                      style['item-connections-active']
                    : style['item-link'] + ' ' + style['item-connections-link']
                }
                onClick={async () => history.push('/connections/followers')}
              >
                <IonIcon
                  slot="start"
                  src="../../assets/icon_connections.svg"
                  className={style['img']}
                ></IonIcon>
                <IonLabel>
                  <h3>Followers</h3>
                </IonLabel>
              </IonItem>
              <IonItem
                className={
                  // active === 'connections-followings'
                  history.location.pathname === '/connections/followings'
                    ? style['item-active'] +
                      ' ' +
                      style['item-connections-active']
                    : style['item-link'] + ' ' + style['item-connections-link']
                }
                onClick={async () => history.push('/connections/followings')}
              >
                <IonIcon
                  slot="start"
                  src="../../assets/icon_connections.svg"
                  className={style['img']}
                ></IonIcon>
                <IonLabel>
                  <h3>Followings</h3>
                </IonLabel>
              </IonItem>
            </>
          )}

          <IonItem
            className={
              // active === 'search' ?
              history.location.pathname === '/explore'
                ? style['item-active']
                : style['item-link']
            }
            onClick={async () => history.push('/explore')}
          >
            <IonIcon
              slot="start"
              src="../../assets/icon_search.svg"
              className={style['img']}
            ></IonIcon>
            <IonLabel>
              <h3>Explore</h3>
            </IonLabel>
          </IonItem>
          <hr className={style['divider']} />
          <IonItem
            className={
              // active === 'settings'
              history.location.pathname === '/settings'
                ? style['item-active']
                : style['item-link']
            }
            onClick={async () => history.push('/settings')}
          >
            <IonIcon
              slot="start"
              src="../../assets/icon_settings.svg"
              className={style['img']}
            ></IonIcon>
            <IonLabel>
              <h3>Settings</h3>
            </IonLabel>
          </IonItem>
          {/* <IonItem
            className={
              // active === 'notifications'
              history.location.pathname === '/notifications'
                ? style['item-active']
                : style['item-link']
            }
            onClick={() => history.push('/notifications')} // should be fixed later
          >
            <IonIcon
              slot="start"
              src="../../assets/icon_notifications.svg"
              className={style['img']}
            ></IonIcon>
            <IonLabel>
              <h3>Notifications</h3>
            </IonLabel>
          </IonItem> */}
          <IonItem
            className={style['item-link']}
            onClick={() => {
              UserService.logout();
            }}
          >
            <IonIcon
              slot="start"
              src="../../assets/sign-out.svg"
              className={style['img']}
            ></IonIcon>
            <IonLabel>
              <h3>Sign Out</h3>
            </IonLabel>
          </IonItem>
        </IonList>
        {/* <img src="../../assets/icon_dashboard.svg" /> Dashboard<br />
          <img src="../../assets/icon_profile_manager.svg" /> Profile Manager<br />
          <img src="../../assets/icon_connections.svg" /> Connections<br />
          <img src="../../assets/icon_explore.svg" /> Explore<br /> */}

        {/* <hr /> */}

        {/* <img src="../../assets/icon_settings.svg" /> Settings<br />
          <img src="../../assets/icon_notifications.svg" /> Notifications<br />           */}
      </div>
    </IonContent>
  );
};

export default Navbar;
