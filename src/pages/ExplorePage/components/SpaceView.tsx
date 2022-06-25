import React, { useState, useEffect, useMemo } from 'react';
import { IonRow } from '@ionic/react';
import { setTimeout, clearTimeout } from 'timers';
import RequestCommunity from './RequestCommunity';

import LoadingIndicator from 'src/elements/LoadingIndicator';
import SpaceListView from 'src/components/Space/SpaceListView';
import { SpaceService } from 'src/services/space.service';
import NoDataCard from 'src/components/NoDataCard';
import welcomeSpacesImg from 'src/assets/nodata/welcome-spaces.svg';
import { DefaultButton } from 'src/elements-v2/buttons';
import { SectionText } from 'src/pages/HomePage/components/CommunitySection';
import style from 'src/pages/HomePage/components/CommunitySection/style.module.scss';

interface Props {
  searchKeyword?: string;
}

const categories = [
  {
    id: 'all',
    label: 'All'
  },
  {
    id: 'NFT Collection',
    label: 'NFT Collection'
  },
  {
    id: 'Welcome to Profile',
    label: 'Welcome to Profile'
  },
  {
    id: 'Personal Group',
    label: 'Personal Group'
  },
  {
    id: 'Creator',
    label: 'Creator'
  },
  {
    id: 'Business',
    label: 'Business'
  },
  {
    id: 'DAO',
    label: 'DAO'
  },
  {
    id: 'Personal NFT Group',
    label: 'Personal NFT Group'
  }
];

const SpaceView: React.FC<Props> = ({ searchKeyword }: Props) => {
  // const loading = useSelector(state => selectSpacesLoading(state));
  // const spaces = useSelector(state => selectSpaces(state));
  const [loading, setLoading] = useState(false);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredSpaces = useMemo(() => {
    const temp =
      selectedCategory === 'all'
        ? spaces
        : spaces.filter(v => v.category === selectedCategory);
    if (searchKeyword) {
      return temp.filter(
        v => v.name.includes(searchKeyword) || v.owner?.includes(searchKeyword)
      );
    }
    return temp;
  }, [spaces, searchKeyword, selectedCategory]);

  const refreshSpaces = async (anim: boolean = false) => {
    // dispatch(fetchSpaces());
    anim && setLoading(true);
    const _spaces = await SpaceService.getAllSpaces();
    setSpaces(_spaces);
    anim && setLoading(false);
  };

  useEffect(() => {
    // dispatch(fetchSpaces(true));
    refreshSpaces(true);

    let timer = setTimeout(function start() {
      refreshSpaces();
      timer = setTimeout(start, 5000);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingIndicator loadingText="loading spaces..." />
      ) : (
        <>
          <IonRow style={{ padding: '10px' }}>
            {categories.map(v => (
              <DefaultButton
                size="default"
                variant="outlined"
                btnColor={
                  selectedCategory === v.id ? 'primary-gradient' : undefined
                }
                textType={selectedCategory === v.id ? 'gradient' : 'normal'}
                onClick={() => setSelectedCategory(v.id)}
                className={style['button']}
                key={v.id}
              >
                <SectionText>{v.label}</SectionText>
              </DefaultButton>
            ))}
          </IonRow>
          {filteredSpaces.length ? (
            <>
              <RequestCommunity />
              <SpaceListView spaces={filteredSpaces} explore={true} />
            </>
          ) : (
            <>
              <NoDataCard
                img={welcomeSpacesImg}
                title="Welcome to Profile Spaces"
                description="Connect with your favorite communities and individuals across the Web3 ecosystem"
                noBorder={false}
              />
              <RequestCommunity />
            </>
          )}
        </>
      )}
    </>
  );
};

export default SpaceView;
