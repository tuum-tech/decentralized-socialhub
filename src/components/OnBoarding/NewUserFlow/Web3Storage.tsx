import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { IonRadioGroup, IonRadio, IonInput } from '@ionic/react';
import { DID, DIDDocument, DIDURL } from '@elastosfoundation/did-js-sdk/';

import request from 'src/baseplate/request';
import { DidService } from 'src/services/did.service.new';
import { UserService } from 'src/services/user.service';
import { HiveService } from 'src/services/hive.service';
import { DidDocumentService } from 'src/services/diddocument.service';
import { ProfileService } from 'src/services/profile.service';
import { UserVaultScripts } from 'src/scripts/uservault.script';
import { ThemeButton } from 'src/elements/buttons';
import { OnBoardingTitle, OnBoardingContainer } from './LoadingModal';
import { TransparentButton } from './OwnYourSelf';
import TutorialSteps from './TutorialSteps';
import { DidcredsService } from 'src/services/didcreds.service';

import tuumlogo from '../../../assets/tuumtech.png';

const Intro = styled.p`
  font-size: 14px;
  line-height: 22px;
  color: #27272e;

  span {
    background: linear-gradient(90deg, #995aff 0%, #dc59bf 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
`;

const VaultContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 40px;
  margin-bottom: 60px;

  .content {
    padding: 17px;

    background: linear-gradient(
      252.79deg,
      rgba(144, 75, 255, 0.084) -20.69%,
      rgba(190, 52, 160, 0.092) 151.16%
    );
    border-radius: 16px;

    position: relative;
    display: flex;
    align-items: center;
    width: calc(100% - 60px);

    img {
      float: left;
      display: inline;
      border: 1px solid #ff9840;
      border-radius: 19px;
      width: 55px;
      padding: 2px;
      margin-right: 17px;
    }

    .top {
      font-weight: 600;
      font-size: 22px;
      line-height: 22px;

      color: #27272e;
      text-align: left;
    }

    .bottom {
      font-weight: 600;
      font-size: 14px;
      line-height: 14px;

      color: #a0aec0;
      text-align: left;
    }
  }
`;

const VersionTag = styled.div`
  position: absolute;
  right: 5px;
  top: calc(50% - 11px);

  p {
    background: #cbd5e0;
    border-radius: 10px;
    padding: 5px;

    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 12px;
    color: #4a5568;
  }
