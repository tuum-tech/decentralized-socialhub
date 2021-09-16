/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { IonCard, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/react';
import { setTimeout } from 'timers';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from './types';
import { UserService } from 'src/services/user.service';
import { ProfileService } from 'src/services/profile.service';
import { SmallLightButton } from 'src/elements/buttons';

import { CardHeaderContent, CardContentContainer } from '../common';

import defaultCoverPhoto from '../../../assets/cover/default.png';
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
  const [file, setFile] = useState<string>();
  const [name, setName] = useState<string>();
  const [size, setSize] = useState<string>();

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
