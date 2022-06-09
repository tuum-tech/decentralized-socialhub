import React from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

import style from './style.module.scss';

interface Props {
  contents: Version;
}

const ContentComponent: React.FC<Props> = ({ contents }: Props) => {
  return (
    <IonGrid className="ion-no-padding">
      {contents.releaseNotes &&
        contents.releaseNotes.map((v, index) => (
          <IonRow className={style['item']} key={index}>
            <IonCol size="auto" className="ion-no-padding">
              <p>{index + 1}. </p>
            </IonCol>
            <IonCol size="auto" className="ion-no-padding">
              <p className={style['item-left']}>{v}</p>
            </IonCol>
          </IonRow>
        ))}
      {contents.videoUpdateUrl && (
        <IonRow className="ion-justify-content-center">
          <iframe
            width="90%"
            height="200"
            src={contents.videoUpdateUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
            className={style['video']}
          />
        </IonRow>
      )}
    </IonGrid>
  );
};

export default ContentComponent;
