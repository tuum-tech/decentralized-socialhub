import { IonPage } from '@ionic/react';

import React, { useEffect, useState } from 'react';

import { UserService } from 'src/services/user.service';
import LoadingIndicator from 'src/components/LoadingIndicator';
import { defaultUserInfo } from 'src/services/profile.service';

import PageLoading from 'src/components/layouts/PageLoading';
// import OnBoarding from './components/OnBoarding';

const DashboardPage = () => {
  // const [loadingText, setLoadingText] = useState('');
  // const [userInfo, setUserInfo] = useState<ISessionItem>(defaultUserInfo);
  // const [stage, setStage] = useState(0);

  // useEffect(() => {
  //   let userSession = UserService.GetUserSession();
  //   if (!userSession) {
  //     return;
  //   }
  //   setUserInfo(userSession);
  //   setStage(userSession.onBoardingStep);

  //   // can retrive user info from vault periodically
  // }, []);

  // const next = async () => {
  //   if (stage === 1) {
  //     // in publishing
  //     return;
  //   }
  //   if (stage === 7) {
  //     // onboarding completed
  //     return;
  //   }
  //   await UserService.updateSession({
  //     ...userInfo,
  //     onBoardingStep: stage + 1
  //   });
  //   setStage(stage + 1);
  // };

  // if (userInfo.did === '') {
  //   <PageLoading />;
  // }

  // if (userInfo.onBoardingStep && userInfo.onBoardingStep !== 7) {
  //   return <OnBoarding stage={stage} userName={userInfo.name} next={next} />;
  // }

  return (
    <IonPage>
      {/* {loadingText && loadingText !== '' && (
        <LoadingIndicator loadingText={loadingText} />
      )}
      test */}
    </IonPage>
  );
};

export default DashboardPage;
