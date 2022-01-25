import React from 'react';

import style from './style.module.scss';
import grow from 'src/assets/new/grow.png';
import { SectionSubTitle, SectionText } from '../../index';
import { MainLayout } from '../../components/AboutSection';
import { ContentContainer } from './MonetizeContent';

const GrowContent = () => {
  return (
    <MainLayout>
      <div className={style['community']}>
        <ContentContainer>
          <div className="item">
            <img src={grow} alt="community" />
          </div>
          <div className="item">
            <SectionSubTitle className="subtitle">
              Substantially grow your communitye
            </SectionSubTitle>
            <SectionText className="text">
              Enable peer-to-peer chats​​ as another means to authentically
              connect with your community.
            </SectionText>
          </div>
        </ContentContainer>
      </div>
    </MainLayout>
  );
};

export default GrowContent;