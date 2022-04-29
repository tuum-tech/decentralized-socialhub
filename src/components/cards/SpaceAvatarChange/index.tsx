/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { IonCard, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/react';
import { setTimeout } from 'timers';
import { IonModal } from '@ionic/react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import Cropper from 'react-easy-crop';

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
import { SmallLightButton } from 'src/elements/buttons';
import { generateDownload } from '../AvatarChangeCard/util/cropImage';

interface Props {
  space?: Space;
  onUpload: (base64: string) => void;
}
const Upload: React.FC<Props> = ({ space, onUpload }: Props) => {
  const [imagePreview, setImagePreview] = useState<any>('');
  const [defaultImage, setDefaultImage] = useState<any>('');

  const [isImage, setIsImage] = useState<boolean>(false);
  const [croppedArea, setCroppedArea] = useState<any>();
  const [crop, setCrop] = useState<any>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<any>(1);
  const [image, setImage] = useState<any>();

  useEffect(() => {
    setDefaultImage(space?.avatar || defaultAvatar);
  }, [space]);

  const onChange = (e: any) => {
    let file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
    }
  };

  const onFileSubmit = (e: any) => {
    e.preventDefault();
  };

  const onCropComplete = (
    croppedAreaPercentage: any,
    croppedAreaPixels: any
  ) => {
    setCroppedArea(croppedAreaPixels);
  };

  const photoUpload = (e: any) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    let maxSize = 700000; //in Bytes
    if (file.size > maxSize) {
      // workaround for now, hardcoded value can be added as env var
      console.error('file too big');

      showNotify(`File is too big. Max size is ${maxSize / 1000}kB`, 'warning'); // could improve to show in MB if max size increases
      return;
    }

    if (reader !== undefined && file !== undefined) {
      reader.onloadend = () => {
        setIsImage(true);
        setImagePreview(reader.result);
        setImage(reader.result);
        setDefaultImage(file);
      };
      reader.readAsDataURL(file);
      // reader.readAsBinaryString(file);
    }
  };

  React.useEffect(() => {
    const cropOrg = async () => {
      if (image) {
        const cropped = await generateDownload(image, croppedArea);
        if (cropped) {
          setImagePreview(cropped);
          // setImage(cropped);
        }
      }
    };
    cropOrg();
  }, [image, croppedArea]);

  const remove = () => {
    setImagePreview('');
    setImage('');
    setDefaultImage(space?.avatar || defaultAvatar);
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
          <Modal show={isImage} onHide={() => setIsImage(false)}>
            <Modal.Body style={{ minHeight: '70vh' }}>
              <div className="cropper">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 4}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
            </Modal.Body>

            <Modal.Footer>
              <IonCol size="auto" className="ion-no-padding mr-auto">
                <SmallLightButton
                  className="mr-2"
                  onClick={() => {
                    setZoom((preVal: any) => preVal - 0.3);
                  }}
                >
                  -
                </SmallLightButton>
                <SmallLightButton
                  onClick={async () => {
                    setZoom((preVal: any) => preVal + 0.3);
                  }}
                >
                  +
                </SmallLightButton>
              </IonCol>

              <IonCol size="auto" className="ion-no-padding">
                <SmallLightButton
                  className="mr-2"
                  onClick={() => {
                    setIsImage(false);
                    remove();
                  }}
                >
                  Cancel
                </SmallLightButton>
                <SmallLightButton
                  onClick={async () => {
                    setIsImage(false);
                    if (imagePreview) {
                      await onUpload(imagePreview);
                    }
                  }}
                >
                  Save
                </SmallLightButton>
              </IonCol>
            </Modal.Footer>
          </Modal>

          <ImgUploadContainer>
            <form onSubmit={e => onFileSubmit(e)} onChange={e => onChange(e)}>
              <ImgUploadArea logo={defaultImage}>
                <Perfil>
                  {imagePreview !== '' && (
                    <img
                      src={imagePreview}
                      alt="Icone adicionar"
                      style={{ objectFit: 'cover' }}
                    />
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
