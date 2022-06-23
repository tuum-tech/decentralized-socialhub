import { IonCol, IonGrid, IonRow } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';
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
import Tags from '../Tags';
import { CategoriesForPrivateSpace } from 'src/services/space.service';
import { removeSpace, updateSpace } from 'src/store/spaces/actions';

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

const SpaceEditor: React.FC<Props> = ({ session, profile }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [userInfo, setUserInfo] = useState<ISessionItem>(session);
  const [loaded, setLoaded] = useState(false);
  const [spaceProfile, setSpaceProfile] = useState<Space>(profile);
  useEffect(() => {
    (async () => {
      if (!session.userToken) return;
      setUserInfo(session);
      setLoaded(true);
    })();
    setSpaceProfile(profile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, profile]);

  // should be updated
  const onUploadAvatar = async (value: string) => {
    let base64Str = value;
    if (!base64Str.startsWith('data:image')) {
      base64Str = `data:image/png;base64,${base64Str}`;
    }
    const _spaceProfile = { ...spaceProfile, avatar: base64Str };
    dispatch(updateSpace(_spaceProfile));
    setSpaceProfile(_spaceProfile);
  };
  const onUploadCoverPhoto = async (value: string) => {
    let base64Str = value;
    if (!base64Str.startsWith('data:image')) {
      base64Str = `data:image/png;base64,${base64Str}`;
    }
    const _spaceProfile = { ...spaceProfile, coverPhoto: base64Str };
    dispatch(updateSpace(_spaceProfile));
    setSpaceProfile(_spaceProfile);
  };
  const onUpdateAbout = async (value: string) => {
    const _spaceProfile = { ...spaceProfile, description: value };
    dispatch(updateSpace(_spaceProfile));
    setSpaceProfile(_spaceProfile);
  };
  const onUpdateTags = async (tags: string[]) => {
    const _spaceProfile = { ...spaceProfile, tags };
    dispatch(updateSpace(_spaceProfile, false));
    setSpaceProfile(_spaceProfile);
  };
  const onUpdateCategory = async (category: string) => {
    const _spaceProfile = { ...spaceProfile, category };
    dispatch(updateSpace(_spaceProfile, false));
    setSpaceProfile(_spaceProfile);
  };
  const onUpdatePublicFields = async (fields: string[]) => {
    const _spaceProfile = { ...spaceProfile, publicFields: fields };
    dispatch(updateSpace(_spaceProfile, false));
    setSpaceProfile(_spaceProfile);
  };
  const onRemoveSpace = async () => {
    const result = window.confirm(
      'This will remove all the contents about this space from your user vault. Are you sure?'
    );
    if (result) {
      dispatch(removeSpace(spaceProfile));
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
          <PublicFields
            sessionItem={userInfo}
            profile={spaceProfile}
            update={onUpdatePublicFields}
          />
        </IonCol>
        <IonCol sizeMd="8" sizeSm="12">
          <SpaceCoverPhoto space={spaceProfile} onUpload={onUploadCoverPhoto} />
          <SpaceAvatarChange space={spaceProfile} onUpload={onUploadAvatar} />
          {loaded && userInfo.onBoardingCompleted ? (
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
          {CategoriesForPrivateSpace.includes(spaceProfile.category) && (
            <Category profile={spaceProfile} update={onUpdateCategory} />
          )}
          <Tags profile={spaceProfile} update={onUpdateTags} />
          <Admins profile={spaceProfile} />
          {CategoriesForPrivateSpace.includes(spaceProfile.category) && (
            <DeleteSpace profile={spaceProfile} removeSpace={onRemoveSpace} />
          )}
        </IonCol>
      </IonRow>
    </StyledGrid>
  );
};

export default SpaceEditor;
