import { IonCol, IonContent, IonGrid, IonRow } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { SpaceService } from 'src/services/space.service';
import AboutCard from 'src/components/cards/AboutCard';
import SyncBar from 'src/components/SyncBar';
import SpaceCoverPhoto from 'src/components/cards/SpaceCoverPhoto';
import SpaceAvatarChange from 'src/components/cards/SpaceAvatarChange';
import OverView from '../OverView';
import PublicFields from '../PublicFields';
import style from './style.module.scss';

interface Props {
  session: ISessionItem;
  profile: any;
}

const ProfileEditor: React.FC<Props> = ({ session, profile }) => {
  const [error, setError] = useState(false);
  const [userInfo, setUserInfo] = useState<ISessionItem>(session);
  const [loaded, setloaded] = useState(false);
  const [spaceProfile, setSpaceProfile] = useState<any>(profile);
  useEffect(() => {
    (async () => {
      if (!session.userToken) return;
      setUserInfo(session);
      setloaded(true);
    })();
    setSpaceProfile(profile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, profile]);

  const onUploadAvatar = async (value: string) => {
    let base64Str = value;
    if (!base64Str.startsWith('data:image')) {
      base64Str = `data:image/png;base64,${base64Str}`;
    }
    const _spaceProfile = { ...spaceProfile, avatar: base64Str };
    await SpaceService.addSpace(session, _spaceProfile);
    setSpaceProfile(_spaceProfile);
  };
  const onUploadCoverPhoto = async (value: string) => {
    let base64Str = value;
    if (!base64Str.startsWith('data:image')) {
      base64Str = `data:image/png;base64,${base64Str}`;
    }
    const _spaceProfile = { ...spaceProfile, coverPhoto: base64Str };
    await SpaceService.addSpace(session, _spaceProfile);
    setSpaceProfile(_spaceProfile);
  };
  const onUpdateAbout = async (value: string) => {
    const _spaceProfile = { ...spaceProfile, description: value };
    await SpaceService.addSpace(session, _spaceProfile);
    setSpaceProfile(_spaceProfile);
  };
  return (
    <IonContent className={style['profileeditor']}>
      <IonGrid className={style['profileeditorgrid']}>
        <IonRow>
          <IonCol size="12">
            <SyncBar session={session}></SyncBar>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="4">
            <OverView sessionItem={userInfo} profile={spaceProfile} />
            <PublicFields sessionItem={userInfo} profile={spaceProfile} />
          </IonCol>
          <IonCol size="8">
            <SpaceAvatarChange space={spaceProfile} onUpload={onUploadAvatar} />
            <SpaceCoverPhoto
              space={spaceProfile}
              onUpload={onUploadCoverPhoto}
            />
            {!error && loaded && userInfo.tutorialStep === 4 ? (
              <>
                {profile && (
                  <AboutCard
                    aboutText={spaceProfile.description || ''}
                    mode="edit"
                    update={onUpdateAbout}
                  />
                )}
              </>
            ) : (
              ''
            )}
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default ProfileEditor;
