import React, { useState, useEffect } from 'react';
import { IonRow, IonCardTitle, IonCardContent } from '@ionic/react';
import Multiselect from 'multiselect-react-dropdown';
import styled from 'styled-components';
import {
  CardOverview,
  CardHeaderContent,
  CardContentContainer
} from 'src/components/cards/common';

import style from './style.module.scss';

const CardWrapper = styled(CardOverview)`
  overflow: visible;
`;
interface IProps {
  profile: any;
  update: (selected: string[]) => void;
}

const Category: React.FC<IProps> = ({ profile, update }: IProps) => {
  const categories = [
    'Art',
    'Photography',
    'Games',
    'Music',
    'Movies',
    'Domain Names',
    'DeFi',
    'Memes',
    'NSFW',
    'Virtual Worlds',
    'Premium',
    'Esports',
    'Sports',
    'Collectables',
    'Trading Cards',
    'Entertainment',
    'Celebrity',
    'Influencer',
    'Avatar',
    'Fashion',
    'Events',
    'Membership',
    'Physical Goods',
    'Tickets',
    'Identification',
    'Certification',
    'Travel',
    'DAO',
    'Governance',
    'ERC-721',
    'ERC-1155',
    'Social Token'
  ];
  const onSelect = (selected: string[]) => {
    console.log(selected);
    update(selected);
  };
  const onDeselect = (selected: string[]) => {
    console.log(selected);
    update(selected);
  };
  useEffect(() => {}, []);
  return (
    <CardWrapper template={'default'}>
      <CardHeaderContent>
        <IonCardTitle>Category</IonCardTitle>
      </CardHeaderContent>
      <CardContentContainer>
        <Multiselect
          className={style['multiselect']}
          isObject={false}
          onRemove={onDeselect}
          onSelect={onSelect}
          avoidHighlightFirstOption={true}
          options={categories}
          selectedValues={profile.tags}
          style={{
            chips: {
              background: '#4c6fff'
            },
            option: {}
          }}
        />
      </CardContentContainer>
      <CardHeaderContent>
        <IonCardTitle>NetWork</IonCardTitle>
      </CardHeaderContent>
      <IonCardContent>{profile.meta?.network}</IonCardContent>
    </CardWrapper>
  );
};

export default Category;
