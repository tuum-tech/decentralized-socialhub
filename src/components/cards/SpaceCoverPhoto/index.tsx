/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { IonCol, IonRow } from '@ionic/react';
import Cropper from 'react-easy-crop';

import defaultCoverPhoto from '../../../assets/default/default-cover.png';
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
import { showNotify } from 'src/utils/notify';

import { DefaultButton } from 'src/elements-v2/buttons';
import { generateDownload } from '../AvatarChangeCard/util/cropImage';

interface Props {
  space?: Space;
  onUpload: (base64: string) => void;
}

const SpaceCoverPhoto: React.FC<Props> = ({ space, onUpload }: Props) => {
  const [imagePreview, setImagePreview] = useState<any>('');
  const [defaultImage, setDefaultImage] = useState('');
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [isImage, setIsImage] = useState<boolean>(false);
  const [croppedArea, setCroppedArea] = useState<any>();
  const [crop, setCrop] = useState<any>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<any>(1);
  const [image, setImage] = useState<any>();

  useEffect(() => {
    setDefaultImage(space?.coverPhoto || defaultCoverPhoto);
  }, [space]);

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
        setImage(reader.result);
        setImagePreview(reader.result);
        setDefaultImage(file);
        setIsEdit(true);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const remove = () => {
    setImagePreview('');
    setImage('');
    setDefaultImage(space?.coverPhoto || defaultCoverPhoto);
    setIsEdit(false);
  };

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
                  id="file_cover_photo"
                  accept=".jpef, .png, .jpg"
                  onChange={photoUpload}
                  src={imagePreview}
                />
                <StyledUploadLabel htmlFor="file_cover_photo">
                  Edit
                </StyledUploadLabel>
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
                  variant="contained"
                  btnColor="primary-gradient"
                  size="small"
                  onClick={async () => {
                    if (imagePreview) {
                      await onUpload(imagePreview);
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

export default SpaceCoverPhoto;
