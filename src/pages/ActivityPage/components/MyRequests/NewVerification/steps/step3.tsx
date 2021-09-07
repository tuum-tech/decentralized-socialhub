import React, { useState } from 'react';

import arrowLeft from 'src/assets/icon/arrow-left-square.svg';
import { SearchService } from 'src/services/search.service';
import { Container, NextButton } from './step1';

interface Props {
  selectedDids: string[];
  credentials: VerificationData[];
  onPrev: () => void;
  session: ISessionItem;
}

const UsersView = ({ selectedDids, credentials, session, onPrev }: Props) => {
  return (
    <Container>
      <img
        onClick={() => onPrev()}
        src={arrowLeft}
        alt="arrow-left"
        className="mb-1"
      />
      <div className="title mb-2">Choose Verifiers</div>
      <div className="intro mb-2" style={{ color: 'black' }}>
        Select user(s) to verify your credentials
        <span style={{ color: 'red' }}>(max 3 users)</span>
      </div>

      <NextButton onClick={() => {}}>Continue</NextButton>
    </Container>
  );
};

export default UsersView;
