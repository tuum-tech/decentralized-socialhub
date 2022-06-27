import React from 'react';
import {
  IonRow,
  IonCol,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/react';
import { down } from 'styled-breakpoints';
import styled from 'styled-components';

import Item from './Item';

export const Wrapper = styled.div`
  padding: 3px 13px;
  > ion-row > ion-col {
    padding: 6px 13px;
  }

  ${down('sm')} {
    padding: 3px 0;
    > ion-row > ion-col {
      padding: 6px 0;
    }
  }
`;
interface IProps {
  nfts: any[];
  fetchMoreEthData: () => void;
  fetchMoreEscData: () => void;
}

const DashboardNFTs: React.FC<IProps> = ({
  nfts,
  fetchMoreEthData,
  fetchMoreEscData
}: IProps) => {
  const searchNext = async ($event: CustomEvent<void>) => {
    await fetchMoreEthData();
    await fetchMoreEscData();
    ($event.target as HTMLIonInfiniteScrollElement).complete();
  };

  return (
    <Wrapper>
      <IonRow>
        {nfts.map((asset, index) => {
          return (
            <IonCol sizeXs="12" sizeSm="4" key={index}>
              <Item data={asset} />
            </IonCol>
          );
        })}
      </IonRow>
      <IonInfiniteScroll
        threshold="100px"
        onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}
      >
        <IonInfiniteScrollContent
          loadingSpinner="bubbles"
          loadingText="Loading more assets..."
        ></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </Wrapper>
  );
};

export default DashboardNFTs;
