import React from 'react';
import {
  IonRow,
  IonCardTitle,
  IonCol,
  IonGrid
} from '@ionic/react';
import styled from 'styled-components';
import { CardOverview, CardHeader, CardContent } from 'src/components/cards/common';
import { LinkStyleSpan } from '../MainBoard/common';
import img_nft_item from 'src/assets/space/nft_item.jpg';

const Grid = styled(IonGrid)`
  --ion-grid-padding: 0px;
  img {
      border-radius: 20px;
      padding: 5px;
  }
`;
interface IProps {
  template?: string;
}

const Collection: React.FC<IProps> = ({ template = 'default' }: IProps) => {
  return (
    <CardOverview template={template}>
      <CardHeader>
        <IonRow className="ion-justify-content-between ion-no-padding">
          <IonCol className="ion-no-padding">
            <IonCardTitle>NFT Collection</IonCardTitle>
          </IonCol>
          <IonCol size="auto" className="ion-no-padding">
            <LinkStyleSpan>View all</LinkStyleSpan>
          </IonCol>
        </IonRow>
      </CardHeader>
      <CardContent>
        <Grid>
          <IonRow>
            <IonCol size="4">
              <img src={img_nft_item} />
            </IonCol>
            <IonCol size="4">
              <img src={img_nft_item} />
            </IonCol>
            <IonCol size="4">
              <img src={img_nft_item} />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="4">
              <img src={img_nft_item} />
            </IonCol>
            <IonCol size="4">
              <img src={img_nft_item} />
            </IonCol>
            <IonCol size="4">
              <img src={img_nft_item} />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="4">
              <img src={img_nft_item} />
            </IonCol>
            <IonCol size="4">
              <img src={img_nft_item} />
            </IonCol>
            <IonCol size="4">
              <img src={img_nft_item} />
            </IonCol>
          </IonRow>
        </Grid>
      </CardContent>
    </CardOverview>
  );
};

export default Collection;
