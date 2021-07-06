import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IonItem, IonIcon } from '@ionic/react';
import styled from 'styled-components';
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons';

import { Button } from 'src/elements/buttons';
import Logo from 'src/elements/Logo';
import { UserService } from 'src/services/user.service';

import photo from 'src/assets/icon/dp.png';
import narrow from 'src/assets/icon/narrow.svg';

import style from './style.module.scss';

interface Props {
  userSession: ISessionItem;
}

const SignedPublicPageHeader: React.FC<Props> = ({ userSession }: Props) => {
  const history = useHistory();
  const [publishStatus, setPublishStatus] = useState<boolean>(false);
  const [collapse, setCollapse] = useState<boolean>(false);

  useEffect(() => {
    setPublishStatus(userSession.isDIDPublished);
  }, [userSession.isDIDPublished]);

  return (
    <Inline>
      <Left>
        <Logo />
      </Left>
      <Right>
        {userSession ? (
          <Menu
            onClick={() => {
              setCollapse(!collapse);
            }}
          >
            <img
              src={photo}
              height="50"
              className={
                publishStatus
                  ? style['profile-img']
                  : style['profile-img-publishing']
              }
              alt="profile"
            />
            <label>{userSession.name}</label>
            <CustomIcon
              slot="end"
              icon={collapse ? chevronDownOutline : chevronUpOutline}
            ></CustomIcon>
            {collapse && (
              <SubMenu>
                <img src={narrow} alt="" />
                <Item onClick={async () => history.push('/profile')}>
                  Visit Profile.site
                </Item>
                <Item onClick={() => window.open('/did/' + userSession.did)}>
                  View Public Profile
                </Item>
                <Item onClick={() => UserService.logout()}>Sign out</Item>
              </SubMenu>
            )}
          </Menu>
        ) : (
          <>
            <Button
              type="secondary"
              text="Register new user"
              ml={10}
              onClick={() => {
                history.push('/create-profile');
              }}
            />
            <Button
              type="primary"
              text="Sign in"
              ml={10}
              onClick={() => {
                history.push('/create-profile');
              }}
            />
          </>
        )}
      </Right>
    </Inline>
  );
};

const Inline = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 20px;
  border-bottom: 1px solid #edf2f7;
`;
const Left = styled.div``;
const Right = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  & {
  }
`;
const CustomIcon = styled(IonIcon)`
  font-size: 15px;
`;
const Menu = styled.div`
  background-color: #edf2f7;
  border-radius: 13px;
  padding: 5px 15px;
  & label {
    color: #425466;
    font-size: 18px;
    line-height: 24px;
    margin: 0px 10px;
  }
`;
const SubMenu = styled.div`
  position: absolute;
  top: 100px;
  right: 20px;
  width: 200px;
  padding: 10px;

  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.08), 0px 1px 34px rgba(0, 0, 0, 0.07);
  border-radius: 8px;

  & ion-item {
    font-size: 14px;
    color: #4c6fff;
  }
  & :hover {
    cursor: pointer;
  }
  & img {
    content: '';
    width: 47px;
    height: 27px;

    position: absolute;
    left: 50%;
    top: -20px;
    z-index: 200000;
    transform: translateX(-50%);
  }
`;
const Item = styled(IonItem)`
  display: flex;
  align-items: center;
  --border-color: #ffffff;
  height: 35px;
`;
export default SignedPublicPageHeader;
