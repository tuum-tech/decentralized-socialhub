import React, { useState, useEffect } from 'react';
import { IonRow, IonCardTitle, IonCol, IonGrid } from '@ionic/react';
import styled from 'styled-components';
import {
  CardOverview,
  CardHeaderContent,
  CardContentContainer
} from 'src/components/cards/common';
import { LinkStyleSpan } from '../MainBoard/common';
import { getNFTCollectionAssets } from '../../fetchapi';
import defaultNFT from 'src/assets/default/nft.png';

const Grid = styled(IonGrid)`
  --ion-grid-padding: 0px;
  img {
    border-radius: 20px;
    padding: 5px;
  }
`;
interface IProps {
  template?: string;
  space: any;
  viewAll: () => void;
}

const Collection: React.FC<IProps> = ({
  template = 'default',
  space,
  viewAll
}: IProps) => {
  const [assets, setAssets] = useState<any[]>([]);
  const flattenUrl = (url: string) => {
    if (url && url.includes('ipfs://ipfs'))
      return url.replace('ipfs://ipfs', 'https://ipfs.io/ipfs/');
    if (url && url.includes('ipfs://'))
      return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
    return url;
  };
  useEffect(() => {
    (async () => {
      if (space && space.guid) {
        const { data }: any = await getNFTCollectionAssets(space.guid, 0, 9);
        setAssets(data.assets || []);
      }
    })();
  }, [space]);
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
        {assets.length > 0 ? (
          <Grid>
            <IonRow>
              {assets.slice(0, 3).map((asset, index) => {
                return (
                  <IonCol size="4" key={index}>
                    <img
                      src={
                        asset.image_url
                          ? flattenUrl(asset.image_url)
                          : defaultNFT
                      }
                      alt={asset.name}
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
                      src={
                        asset.image_url
                          ? flattenUrl(asset.image_url)
                          : defaultNFT
                      }
                      alt={asset.name}
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
                      src={
                        asset.image_url
                          ? flattenUrl(asset.image_url)
                          : defaultNFT
                      }
                      alt={asset.name}
                    />
                  </IonCol>
                );
              })}
            </IonRow>
          </Grid>
        ) : (
          `No collections yet`
        )}
      </CardContentContainer>
    </CardOverview>
  );
};

export default Collection;
