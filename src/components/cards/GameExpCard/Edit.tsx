import React from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import StarRatings from 'react-star-ratings';

import SmallTextInput from '../../../elements/inputs/SmallTextInput';
import { MODE, MyTextarea, StyledLabel } from '../common';

export const pattern = new RegExp('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$');

interface GameExpItemProps {
  gameExpItem: GameExpItem;
  handleChange: any;
  mode: MODE;
}

const GameExpCardEdit: React.FC<GameExpItemProps> = ({
  gameExpItem,
  handleChange,
  mode
}: GameExpItemProps) => {
  const onRating = (rate: number) => {
    handleChange({ target: { name: 'like', value: rate } });
  };
  return (
    <IonGrid>
      <IonRow class="ion-justify-content-start">
        <IonCol size="12">
          <SmallTextInput
            label="Name"
            placeholder="e.g. War craft"
            name="name"
            hasError={mode === MODE.ERROR && !gameExpItem.name}
            value={gameExpItem.name}
            onChange={handleChange}
          />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start mt-3">
        <IonCol size="12">
          <StyledLabel>Description</StyledLabel>
          <MyTextarea
            rows={3}
            name="description"
            placeholder="..."
            value={gameExpItem.description}
            onIonChange={handleChange}
          />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="12">
          <StarRatings
            rating={gameExpItem.like}
            starRatedColor="orange"
            starHoverColor="orange"
            starDimension="30px"
            starSpacing="5px"
            changeRating={onRating}
            numberOfStars={5}
            name="like"
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default GameExpCardEdit;
