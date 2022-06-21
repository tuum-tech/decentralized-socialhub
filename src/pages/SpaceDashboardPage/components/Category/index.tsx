import React, { useEffect, useState } from 'react';
import {
  IonCardTitle,
  IonRadioGroup,
  IonRadio,
  IonLabel,
  IonList,
  IonItem
} from '@ionic/react';
import styled from 'styled-components';
import {
  CardOverview,
  CardHeaderContent,
  CardContentContainer
} from 'src/components/cards/common';

import { CategoriesForPrivateSpace } from 'src/services/space.service';

const CardWrapper = styled(CardOverview)`
  overflow: visible;
`;
interface IProps {
  profile: any;
  update: (selected: string) => void;
}

const Category: React.FC<IProps> = ({ profile, update }: IProps) => {
  const [selected, setSelected] = useState<string>(profile.category);
  const onSelect = (value: string) => {
    setSelected(value);
    update(value);
  };
  useEffect(() => {}, []);
  return (
    <CardWrapper template={'default'}>
      <CardHeaderContent>
        <IonCardTitle>Category</IonCardTitle>
      </CardHeaderContent>
      <CardContentContainer>
        <IonList>
          <IonRadioGroup
            value={selected}
            onIonChange={e => onSelect(e.detail.value)}
          >
            {CategoriesForPrivateSpace.map((category, index) => (
              <IonItem key={index}>
                <IonLabel>{category}</IonLabel>
                <IonRadio slot="start" value={category} />
              </IonItem>
            ))}
          </IonRadioGroup>
        </IonList>
      </CardContentContainer>
    </CardWrapper>
  );
};

export default Category;
