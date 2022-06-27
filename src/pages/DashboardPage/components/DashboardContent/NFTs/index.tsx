import React, { useEffect, useState } from 'react';
import {
  IonRow,
  IonCol,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/react';
import { down } from 'styled-breakpoints';
import styled from 'styled-components';
import request from 'src/baseplate/request';

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
}

const DashboardNFTs: React.FC<IProps> = ({ nfts }: IProps) => {
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
    </Wrapper>
  );
};

export default DashboardNFTs;
