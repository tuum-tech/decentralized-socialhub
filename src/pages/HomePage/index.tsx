import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { IonPage } from '@ionic/react';
import styled from 'styled-components';

import Footer from './components/Footer';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import UtilitySection from './components/UtilitySection';
import CommunitySection from './components/CommunitySection';
import OwnershipSection from './components/OwnershipSection';
import Toast from './components/Toast';
import { fetchSpaces } from 'src/store/spaces/actions';

// import ConnectSection from './components/ConnectSection';

const Page = styled(IonPage)`
  overflow: auto;
`;

export const SectionTitle = styled.p`
  font-family: SF Pro Display;
  font-style: normal;
  font-weight: 600;
  font-size: 60px;
  line-height: 65px;
  text-align: center;

  background: -webkit-linear-gradient(#995aff, #dc59bf);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

  @media only screen and (max-width: 600px) {
    font-size: 40px;
    line-height: 48px;
  }
`;

export const SectionSubTitle = styled.p`
  font-family: SF Pro Display;
  font-style: normal;
  font-weight: 500;
  font-size: 45px;
  line-height: 48px;
  color: #000000;

  @media only screen and (max-width: 600px) {
    font-size: 40px;
    line-height: 45px;
  }
`;

export const SectionIntro = styled.p`
  font-family: SF Pro Display;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 30px;
  color: #000000;

  margin-bottom: 20px;

  @media only screen and (max-width: 600px) {
    font-size: 20px;
    line-height: 25px;
    text-align: center;

    margin-left: auto;
    margin-right: auto;
    max-width: 53%;
  }
`;

export const SectionText = styled.p`
  font-family: SF Pro Display;
  font-style: normal;
  font-weight: 300;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: 0.02em;
  color: #4a5568;

  @media only screen and (max-width: 600px) {
    font-size: 15px;
    line-height: 24px;
    text-align: center;

    max-width: 74%;
    margin-left: auto;
    margin-right: auto;
  }
`;

const hasWindow = typeof window !== 'undefined';

function getWindowDimensions() {
  const width = hasWindow ? window.innerWidth : null;
  const height = hasWindow ? window.innerHeight : null;
  return {
    width,
    height
  };
}

const HomePage = () => {
  const dispatch = useDispatch();
  const aboutRef = useRef<typeof HTMLDivElement>(null);
  const utilityRef = useRef(null);
  const communityRef = useRef(null);
  const ownershipRef = useRef(null);
  const connectRef = useRef(null);
  const pageRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    dispatch(fetchSpaces(true));
  }, [dispatch]);

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const scrollTo = (target: string) => {
    if (target === 'About') {
      (aboutRef.current as any).scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'Utility') {
      (utilityRef.current as any).scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'Community') {
      (communityRef.current as any).scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'Ownership') {
      (ownershipRef.current as any).scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'Connect') {
      (connectRef.current as any).scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Page ref={pageRef}>
      {isVisible && <Toast onClose={() => setIsVisible(false)} />}

      <Hero navItemClicked={scrollTo} windowDimensions={windowDimensions} />

      <AboutSection refProp={aboutRef} />
      <UtilitySection refProp={utilityRef} />
      <CommunitySection
        refProp={communityRef}
        windowDimensions={windowDimensions}
      />
      <OwnershipSection refProp={ownershipRef} />
      {/* <ConnectSection refProp={connectRef} /> */}
      <Footer refProp={connectRef} rootRef={pageRef} />
    </Page>
  );
};

export default HomePage;
