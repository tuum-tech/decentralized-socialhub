import React from 'react';
import { IonList } from '@ionic/react';
import { RecoilRoot } from 'recoil';
import { RequestStatus } from 'src/services/assist.service';
import DashboardHeader from 'src/pages/DashboardPage/components/DashboardHeader';
import { UserService } from 'src/services/user.service';
import MenuItem from '../LeftSideMenu/components/MenuItem';

import { useMoralis } from 'react-moralis';

interface IProps {
  onHide: () => void;
  sessionItem: ISessionItem;
  publishStatus: RequestStatus;
  history: any;
}

const PopoverMenu: React.FC<IProps> = ({
  onHide,
  sessionItem,
  publishStatus,
  history
}: IProps) => {
  const { logout } = useMoralis();

  const changeRoute = (route: string): void => {
    history.push(route);
    onHide();
  };

  return (
    <>
      <RecoilRoot>
        <DashboardHeader
          sessionItem={sessionItem}
          publishStatus={publishStatus}
        />
      </RecoilRoot>

      <IonList>
        <MenuItem
          name="profile"
          title="Profile Manager"
          active={history?.location?.pathname === '/manager'}
          handleClick={() => changeRoute('/manager')}
        />
        <MenuItem
          name="activities"
          title="Activities"
          active={history?.location?.pathname === '/activities'}
          handleClick={() => changeRoute('/activities')}
        />
        <MenuItem
          name="settings"
          title="Settings"
          active={history?.location?.pathname === '/settings'}
          handleClick={() => changeRoute('/settings')}
        />
        <MenuItem
          name="signout"
          title="Sign Out"
          active={false}
          handleClick={() => {
            UserService.logoutUser();
            logout();
          }}
        />
      </IonList>
    </>
  );
};

export default PopoverMenu;
