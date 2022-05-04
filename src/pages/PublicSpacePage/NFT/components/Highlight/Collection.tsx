import React from 'react';
import { IonRow, IonCardTitle, IonCol, IonGrid } from '@ionic/react';
import styled from 'styled-components';
import {
  CardOverview,
  CardHeaderContent,
  CardContentContainer
} from 'src/components/cards/common';
import { LinkStyleSpan } from '../MainBoard/common';

const Grid = styled(IonGrid)`
  --ion-grid-padding: 0px;
  img {
    border-radius: 20px;
    padding: 5px;
  }
`;
interface IProps {
  template?: string;
  assets: any[];
  viewAll: () => void;
}

const Collection: React.FC<IProps> = ({
  template = 'default',
  assets,
  viewAll
}: IProps) => {
  const flattenUrl = (url: string) => {
    if (url.startsWith('ipfs://'))
      return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
    return url;
  };
  return (
    <CardOverview template={template}>
      <CardHeaderContent>
        <IonRow className="ion-justify-content-between ion-no-padding">
          <IonCol className="ion-no-padding">
            <IonCardTitle>NFT Collection</IonCardTitle>
          </IonCol>
          <IonCol size="auto" className="ion-no-padding">
            <LinkStyleSpan onClick={viewAll}>View all</LinkStyleSpan>
          </IonCol>
        </IonRow>
      </CardHeaderContent>
      <CardContentContainer>
        <Grid>
          <IonRow>
            {assets.slice(0, 3).map((asset, index) => {
              return (
                <IonCol size="4" key={index}>
                  <img
                    src={flattenUrl(asset.image_url)}
                    alt={asset.image_url}
                  />
                </IonCol>
              );
            })}
          </IonRow>
          <IonRow>
            {assets.slice(3, 6).map((asset, index) => {
              return (
                <IonCol size="4" key={index + 3}>
                  <img
                    src={flattenUrl(asset.image_url)}
                    alt={asset.image_url}
                  />
                </IonCol>
              );
            })}
          </IonRow>
          <IonRow>
            {assets.slice(6, 9).map((asset, index) => {
              return (
                <IonCol size="4" key={index + 6}>
                  <img
                    src={flattenUrl(asset.image_url)}
                    alt={asset.image_url}
                  />
                </IonCol>
              );
            })}
          </IonRow>
        </Grid>
      </CardContentContainer>
    </CardOverview>
  );
};

export default Collection;
