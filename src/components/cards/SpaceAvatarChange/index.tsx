/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { IonCard, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/react';
import { setTimeout } from 'timers';

import { CardHeaderContent, CardContentContainer } from '../common';
import defaultAvatar from '../../../assets/icon/dp.png';
import {
  Container,
  Description,
  TextHeader,
  ImgUploadArea,
  ImgUploadContainer,
  Perfil
} from './upload';
import styleWidget from '../WidgetCards.module.scss';
import { DidService, IDidService } from 'src/services/did.service.new';
import { showNotify } from 'src/utils/notify';
import { DID, DIDDocument } from '@elastosfoundation/did-js-sdk/';
import { DidcredsService } from 'src/services/didcreds.service';

interface Props {
  space?: Space;
  onUpload: (base64: string) => void;
}
const Upload: React.FC<Props> = ({ space, onUpload }: Props) => {
  const [imagePreview, setImagePreview] = useState<any>('');
  const [defaultImage, setDefaultImage] = useState<any>('');

  useEffect(() => {
    setDefaultImage(space?.avatar || defaultAvatar);
  }, [space]);

  const onChange = (e: any) => {
    let file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = _handleReaderLoaded;
      reader.readAsBinaryString(file);
    }
  };

  const _handleReaderLoaded = (readerEvt: any) => {
    let binaryString = readerEvt.target.result;
    onUpload(btoa(binaryString));
  };

  const onFileSubmit = (e: any) => {
    e.preventDefault();
  };

  const photoUpload = (e: any) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];

    let maxSize = 700000; //in Bytes
    if (file.size > maxSize) {
      // workaround for now, hardcoded value can be added as env var
      console.error('file too big');

      showNotify(`File is too big. Max size is ${maxSize / 1000}kB`, 'warning'); // could improve to show in MB if max size increases
      return;
    }

    if (reader !== undefined && file !== undefined) {
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setDefaultImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <IonCard className={styleWidget['overview']}>
      <CardContentContainer>
        <Container>
          <Description>
            <IonRow className="ion-justify-content-between ion-no-padding">
              <IonCol className="ion-no-padding">
                <IonCardTitle>Avatar</IonCardTitle>
              </IonCol>
            </IonRow>
            <IonRow className="ion-justify-content-between ion-no-padding">
              <IonCol className="ion-no-padding">
                <TextHeader>
                  Your profile photo is your style representation. <br />
                  (JPG or PNG, max)
                </TextHeader>
              </IonCol>
            </IonRow>
          </Description>
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
                    accept=".jpeg, .png, .jpg"
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
};

export default Upload;