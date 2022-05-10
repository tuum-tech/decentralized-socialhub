import React, { useEffect, useMemo, useState } from 'react';
import { IonCardTitle, IonCol, IonRow } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Guid } from 'guid-typescript';
import SmallTextInput from 'src/elements/inputs/SmallTextInput';
import SmallTextareaInput from 'src/elements/inputs/SmallTextareaInput';
import { MyGrid } from 'src/components/cards/common';
import SmallSelectInput from 'src/elements/inputs/SmallSelectInput';
import { DefaultButton } from 'src/elements-v2/buttons';
import style from './CreateSpace.module.scss';
import SpaceCoverPhoto from 'src/components/cards/SpaceCoverPhoto';
import SpaceAvatarChange from 'src/components/cards/SpaceAvatarChange';
import {
  defaultSpace,
  SpaceCategory,
  SpaceService
} from 'src/services/space.service';
import useSession from 'src/hooks/useSession';
import { showNotify } from 'src/utils/notify';
import { Header } from './SpacePageHeader';
import HeaderMenu from 'src/elements-v2/HeaderMenu';
import { selectSpaces } from 'src/store/spaces/selectors';
import { fetchSpaces } from 'src/store/spaces/actions';

const CreateSpace: React.FC = () => {
  const dispatch = useDispatch();
  const { session } = useSession();
  const history = useHistory();
  const spaces = useSelector(state => selectSpaces(state));
  const mySpaces = useMemo(
    () =>
      spaces?.filter((x: any) => {
        const owners = typeof x.owner === 'string' ? [x.owner] : x.owner;
        return owners.includes(session.did);
      }) ?? [],
    [session, spaces]
  );
  const spaceCategories = [
    { value: SpaceCategory.Personal, text: 'Personal Group' }
  ];
  const [form, setForm] = useState<any>(defaultSpace);
  const onSelectCategory = (value: string) => {
    setForm({ ...form, category: value });
  };
  const onInputDescription = (value: string) => {
    setForm({ ...form, description: value });
  };
  const onInputChange = (evt: any) => {
    setForm({
      ...form,
      [evt.target.name]: evt.target.value
    });
  };
  const onUploadAvatar = (value: string) => {
    let base64Str = value;
    if (!base64Str.startsWith('data:image')) {
      base64Str = `data:image/png;base64,${base64Str}`;
    }
    setForm({
      ...form,
      avatar: base64Str
    });
  };
  const onUploadCoverPhoto = (value: string) => {
    let base64Str = value;
    if (!base64Str.startsWith('data:image')) {
      base64Str = `data:image/png;base64,${base64Str}`;
    }
    setForm({
      ...form,
      coverPhoto: base64Str
    });
  };

  useEffect(() => {
    dispatch(fetchSpaces(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateSpace = async (space: Space) => {
    if (mySpaces.findIndex(_space => _space.name === space.name) > -1) {
      showNotify(
        'Space with same name already exist. Try with another name',
        'warning'
      );
      return;
    }
    await SpaceService.addSpace(session, space);
    history.push('/spaces/list');
  };

  const handleSubmit = () => {
    handleCreateSpace({ ...form, guid: Guid.create() });
  };

  const handleCancel = () => {
    history.push('/spaces/list');
  };

  return (
    <>
      <Header>
        <HeaderMenu
          title="Spaces"
          subtitle="Create New Space"
          back
          backUrl="/spaces/list"
        />
      </Header>
      <MyGrid className={style['form']}>
        <IonRow className={style['form_title']}>
          <IonCardTitle>Create a new space</IonCardTitle>
        </IonRow>
        <IonRow class="ion-justify-content-start">
          <IonCol size="12">
            <SmallTextInput
              label="Space Name"
              placeholder="Enter your name for your space"
              name="name"
              onChange={onInputChange}
              value={form.name}
              hasError={!form.name}
            ></SmallTextInput>
          </IonCol>
        </IonRow>
        <IonRow class="ion-justify-content-start">
          <IonCol size="12">
            <SmallTextareaInput
              label="Description"
              cols={20}
              rows={3}
              value={form.description}
              onChange={onInputDescription}
              placeholder="Short bio or description about the space"
            ></SmallTextareaInput>
          </IonCol>
        </IonRow>
        <IonRow class="ion-justify-content-start">
          <IonCol size="12">
            <SmallSelectInput
              onChange={onSelectCategory}
              values={spaceCategories}
              defaultValue={SpaceCategory.Personal}
              label="Category"
              placeholder="Choose your space category"
            ></SmallSelectInput>
          </IonCol>
        </IonRow>
        <IonRow class="ion-justify-content-start">
          <IonCol size="12">
            <SpaceAvatarChange onUpload={onUploadAvatar} />
          </IonCol>
        </IonRow>
        <IonRow class="ion-justify-content-start">
          <IonCol size="12">
            <SpaceCoverPhoto onUpload={onUploadCoverPhoto} />
          </IonCol>
        </IonRow>
        <IonRow className="ion-padding-vertical">
          <DefaultButton
            className="mr-2"
            variant="contained"
            btnColor="primary-gradient"
            style={{ minWidth: 100 }}
            onClick={handleSubmit}
          >
            Create
          </DefaultButton>
          <DefaultButton
            variant="outlined"
            btnColor="primary-gradient"
            textType="gradient"
            style={{ minWidth: 100 }}
            onClick={handleCancel}
          >
            Cancel
          </DefaultButton>
        </IonRow>
      </MyGrid>
    </>
  );
};

export default CreateSpace;
