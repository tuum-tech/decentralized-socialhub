/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { IonCard, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/react';
import { setTimeout } from 'timers';

import defaultCoverPhoto from '../../../assets/default/default-cover.png';
import {
  Container,
  Description,
  TextHeader,
  ImgUploadArea,
  ImgUploadContainer,
  Perfil
} from './upload';
import styleWidget from '../WidgetCards.module.scss';
import { DidService } from 'src/services/did.service.new';
import { showNotify } from 'src/utils/notify';

interface Props {
  space?: Space;
  onUpload: (base64: string) => void;
}

const Upload: React.FC<Props> = ({ space, onUpload }: Props) => {
  const [imagePreview, setImagePreview] = useState<any>('');
  const [defaultImage, setDefaultImage] = useState('');

  useEffect(() => {
    setDefaultImage(space?.coverPhoto || defaultCoverPhoto);
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

  // const remove = () => {
  //   setFile('');
  //   setImagePreview('');
  //   setBase64('');
  //   setName('');
  //   setSize('');
  //   setDefaultImage(getCoverPhoto(props.session));
  // };

  return (
    <IonCard className={styleWidget['overview']}>
      <Container>
        <Description>
          <IonRow className="ion-justify-content-between ion-no-padding">
            <IonCol className="ion-no-padding">
              <IonCardTitle>Upload Cover Photo</IonCardTitle>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-between ion-no-padding">
            <IonCol className="ion-no-padding">
              <TextHeader>
                Your profile photo is your style representation <br />
                (JPG or PNG, max). <br />
                1056 &#x2715;  176 would be best choose for photo dimension. (Do not upload more flat one)
              </TextHeader>
            </IonCol>
          </IonRow>
        </Description>
        <ImgUploadContainer>
          <form onSubmit={e => onFileSubmit(e)} onChange={e => onChange(e)}>
            <ImgUploadArea logo={defaultImage}>
              <Perfil>
                {/* {imagePreview !== '' && (
                  <img src={imagePreview} alt="Icone adicionar" />
                )} */}
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
    </IonCard>
  );
};

export default Upload;
