import React, { useState } from 'react';
import { IonCardTitle, IonCol, IonRow, IonButton } from '@ionic/react';
import { Guid } from 'guid-typescript';
import SmallTextInput from 'src/elements/inputs/SmallTextInput';
import SmallTextareaInput from 'src/elements/inputs/SmallTextareaInput';
import { MyGrid } from 'src/components/cards/common';
import SmallSelectInput from 'src/elements/inputs/SmallSelectInput';
import style from './CreateSpaceForm.module.scss';
import SpaceCoverPhoto from 'src/components/cards/SpaceCoverPhoto';
import SpaceAvatarChange from 'src/components/cards/SpaceAvatarChange';

interface Props {
  submitForm: (form: any) => void;
  onClose: () => void;
}

const defaultSpace: Space = {
  name: '',
  description: '',
  category: 'personal',
  avatar: '',
  coverPhoto: ''
};

const CreateSpaceForm: React.FC<Props> = ({ submitForm, onClose }: Props) => {
  const spaceCategories = [{ value: 'personal', text: 'Personal Group' }];
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
  const handleSubmit = () => {
    submitForm({ ...form, guid: Guid.create() });
  };
  return (
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
            defaultValue={'personal'}
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
      <IonRow className={style['form_footer']}>
        <IonCol size="12">
          <IonButton shape="round" fill="outline" onClick={onClose}>
            Cancel
          </IonButton>
          <IonButton shape="round" onClick={handleSubmit}>
            Create
          </IonButton>
        </IonCol>
      </IonRow>
    </MyGrid>
  );
};

export default CreateSpaceForm;