`;

interface Props {
  session: ISessionItem;
  complete: () => void;
  close: () => void;
}

const Web3Storage: React.FC<Props> = ({ session, complete, close }) => {
  const [loading, setLoading] = useState(true);
  const [warningRead, setWarningRead] = useState(false);
  const [hiveUrl, sethiveUrl] = useState('');
  const [hiveDocument, setHiveDocument] = useState('');
  const [selected, setSelected] = useState(
    hiveDocument === '' ? 'tuum' : 'document'
  );
  const [errorMessage, setErrorMessage] = useState('');

  const [tuumHiveVersion, setTuumHiveVersion] = useState('');
  const [detectedHiveVersion, setDetectedHiveVersion] = useState('');

  const getEndpoint = () => {
    if (selected === 'document') return hiveDocument;
    if (selected === 'tuum') return `${process.env.REACT_APP_TUUM_TECH_HIVE}`;
    return hiveUrl;
  };

  const isEndpointValid = (endpoint: string) => {
    if (!endpoint || endpoint.length === 0) return false;
    let regexp = new RegExp(
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    );
    return regexp.test(endpoint);
  };

  const generateUserToken = async (mnemonics: string, address: string) => {
    let isEssentialsUser = mnemonics === undefined || mnemonics === '';
    let challenge = await HiveService.getHiveChallenge(
      address,
      isEssentialsUser
    );
    let didService = await DidService.getInstance();
    let presentation;
    if (mnemonics) {
      presentation = await didService.generateVerifiablePresentationFromUserMnemonics(
        mnemonics,
        '',
        challenge.issuer,
        challenge.nonce
      );
    } else {
      // props.setLoadingText(
      //   "Please approve Profile's request on Esssentials App."
      // );
      presentation = await didService.generateVerifiablePresentationFromEssentialCred(
        challenge.issuer,
        challenge.nonce
      );
    }

    // props.setLoadingText('Connecting to user Vault.');
    const userToken = await HiveService.getUserHiveToken(
      address,
      presentation,
      isEssentialsUser
    );
    return userToken;
  };

  const saveSelection = async () => {
    setErrorMessage('');
    let endpoint = getEndpoint();

    let endpointValid = isEndpointValid(endpoint);
    if (!endpointValid) {
      setErrorMessage('Invalid hive address');
      return;
    }

    setLoading(true);
    let isValidHiveAddress = await HiveService.isHiveAddressValid(
      endpoint,
      session.isEssentialUser!
    );
    if (!isValidHiveAddress) {
      setLoading(false);
      setErrorMessage('Invalid hive address');
      return;
    }

    if (!warningRead) {
      let hiveVersion = await HiveService.getHiveVersion(endpoint);

      if (!(await HiveService.isHiveVersionSet(hiveVersion))) {
        setLoading(false);
        setErrorMessage(
          `Hive version ${hiveVersion} not supported. The minimal supported version is ${process.env.REACT_APP_HIVE_MIN_VERSION} and maximun is ${process.env.REACT_APP_HIVE_MAX_VERSION}`
        );
        setWarningRead(true);
        return;
      }

      try {
        let isVersionSupported = await HiveService.isHiveVersionSupported(
          hiveVersion
        );
        if (!isVersionSupported) {
          setLoading(false);
          setErrorMessage(
            `Hive version ${hiveVersion} not supported. The minimal supported version is ${process.env.REACT_APP_HIVE_MIN_VERSION} and maximun is ${process.env.REACT_APP_HIVE_MAX_VERSION}`
          );
          return;
        }
      } catch (e) {
        setLoading(false);
        setErrorMessage(
          `Hive version could not be verified. The minimal supported version is ${process.env.REACT_APP_HIVE_MIN_VERSION} and maximun is ${process.env.REACT_APP_HIVE_MAX_VERSION}`
        );
        setWarningRead(true);
        return;
      }
    }

    try {
      let userToken = await generateUserToken(session.mnemonics, endpoint);
      let newSession = JSON.parse(
        JSON.stringify({
          ...session,
          userToken,
          tutorialStep: 4,
          hiveHost: endpoint
        })
      );

      if (
        selected !== 'tuum' &&
        endpoint !== process.env.REACT_APP_TUUM_TECH_HIVE
      ) {
        newSession.badges!.dStorage!.ownVault.archived = new Date().getTime();
      }

      let didService = await DidService.getInstance();
      let userService = new UserService(didService);
      const updatedSession = await userService.updateSession(newSession);
      // setSession(updatedSession);
      let hiveInstance = await HiveService.getSessionInstance(newSession);
      // props.setLoadingText('Installing scripts on User Vault.');
      await UserVaultScripts.Execute(hiveInstance!);
      let storedDocument = await didService.getStoredDocument(
        new DID(session.did)
      );

      storedDocument.credentials?.forEach(async vc => {
        await DidcredsService.addOrUpdateCredentialToVault(newSession, vc);
      });

      let activities = await ProfileService.getActivity(newSession);
      activities.push({
        guid: '',
        did: session!.did,
        message: 'You received a Beginner tutorial badge',
        read: false,
        createdAt: 0,
        updatedAt: 0
      });

      newSession.badges!.dStorage!.ownVault.archived &&
        activities.push({
          guid: '',
          did: session!.did,
          message: 'You received a Ownvault storage badge',
          read: false,
          createdAt: 0,
          updatedAt: 0
        });

      activities.forEach(async (activity: ActivityItem) => {
        await ProfileService.addActivity(activity, newSession);
      });
      window.localStorage.removeItem(
        `temporary_activities_${newSession.did.replace('did:elastos:', '')}`
      );
      // import education & experience profile
      let educations = JSON.parse(
        window.localStorage.getItem(
          `temp_educations_${newSession.did.replace('did:elastos:', '')}`
        ) || '[]'
      );
      let experiences = JSON.parse(
        window.localStorage.getItem(
          `temp_experiences_${newSession.did.replace('did:elastos:', '')}`
        ) || '[]'
      );

      if (educations.length > 0 || experiences.length > 0) {
        newSession = JSON.parse(JSON.stringify({ ...newSession }));
        newSession.badges!.account!.educationProfile.archived =
          educations.length > 0 ? new Date().getTime() : false;
        newSession.badges!.account!.experienceProfile.archived =
          experiences.length > 0 ? new Date().getTime() : false;
        const updatedSession = await userService.updateSession(newSession);
        // setSession(updatedSession);
      }

      educations.forEach(
        async (educationItem: EducationItem, index: number) => {
          await ProfileService.updateEducationProfile(
            educationItem,
            newSession,
            !!index
          );
        }
      );
      experiences.forEach(
        async (experienceItem: ExperienceItem, index: number) => {
          await ProfileService.updateExperienceProfile(
            experienceItem,
            newSession,
            !!index
          );
        }
      );

      window.localStorage.removeItem(
        `temp_educations_${newSession.did.replace('did:elastos:', '')}`
      );
      window.localStorage.removeItem(
        `temp_experiences_${newSession.did.replace('did:elastos:', '')}`
      );

      const profileVersionResponse: any = await request(
        `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/support_router/version/releaseNotes?version=latest`,
        {
          method: 'GET',
          headers: {
            'content-Type': 'application/json',
            Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`
          }
        }
      );
      if (profileVersionResponse.meta.code === 200) {
        let profileVersionData: Version = profileVersionResponse.data;
        await ProfileService.addVersionHistory(
          profileVersionData.latestVersion,
          profileVersionData.releaseNotes ?? [],
          profileVersionData.videoUpdateUrl ?? '',
          newSession
        );
      }

      await complete();
    } catch (error) {
      await DidDocumentService.reloadUserDocument(session);
      setErrorMessage(
        'We are not able to process your request at moment. Please try again later. Exception: ' +
          error
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      let didService = await DidService.getInstance();
      setTuumHiveVersion(
        await HiveService.getHiveVersion(
          process.env.REACT_APP_TUUM_TECH_HIVE as string
        )
      );
      let doc = await didService.getDidDocument(session.did);

      if (doc.getServices() && doc.getServices().length > 0) {
        setSelected('document');
        let serviceEndpoint = '';
        let hiveUrl = new DIDURL(session.did + '#hivevault');
        if (doc.services?.has(hiveUrl)) {
          serviceEndpoint = doc.services.get(hiveUrl).serviceEndpoint;
        } else {
          hiveUrl = new DIDURL(session.did + '#HiveVault');
          if (doc.services?.has(hiveUrl)) {
            serviceEndpoint = doc.services.get(hiveUrl).serviceEndpoint;
          }
        }
        if (serviceEndpoint) {
          setHiveDocument(serviceEndpoint);
        }
        setDetectedHiveVersion(
          await HiveService.getHiveVersion(serviceEndpoint)
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('===>hiveDocument', hiveDocument);

  return (
    <OnBoardingContainer style={{ maxWidth: '565px' }}>
      <TutorialSteps step={4} />
      <OnBoardingTitle>Your Web3 Storage</OnBoardingTitle>

      <Intro>
        For the first time, you can truly own your own data by now determinig
        how and where stored - all without a middle man. Simply choose the
        default option or your own <span>Elastos Hive Node</span>.
      </Intro>

      <VaultContainer>
        <IonRadioGroup
          style={{ width: '100%' }}
          value={selected}
          onIonChange={e => {
            e.preventDefault();
            setSelected(e.detail.value!);
            e.cancelBubble = true;
          }}
        >
          {hiveDocument !== '' && (
            <div
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <div className="content">
                <img alt="tuum logo" src={tuumlogo} />
                <div>
                  <p className="top">Tuum Tech</p>
                  <p className="bottom">Default</p>
                </div>
                <VersionTag>
                  <p>{detectedHiveVersion}</p>
                </VersionTag>
              </div>
              {/* <IonRadio value="tuum" style={{ marginLeft: '2px' }}></IonRadio> */}
            </div>
          )}
        </IonRadioGroup>
      </VaultContainer>

      <ThemeButton
        style={{ width: '200px', fontSize: '16px', margin: '20px auto' }}
        onClick={saveSelection}
        text="Complete"
      />
      <TransparentButton onClick={close}>
        <p>Skip for now</p>
      </TransparentButton>
    </OnBoardingContainer>
  );
};

export default Web3Storage;
