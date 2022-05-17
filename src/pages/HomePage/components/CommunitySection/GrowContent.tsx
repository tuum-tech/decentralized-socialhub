import React from 'react';
import { Fade } from 'react-awesome-reveal';

import style from './style.module.scss';
import grow from 'src/assets/new/grow.svg';
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
            <Fade direction="up" triggerOnce={true} cascade>
              <SectionSubTitle className="subtitle">
                Substantially grow your community
              </SectionSubTitle>
              <SectionText className="text">
                Enable peer-to-peer chat as another means to authentically
                connect with your community.
              </SectionText>
            </Fade>
          </div>
        </ContentContainer>
      </div>
    </MainLayout>
  );
};

export default GrowContent;
