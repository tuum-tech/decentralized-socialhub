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
    updateVersion();
  };

  const updateVersion = async () => {
    try {
      let newSession = JSON.parse(JSON.stringify(session));
      if (contents.profileVersion)
        await ProfileService.updateVersion(contents.profileVersion, newSession);
      UserService.logout();
    } catch (err) {
      console.log('update version err ===>', err);
    }
  };

  return (
    <div className={style['release-component']}>
      <img alt="logo" src={logo} className={style['img']} />
      <h2>New Release v{contents.profileVersion}</h2>
      <h3>Note that you'll need to relogin upon closing this notification</h3>
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
