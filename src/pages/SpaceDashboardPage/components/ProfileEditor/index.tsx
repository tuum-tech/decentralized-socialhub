import { IonCol, IonContent, IonGrid, IonRow } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { SpaceService } from 'src/services/space.service';
import AboutCard from 'src/components/cards/AboutCard';
import SyncBar from 'src/components/SyncBar';
import SpaceCoverPhoto from 'src/components/cards/SpaceCoverPhoto';
import SpaceAvatarChange from 'src/components/cards/SpaceAvatarChange';
import ProfileBriefCard from 'src/components/cards/ProfileBriefCard';
import OverView from '../OverView';
import PublicFields from '../PublicFields';
import Admins from '../Admins';
import DeleteSpace from '../DeleteSpace';
import SocialLinks from '../SocialLinks';
import { SpaceCategory } from 'src/services/space.service';
import style from './style.module.scss';

interface Props {
  session: ISessionItem;
  profile: any;
}

const ProfileEditor: React.FC<Props> = ({ session, profile }) => {
  const history = useHistory();
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
  const onRemoveSpace = async () => {
    const result = window.confirm(
      'This will remove all the contents about this space from your user vault. Are you sure?'
    );
    if (result) {
      await SpaceService.removeSpace(session, spaceProfile);
      history.push('/spaces');
    }
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
            {spaceProfile.followers && spaceProfile.followers.length > 0 && (
              <ProfileBriefCard
                category={'follower'}
                title={'Followers'}
                data={spaceProfile.followers}
                exploreAll={() => {}}
              />
            )}
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
                {spaceProfile && (
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
            <SocialLinks space={spaceProfile} mode="edit" />
            <Admins profile={spaceProfile} />
            {spaceProfile.category === SpaceCategory.Personal && (
              <DeleteSpace profile={spaceProfile} removeSpace={onRemoveSpace} />
            )}
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default ProfileEditor;
