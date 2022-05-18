/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { IonCol, IonRow } from '@ionic/react';

import { UserService } from 'src/services/user.service';
import { ProfileService } from 'src/services/profile.service';

import defaultCoverPhoto from '../../../assets/default/default-cover.png';
import soccerCoverPhoto from '../../../assets/cover/soccer.png';
import educationCoverPhoto from '../../../assets/cover/edu.png';
import gamerCoverPhoto from '../../../assets/cover/gamer.png';
import cryptoCoverPhoto from '../../../assets/cover/crypto.png';

import {
  CoverActions,
  StyledUpload,
  CropContainer,
  SliderContainer,
  StyledIonRange,
  StyledCoverContainer,
  StyledCoverImg,
  StyledUploadLabel
} from './upload';
import { DidService } from 'src/services/did.service.new';
import { showNotify } from 'src/utils/notify';

//Crop Image Imports
import Cropper from 'react-easy-crop';
import { generateDownload } from '../AvatarChangeCard/util/cropImage';
import useSession from 'src/hooks/useSession';
import { DefaultButton } from 'src/elements-v2/buttons';

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

const CoverPhoto: React.FC = () => {
  const { session, setSession } = useSession();
  const [imagePreview, setImagePreview] = useState<any>('');
  const [defaultImage, setDefaultImage] = useState(getCoverPhoto(session));
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [file, setFile] = useState<string>();

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
    if (session && session.did !== '') {
      let newSession = JSON.parse(JSON.stringify(session));
      newSession.coverPhoto = base64Str;

      let userService = new UserService(await DidService.getInstance());
      setSession(await userService.updateSession(newSession, true));
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
        setFile(file);
        setImage(reader.result);
        setImagePreview(reader.result);
        setDefaultImage(file);
        setIsEdit(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const remove = () => {
    setFile('');
    setImagePreview('');
    setImage('');
    setDefaultImage(getCoverPhoto(session));
    setIsEdit(false);
  };

  // Crop Image Functions
  React.useEffect(() => {
    (async () => {
      if (image) {
        const cropped = await generateDownload(image, croppedArea);
        if (cropped) {
          setImagePreview(cropped);
        }
      }
    })();
  }, [image, croppedArea]);

  return (
    <>
      <CoverActions>
        <IonRow className="ion-justify-content-end ion-no-padding">
          <IonCol size="auto" className="ion-no-padding">
            {!isEdit && (
              <DefaultButton
                variant="contained"
                size="small"
                bgColor="#00000080"
              >
                <StyledUpload
                  type="file"
                  title=""
                  hidden
                  name="coverPhoto"
                  id="file"
                  accept=".jpef, .png, .jpg"
                  onChange={photoUpload}
                  src={imagePreview}
                />
                <StyledUploadLabel htmlFor="file">Edit</StyledUploadLabel>
              </DefaultButton>
            )}
            {isEdit && (
              <IonRow>
                <DefaultButton
                  variant="contained"
                  size="small"
                  bgColor="#00000080"
                  className="mr-2"
                  onClick={remove}
                >
                  Cancel
                </DefaultButton>
                <DefaultButton
                  variant={'contained'}
                  btnColor="primary-gradient"
                  size="small"
                  onClick={async () => {
                    if (imagePreview) {
                      await storeUploadedCoverPhoto(imagePreview);
                    }
                    setDefaultImage(imagePreview);
                    setIsEdit(false);
                  }}
                >
                  Save Changes
                </DefaultButton>
              </IonRow>
            )}
          </IonCol>
        </IonRow>
      </CoverActions>

      {isEdit ? (
        <div>
          <CropContainer>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={8 / 2}
              objectFit="horizontal-cover"
              showGrid={false}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </CropContainer>
          <SliderContainer>
            <StyledIonRange
              style={{ height: 20, background: '#00000080', borderRadius: 8 }}
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onIonChange={e => setZoom(e.detail.value as any)}
            />
          </SliderContainer>
        </div>
      ) : (
        <StyledCoverContainer>
          <StyledCoverImg src={defaultImage} alt="cover-photo" />
        </StyledCoverContainer>
      )}
    </>
  );
};

export default CoverPhoto;
