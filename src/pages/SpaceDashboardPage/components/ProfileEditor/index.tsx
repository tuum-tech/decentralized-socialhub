import { IonCol, IonGrid, IonRow } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';
import { SpaceService } from 'src/services/space.service';
import AboutCard from 'src/components/cards/AboutCard';
import SyncBar from 'src/components/SyncBar';
import SpaceCoverPhoto from 'src/components/cards/SpaceCoverPhoto';
import SpaceAvatarChange from 'src/components/cards/SpaceAvatarChange';
import ProfileBriefCard from 'src/components/cards/ProfileBriefCard';
import Followers from '../Followers';
import OverView from '../OverView';
import PublicFields from '../PublicFields';
import Admins from '../Admins';
import DeleteSpace from '../DeleteSpace';
import SocialLinks from '../SocialLinks';
import Category from '../Category';
import { SpaceCategory } from 'src/services/space.service';

const StyledGrid = styled(IonGrid)`
  padding: 10px 35px 20px;
  background: #f7fafc;
  ${down('sm')} {
    padding: 10px 16px 20px;
  }
`;

interface Props {
  session: ISessionItem;
  profile: any;
}

const ProfileEditor: React.FC<Props> = ({ session, profile }) => {
  const history = useHistory();
  const [userInfo, setUserInfo] = useState<ISessionItem>(session);
  const [loaded, setLoaded] = useState(false);
  const [spaceProfile, setSpaceProfile] = useState<any>(profile);
  useEffect(() => {
    (async () => {
      if (!session.userToken) return;
      setUserInfo(session);
      setLoaded(true);
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
  const onUpdateCategory = async (category: string[]) => {
    const _spaceProfile = { ...spaceProfile, tags: category };
    await SpaceService.addSpace(session, _spaceProfile, false);
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
    <StyledGrid>
      <IonRow>
        <IonCol size="12">
          <SyncBar session={session}></SyncBar>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol sizeMd="4" sizeSm="12">
          <OverView sessionItem={userInfo} profile={spaceProfile} />
          {spaceProfile.followers && spaceProfile.followers.length > 0 && (
            <Followers
              title={'Followers'}
              space={spaceProfile}
              exploreAll={() => {}}
            />
          )}
          <PublicFields sessionItem={userInfo} profile={spaceProfile} />
        </IonCol>
        <IonCol sizeMd="8" sizeSm="12">
          <SpaceCoverPhoto space={spaceProfile} onUpload={onUploadCoverPhoto} />
          <SpaceAvatarChange space={spaceProfile} onUpload={onUploadAvatar} />
          {loaded && userInfo.tutorialStep === 4 ? (
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
          {spaceProfile.category !== SpaceCategory.Personal && (
            <SocialLinks space={spaceProfile} mode="edit" />
          )}
          {spaceProfile.category !== SpaceCategory.Personal && (
            <Category profile={spaceProfile} update={onUpdateCategory} />
          )}
          <Admins profile={spaceProfile} />
          {spaceProfile.category === SpaceCategory.Personal && (
            <DeleteSpace profile={spaceProfile} removeSpace={onRemoveSpace} />
          )}
        </IonCol>
      </IonRow>
    </StyledGrid>
  );
};

export default ProfileEditor;
