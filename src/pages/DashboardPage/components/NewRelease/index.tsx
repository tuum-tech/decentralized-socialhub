/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import Step1Component from './Steps/Step1';
import Step2Component from './Steps/Step2';
import Step3Component from './Steps/Step3';
import { DefaultButton } from 'src/elements-v2/buttons';
import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';
import useSession from 'src/hooks/useSession';
import style from './style.module.scss';
import logo from '../../../../assets/release/release.svg';
import { FullProfileAtom } from 'src/Atoms/Atoms';
import { useRecoilState } from 'recoil';
import { ProfileService } from 'src/services/profile.service';

interface ComponentProps {
  onClose: () => void;
}

const Component: React.FC<ComponentProps> = ({ onClose }: ComponentProps) => {
  const { session, setSession } = useSession();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useRecoilState<ProfileDTO>(FullProfileAtom);

  const stepComponent = () => {
    if (step === 1) return <Step1Component />;
    if (step === 2) return <Step2Component />;
    if (step === 3) return <Step3Component />;
  };

  useEffect(() => {
    if (step > 3) {
      onClose();
      updateSession();
    }
  }, [step]);

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
      newSession.onLatestVersion = true;
      let userService = new UserService(await DidService.getInstance());
      setSession(await userService.updateSession(newSession));
      const newBasicDTO = { ...profile.basicDTO };
      newBasicDTO.did = newSession.did;
      newBasicDTO.onLatestVersion = true;
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
      {stepComponent()}
      <div className={style['bottom']}>
        <DefaultButton
          variant="contained"
          btnColor="primary-gradient"
          size="large"
          onClick={() => {
            setStep(step + 1);
          }}
          className={style['release-button']}
        >
          Continue
        </DefaultButton>
      </div>
    </div>
  );
};

export default Component;
