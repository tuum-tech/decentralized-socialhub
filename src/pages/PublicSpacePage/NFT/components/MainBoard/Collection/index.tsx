import React, { useEffect, useState } from 'react';
import {
  IonRow,
  IonCol,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/react';
import { Wrapper } from '../common';
import Item from './Item';
import { getNFTCollectionAssets } from '../../../fetchapi';
interface IProps {
  space: any;
}

const Collection: React.FC<IProps> = ({ space }: IProps) => {
  const [assets, setAssets] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState(0);
  const limit = 9;

  const fetchMoreData = async () => {
    const { data }: any = await getNFTCollectionAssets(
      space.guid,
      offset,
      limit
    );
    const { assets: _assets_ } = data;
    if (_assets_.length > 0) {
      setOffset(offset + limit);
      setAssets(
        assets.concat(
          _assets_.map((asset: any) => ({
            ...asset,
            collection: space.meta.slug
          }))
        )
      );
    } else {
      setHasMore(false);
    }
  };
  useEffect(() => {
    (async () => {
      if (space && space.guid) {
        await fetchMoreData();
      }
    })();
  }, [space]);
  const searchNext = async ($event: CustomEvent<void>) => {
    await fetchMoreData();
    ($event.target as HTMLIonInfiniteScrollElement).complete();
  };
  return (
    <Wrapper>
      <IonRow>
        {assets.map((asset, index) => {
          return (
            <IonCol size="4" key={index}>
              <Item data={asset} />
            </IonCol>
          );
        })}
      </IonRow>
      <IonInfiniteScroll
        threshold="100px"
        disabled={!hasMore}
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

export default Collection;
