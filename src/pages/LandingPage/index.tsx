import React from 'react';
import { IonPage } from '@ionic/react';
import styled from 'styled-components';

import Footer from './components/Footer';
import Hero from './components/Hero';

const Container = styled(IonPage)`
  overflow: auto;
`;

const LandingPage = () => {
  return (
    <Container>
      <Hero />
      <Footer />
    </Container>
  );
};

export default LandingPage;
