import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IonSpinner } from '@ionic/react';

import { DidService } from 'src/services/did.service.new';
import { UserService } from 'src/services/user.service';

import style from './style.module.scss';

interface AvatarInterface {
  didPublished: boolean;
  avatar: string;
  type: string;
  name: string;
}

const defaultAvatar: AvatarInterface = {
  type: 'default',
  name: 'Anonymous',
  avatar: '',
  didPublished: true
};

const ContentDiv = styled.div`
  min-width: 40px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f8fa;
  color: #7a7a9d;
  font-weight: bold;
`;

const shortName = (name: string) => {
  const names = name.split(' ');
  let res = '';
  if (names.length > 1) {
    res = names[0][0] + names[1][0];
  } else {
    res = names[0][0] + names[0][1];
  }
  return res.toUpperCase();
};

const Avatar: React.FC<{
  did: string;
  didPublished?: boolean;
  width?: string;
  ready?: boolean;
}> = ({ did = '', didPublished = false, width = '86px', ready = false }) => {
  const [avatarInfo, setAvatarInfo] = useState<AvatarInterface>(defaultAvatar);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      setLoaded(false);

      // retrive avatar info
      let userService: UserService = new UserService(
        await DidService.getInstance()
      );
      const tuumUser = await userService.SearchUserWithDID(did);

      let avatar = '';
      let type = 'default';
      let name = 'Anonymous';
      let didPublished = false;

      let didService = await DidService.getInstance();
      didPublished = await didService.isDIDPublished(did);

      if (tuumUser && tuumUser.did) {
        avatar = tuumUser.avatar;
        type = avatar ? 'vault' : 'default';
        name = tuumUser.name;
      }

      //TODO: Remove when we can get avatar image from hive
      if (tuumUser && tuumUser.isEssentialUser === true) {
        type = 'default';
      }

      setAvatarInfo({
        name: shortName(name),
        avatar,
        type,
        didPublished
      });

      setLoaded(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [did]);

  const cn = ready
    ? style['border-primary']
    : avatarInfo.didPublished || didPublished
    ? style['border-primary']
    : style['border-danger'];

  const renderContents = () => {
    if (!loaded) {
      return <IonSpinner name="lines" />;
    }

    if (avatarInfo.type === 'default') {
      return (
        <div className={style['avatar']} style={{ height: width, width }}>
          <ContentDiv className={cn}>
            {avatarInfo.name[0]} {avatarInfo.name[1]}
          </ContentDiv>
        </div>
      );
    }

    return (
      <div className={style['avatar']} style={{ height: width, width }}>
        <img
          src={avatarInfo.avatar}
          className={cn}
          height="auto"
          alt="avatar"
        />
      </div>
    );
  };

  return (
    <div className={style['avatar']} style={{ height: width, width }}>
      {renderContents()}
    </div>
  );
};

export default Avatar;
