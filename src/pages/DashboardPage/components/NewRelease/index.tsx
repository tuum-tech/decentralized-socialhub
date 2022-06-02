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
  contents: {
    latestVersion: string;
    releaseNotes: string[];
    videoUpdateUrl?: string;
  };
}

const Component: React.FC<ComponentProps> = ({
  onClose,
  contents
}: ComponentProps) => {
  const { session, setSession } = useSession();
  const [profile, setProfile] = useRecoilState<ProfileDTO>(FullProfileAtom);

  const handleClose = () => {
    onClose();
    updateSession();
  };

  useEffect(() => {
    retriveProfile();
  }, [session]);

  const retriveProfile = async () => {
    if (!session.userToken) return;
    try {
      let res: ProfileDTO | undefined = await ProfileService.getFullProfile(
        session.did,
        session
      );
      console.log('profile ===>', res);
      if (res) {
        res.basicDTO.isEnabled = true;
        setProfile(res);
      }
    } catch (e) {
      console.log('getFullProfile err ======>', e);
    }
  };

  const updateSession = async () => {
    try {
      let newSession = JSON.parse(JSON.stringify(session));
      newSession.latestVersion = contents.latestVersion;
      let userService = new UserService(await DidService.getInstance());
      setSession(await userService.updateSession(newSession));
      const newBasicDTO = { ...profile.basicDTO };
      newBasicDTO.did = newSession.did;
      newBasicDTO.latestVersion = contents.latestVersion;
      await ProfileService.updateVersion(newBasicDTO, newSession);
    } catch (err) {
      console.log('update session err ===>', err);
    }
  };

  return (
    <div className={style['release-component']}>
      <img alt="logo" src={logo} className={style['img']} />
      <h2>New Releases</h2>
      <h3>We've worked hard to implement new features and improvements</h3>
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
