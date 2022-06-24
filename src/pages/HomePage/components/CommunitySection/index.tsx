import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { IonRow } from '@ionic/react';
import { Fade } from 'react-awesome-reveal';

import SpaceListView from 'src/components/Space/SpaceListView';
import { selectSpaces } from 'src/store/spaces/selectors';
import { DefaultButton } from 'src/elements-v2/buttons';
import GrowContent from './GrowContent';
import MonetizeContent from './MonetizeContent';
import { SectionTitle } from '../../index';
import { MainLayout } from '../../components/AboutSection';
import style from './style.module.scss';

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

const SignUpButton = styled.button`
  height: 54px;
  width: 211px;
  line-height: 25px;
  background: linear-gradient(145.76deg, #995aff 14.97%, #dc59bf 87.23%);
  border-radius: 10px;

  font-family: SF Pro Display;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  color: #ffffff;
  margin-top: 30px;
`;

interface Props {
  refProp: any;
  windowDimensions: {
    width: number | null;
    height: number | null;
  };
}

const categories = [
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
  }
];

const CommunitySection: React.FC<Props> = ({ refProp, windowDimensions }) => {
  const [selectedCategory, setSelectedCategory] = useState('NFT Collection');
  const spaces = useSelector(state => selectSpaces(state));
  const history = useHistory();

  const filteredSpaces = useMemo(() => {
    return spaces.filter(v => v.category === selectedCategory);
  }, [spaces, selectedCategory]);

  return (
    <>
      <MainLayout ref={refProp}>
        <div className={style['community']}>
          <Fade direction="up" triggerOnce={true} cascade>
            <SectionTitle>Community</SectionTitle>
          </Fade>
          <IonRow className={style['row']}>
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

          <SpaceListView
            spaces={filteredSpaces}
            explore={true}
            isVisiblePageCount={false}
            pageCount={6}
          />
          <IonRow className="ion-justify-content-center">
            <SignUpButton onClick={() => history.push('/create-profile')}>
              Sign up & explore all
            </SignUpButton>
          </IonRow>
        </div>
      </MainLayout>

      <MonetizeContent windowDimensions={windowDimensions} />
      <GrowContent />
    </>
  );
};

export default CommunitySection;
