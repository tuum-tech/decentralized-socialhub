import React from 'react';
import { Fade } from 'react-awesome-reveal';

import GrowContent from './GrowContent';
import MonetizeContent, { ContentContainer } from './MonetizeContent';
import { SectionTitle, SectionSubTitle, SectionText } from '../../index';
import { MainLayout } from '../../components/AboutSection';
import style from './style.module.scss';
import community from 'src/assets/new/community.svg';

interface Props {
  refProp: any;
}
const CommunitySection: React.FC<Props> = ({ refProp }) => {
  return (
    <>
      <MainLayout ref={refProp}>
        <div className={style['community']}>
          <Fade direction="up" triggerOnce={true} cascade>
            <SectionTitle>Community</SectionTitle>
          </Fade>
          <ContentContainer>
            <div className="item">
              <img src={community} alt="community" />
            </div>
            <div className="item">
              <Fade direction="up" triggerOnce={true} cascade>
                <SectionSubTitle className="subtitle">
                  Connect with other like-minded people
                </SectionSubTitle>
                <SectionText className="text">
                  Unlock access to new blockchain verified Web3 communities on
                  your own terms. Engage with like-minded and trustworthy
                  creators, thinkers, and doers to grow your social network and
                  create new opportunities.
                </SectionText>
              </Fade>
            </div>
          </ContentContainer>
        </div>
      </MainLayout>

      <MonetizeContent />
      <GrowContent />
    </>
  );
};

export default CommunitySection;
