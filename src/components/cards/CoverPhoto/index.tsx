/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/react';
import { setTimeout } from 'timers';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from './types';
import { UserService } from 'src/services/user.service';
import { ProfileService } from 'src/services/profile.service';
import { SmallLightButton } from 'src/elements/buttons';

import {
  CardOverview,
  CardHeaderContent,
  CardContentContainer
} from '../common';

import defaultCoverPhoto from '../../../assets/default/default-cover.png';
import soccerCoverPhoto from '../../../assets/cover/soccer.png';
import educationCoverPhoto from '../../../assets/cover/edu.png';
import gamerCoverPhoto from '../../../assets/cover/gamer.png';
import cryptoCoverPhoto from '../../../assets/cover/crypto.png';

import {
  Container,
  TextHeader,
  ImgUploadArea,
  ImgUploadContainer,
  Perfil
} from './upload';
import styleWidget from '../WidgetCards.module.scss';
import { DidService } from 'src/services/did.service.new';
import { showNotify } from 'src/utils/notify';

//Crop Image Imports
import { IonModal } from '@ionic/react';
import { Modal } from 'react-bootstrap';
import Cropper from 'react-easy-crop';
import { generateDownload } from '../AvatarChangeCard/util/cropImage';

export const getCoverPhoto = (user: ISessionItem) => {
  if (user.coverPhoto && user.coverPhoto !== '') {
    return user.coverPhoto;
  }

  const template = user.pageTemplate || 'default';
  if (template === 'soccer') {
    return soccerCoverPhoto;
  } else if (template === 'education') {
    return educationCoverPhoto;
  } else if (template === 'gamer') {
    return gamerCoverPhoto;
  } else if (template === 'crypto') {
    return cryptoCoverPhoto;
  }
  return defaultCoverPhoto;
};

const Upload: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  const [imagePreview, setImagePreview] = useState<any>('');
  const [base64, setBase64] = useState<string>();
  const [defaultImage, setDefaultImage] = useState(
    getCoverPhoto(props.session)
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImage, setIsImage] = useState<boolean>(false);
  const [file, setFile] = useState<string>();
  const [name, setName] = useState<string>();
  const [size, setSize] = useState<string>();

  //Crop Image Functions and states
  const [image, setImage] = useState<any>();
  const [croppedArea, setCroppedArea] = useState<any>();
  const [crop, setCrop] = useState<any>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<any>(1);

  const onCropComplete = (
    croppedAreaPercentage: any,
    croppedAreaPixels: any
  ) => {
    setCroppedArea(croppedAreaPixels);
  };

  const storeUploadedCoverPhoto = async (base64: string) => {
    let base64Str = base64;
    if (!base64Str.startsWith('data:image')) {
      base64Str = `data:image/png;base64,${base64Str}`;
    }
    if (props.session && props.session.did !== '') {
      let newSession = JSON.parse(JSON.stringify(props.session));
      newSession.coverPhoto = base64Str;

      let userService = new UserService(await DidService.getInstance());
      eProps.setSession({
        session: await userService.updateSession(newSession, true)
      });
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
    }
  };

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
    setBase64(btoa(binaryString));
  };

  const onFileSubmit = (e: any) => {
    setIsLoading(true);
    e.preventDefault();
    let payload = { image: base64 };

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
        setIsImage(true);
        setFile(file);
        setSize(file.size);
        setName(file.name);
        setImage(reader.result);
        setImagePreview(reader.result);
        setDefaultImage(file);
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
    setImage('');
    setDefaultImage(getCoverPhoto(props.session));
  };

  //Crop Image Functions
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

  return (
    <CardOverview template="default">
      <CardHeaderContent>
        <IonGrid className="ion-no-padding">
          <IonRow className="ion-justify-content-between ion-no-padding">
            <IonCol className="ion-no-padding">
              <IonCardTitle>Cover Photo</IonCardTitle>
            </IonCol>

            {/* <IonCol size="auto" className="ion-no-padding">
              <SmallLightButton className="mr-2" onClick={remove}>
                Cancel
              </SmallLightButton>
              <SmallLightButton
                onClick={async () => {
                  if (base64) await storeUploadedCoverPhoto(base64);
                }}
              >
                Save
              </SmallLightButton>
            </IonCol> */}
          </IonRow>
        </IonGrid>
      </CardHeaderContent>
      <CardContentContainer>
        <Container>
          <TextHeader>
            Your image must be JPG or PNG and less than 750KB
            <br />
            It can have a max dimension of 1056 x 176
          </TextHeader>

          <Modal show={isImage} onHide={() => setIsImage(false)}>
            <Modal.Body style={{ minHeight: '70vh' }}>
              <div className="cropper">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={16 / 7}
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
                    const cropped = await generateDownload(image, croppedArea);
                    // console.log(check);
                    if (cropped) await storeUploadedCoverPhoto(cropped);
                    // console.log(imagePreview)
                    // if (base64) await storeUploadedAvatar(base64);
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
    </CardOverview>
  );
};

export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  session: makeSelectSession()
});

export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      setSession: (props: { session: ISessionItem }) =>
        dispatch(setSession(props))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Upload);
