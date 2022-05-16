import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { IonRow } from '@ionic/react';

import SpaceListView from 'src/components/Space/SpaceListView';
import { selectSpaces } from 'src/store/spaces/selectors';
import { DefaultButton } from 'src/elements-v2/buttons';
import GrowContent from './GrowContent';
import MonetizeContent from './MonetizeContent';
import { SectionTitle } from '../../index';
import { MainLayout } from '../../components/AboutSection';
import style from './style.module.scss';
import community from 'src/assets/new/community.svg';

export const SectionText = styled.p`
  font-family: SF Pro Display;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 35px;
  color: #04032b;

  @media only screen and (max-width: 600px) {
    font-size: 15px;
    line-height: 24px;
    text-align: center;
  }
`;
interface Props {
  refProp: any;
}

const CommunitySection: React.FC<Props> = ({ refProp }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const spaces = useSelector(state => selectSpaces(state));

  const filteredSpaces = useMemo(() => {
    if (selectedCategory === 'all') {
      return spaces;
    }
    return spaces.filter(v => v.category === selectedCategory);
  }, [spaces, selectedCategory]);

  return (
    <>
      <MainLayout ref={refProp}>
        <div className={style['community']}>
          <SectionTitle>Community</SectionTitle>
          <IonRow className={style['row']}>
            <DefaultButton
              size="default"
              variant="outlined"
              btnColor={
                selectedCategory === 'all' ? 'primary-gradient' : undefined
              }
              textType={selectedCategory === 'all' ? 'gradient' : 'normal'}
              onClick={() => setSelectedCategory('all')}
              className={style['button']}
            >
              <SectionText>All</SectionText>
            </DefaultButton>
            <DefaultButton
              size="default"
              variant="outlined"
              btnColor={
                selectedCategory === 'Welcome to Profile'
                  ? 'primary-gradient'
                  : undefined
              }
              textType={
                selectedCategory === 'Welcome to Profile'
                  ? 'gradient'
                  : 'normal'
              }
              onClick={() => setSelectedCategory('Welcome to Profile')}
              className={style['button']}
            >
              <SectionText>Welcome to Profile</SectionText>
            </DefaultButton>
            <DefaultButton
              size="default"
              variant="outlined"
              btnColor={
                selectedCategory === 'Personal Group'
                  ? 'primary-gradient'
                  : undefined
              }
              textType={
                selectedCategory === 'Personal Group' ? 'gradient' : 'normal'
              }
              onClick={() => setSelectedCategory('Personal Group')}
              className={style['button']}
            >
              <SectionText>Personal Group</SectionText>
            </DefaultButton>
            <DefaultButton
              size="default"
              variant="outlined"
              btnColor={
                selectedCategory === 'NFT Collection'
                  ? 'primary-gradient'
                  : undefined
              }
              textType={
                selectedCategory === 'NFT Collection' ? 'gradient' : 'normal'
              }
              onClick={() => setSelectedCategory('NFT Collection')}
              className={style['button']}
            >
              <SectionText>NFT Collection</SectionText>
            </DefaultButton>
          </IonRow>

          <SpaceListView spaces={filteredSpaces} />
        </div>
      </MainLayout>

      <MonetizeContent />
      <GrowContent />
    </>
  );
};

export default CommunitySection;
