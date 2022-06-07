/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import ContentComponent from './Content';
import { DefaultButton } from 'src/elements-v2/buttons';
import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';
import { ProfileService } from 'src/services/profile.service';
import useSession from 'src/hooks/useSession';
import { FullProfileAtom } from 'src/Atoms/Atoms';
import style from './style.module.scss';
import logo from '../../../../assets/release/release.svg';

interface ComponentProps {
  onClose: () => void;
  contents: Version;
}

const Component: React.FC<ComponentProps> = ({
  onClose,
  contents
}: ComponentProps) => {
  const { session, setSession } = useSession();

  const handleClose = () => {
    onClose();
    updateSession();
  };

  const updateSession = async () => {
    try {
      let newSession = JSON.parse(JSON.stringify(session));
      newSession.latestVersion = contents.profileVersion;
      let userService = new UserService(await DidService.getInstance());
      if (contents.profileVersion)
        await ProfileService.updateVersion(contents.profileVersion, newSession);
      setSession(await userService.updateSession(newSession));
    } catch (err) {
      console.log('update session err ===>', err);
    }
  };

  return (
    <div className={style['release-component']}>
      <img alt="logo" src={logo} className={style['img']} />
      <h2>New Release v{contents.profileVersion}</h2>
      <h3>
        We've worked hard to implement the following new features and
        improvements to Profile:
      </h3>
      <ContentComponent contents={contents} />
      <DefaultButton
        variant="contained"
        btnColor="primary-gradient"
        size="large"
        onClick={handleClose}
        className={style['release-button']}
      >
        Continue
      </DefaultButton>
    </div>
  );
};

export default Component;
