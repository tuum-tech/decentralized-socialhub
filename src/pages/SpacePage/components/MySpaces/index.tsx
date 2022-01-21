import React from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

import SpaceCard from './SpaceCard';
interface Props {
  session: ISessionItem;
  spaces: Space[];
}
const MySpaces: React.FC<Props> = ({ session, spaces }: Props) => {
  const renderSpaceCol = (space: Space, index: number) => {
    return (
      <IonCol size="4" key={index}>
        <SpaceCard space={space} />
      </IonCol>
    );
  };
  return (
    <>
      <IonGrid>
        <IonRow>
          {spaces.map((space, index) => renderSpaceCol(space, index))}
        </IonRow>
      </IonGrid>
    </>
  );
};

export default MySpaces;
