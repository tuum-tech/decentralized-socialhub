import React, { useEffect, useState } from 'react';
import { IonCard, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/react';
import { setTimeout } from 'timers';
import compress from 'compress-base64';

import { UserService } from 'src/services/user.service';
import { defaultUserInfo } from 'src/services/profile.service';

import {
  CardHeaderContent,
  CardContentContainer,
  LinkStyleSpan
} from '../common';
import defaultAvatar from '../../../assets/dp.jpeg';
import {
  Container,
  TextHeader,
  TextDesc,
  ImgUploadArea,
  ImgUploadContainer,
  Perfil
} from './upload';
import styleWidget from '../WidgetCards.module.scss';

export default function Upload() {
  const [userInfo, setUserInfo] = useState<ISessionItem>(defaultUserInfo);
  const [imagePreview, setImagePreview] = useState<any>('');
  const [base64, setBase64] = useState<string>();
  const [defaultImage, setDefaultImage] = useState(defaultAvatar);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<string>();
  const [name, setName] = useState<string>();
  const [size, setSize] = useState<string>();

  useEffect(() => {
    (async () => {
      let instance = UserService.GetUserSession();
      if (!instance || !instance.did) return;
      // setDefaultImage()
      if (instance.avatar && instance.avatar !== '') {
        setDefaultImage(instance.avatar);
      }
      setUserInfo(instance);
    })();
  }, []);

  const storeUploadedAvatar = async (base64: string) => {
    let base64Str = base64;
    if (!base64Str.startsWith('data:image')) {
      base64Str = `data:image/png;base64,${base64Str}`;
    }
    if (userInfo) {
      const newSession = {
        ...userInfo,
        avatar: base64Str
      };
      await UserService.updateSession(newSession, true);
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
              <IonCardTitle>Avatar</IonCardTitle>
            </IonCol>

            <IonCol size="auto" className="ion-no-padding">
              <LinkStyleSpan className="mr-4" onClick={remove}>
                Cancel
              </LinkStyleSpan>
              <LinkStyleSpan
                onClick={async () => {
                  if (base64) await storeUploadedAvatar(base64);
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
          <div>
            <TextHeader>Profile photo</TextHeader>
            <TextDesc>
              Your profile photo is your style representation. (JPG or PNG, max)
            </TextDesc>
          </div>

          <ImgUploadContainer>
            <form onSubmit={e => onFileSubmit(e)} onChange={e => onChange(e)}>
              <ImgUploadArea logo={defaultImage}>
                <Perfil>
                  {imagePreview !== '' && (
                    <img src={imagePreview} alt="Icone adicionar" />
                  )}
                  <input
                    type="file"
                    name="avatar"
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
