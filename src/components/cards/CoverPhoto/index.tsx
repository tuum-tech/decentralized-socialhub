/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { IonCard, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/react';
import { setTimeout } from 'timers';

import { UserService } from 'src/services/user.service';
import { defaultUserInfo, ProfileService } from 'src/services/profile.service';

import {
  CardHeaderContent,
  CardContentContainer,
  LinkStyleSpan
} from '../common';
import defaultCoverPhoto from '../../../assets/default-cover.png';
import {
  Container,
  TextHeader,
  ImgUploadArea,
  ImgUploadContainer,
  Perfil
} from './upload';
import styleWidget from '../WidgetCards.module.scss';

export default function Upload() {
  const [userInfo, setUserInfo] = useState<ISessionItem>(defaultUserInfo);
  const [imagePreview, setImagePreview] = useState<any>('');
  const [base64, setBase64] = useState<string>();
  const [defaultImage, setDefaultImage] = useState(defaultCoverPhoto);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<string>();
  const [name, setName] = useState<string>();
  const [size, setSize] = useState<string>();

  useEffect(() => {
    (async () => {
      let instance = UserService.GetUserSession();
      if (!instance || !instance.did) return;
      if (instance.coverPhoto && instance.coverPhoto !== '') {
        setDefaultImage(instance.coverPhoto);
      }
      setUserInfo(instance);
    })();
  }, []);

  const storeUploadedCoverPhoto = async (base64: string) => {
    let base64Str = base64;
    if (!base64Str.startsWith('data:image')) {
      base64Str = `data:image/png;base64,${base64Str}`;
    }
    if (userInfo) {
      const newSession = {
        ...userInfo,
        coverPhoto: base64Str
      };
      await UserService.updateSession(newSession, true);
      await ProfileService.addActivity(
        {
          guid: '',
          did: newSession!.did,
          message: 'You updated cover photo',
          read: false,
          createdAt: 0,
          updatedAt: 0
        },
        newSession!.did
      );
      setUserInfo(newSession);
    }
  };

  const onChange = (e: any) => {
    console.log('file', e.target.files[0]);
    let file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = _handleReaderLoaded;
      reader.readAsBinaryString(file);
    }
  };

  const _handleReaderLoaded = (readerEvt: any) => {
    let binaryString = readerEvt.target.result;
    setBase64(btoa(binaryString));
  };

  const onFileSubmit = (e: any) => {
    setIsLoading(true);
    e.preventDefault();
    console.log('bine', base64);
    let payload = { image: base64 };
    console.log('payload', payload);

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const photoUpload = (e: any) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];

    if (reader !== undefined && file !== undefined) {
      reader.onloadend = () => {
        setFile(file);
        setSize(file.size);
        setName(file.name);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const remove = () => {
    setFile('');
    setImagePreview('');
    setBase64('');
    setName('');
    setSize('');
  };

  return (
    <IonCard className={styleWidget['overview']}>
      <CardHeaderContent>
        <IonGrid className="ion-no-padding">
          <IonRow className="ion-justify-content-between ion-no-padding">
            <IonCol className="ion-no-padding">
              <IonCardTitle>Cover Photo</IonCardTitle>
            </IonCol>

            <IonCol size="auto" className="ion-no-padding">
              <LinkStyleSpan className="mr-4" onClick={remove}>
                Cancel
              </LinkStyleSpan>
              <LinkStyleSpan
                onClick={async () => {
                  if (base64) await storeUploadedCoverPhoto(base64);
                }}
              >
                Save
              </LinkStyleSpan>
            </IonCol>
          </IonRow>
        </IonGrid>
      </CardHeaderContent>
      <CardContentContainer>
        <Container>
          <TextHeader>
            Cover photo represents you, it goes on your profile as a header (JPG
            or PNG, max).
          </TextHeader>

          <ImgUploadContainer>
            <form onSubmit={e => onFileSubmit(e)} onChange={e => onChange(e)}>
              <ImgUploadArea logo={defaultImage}>
                <Perfil>
                  {imagePreview !== '' && (
                    <img src={imagePreview} alt="Icone adicionar" />
                  )}
                  <input
                    type="file"
                    name="coverPhoto"
                    id="file"
                    accept=".jpef, .png, .jpg"
                    onChange={photoUpload}
                    src={imagePreview}
                  />
                </Perfil>
              </ImgUploadArea>
            </form>
          </ImgUploadContainer>
        </Container>
      </CardContentContainer>
    </IonCard>
  );
}
