import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: 32px;
  height: 32px;

  background: #edf2f7;
  border-radius: 8px;

  position: absolute;
  right: 26px;
  top: 22px;
`;

interface Props {
  onClick: () => void;
}

const CloseButton: React.FC<Props> = ({ onClick }) => (
  <Container onClick={onClick}>
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.712087 0.712087C1.0782 0.345971 1.6718 0.345971 2.03791 0.712087L7 5.67418L11.9621 0.712087C12.3282 0.345971 12.9218 0.345971 13.2879 0.712087C13.654 1.0782 13.654 1.6718 13.2879 2.03791L8.32582 7L13.2879 11.9621C13.654 12.3282 13.654 12.9218 13.2879 13.2879C12.9218 13.654 12.3282 13.654 11.9621 13.2879L7 8.32582L2.03791 13.2879C1.6718 13.654 1.0782 13.654 0.712087 13.2879C0.345971 12.9218 0.345971 12.3282 0.712087 11.9621L5.67418 7L0.712087 2.03791C0.345971 1.6718 0.345971 1.0782 0.712087 0.712087Z"
        fill="black"
      />
    </svg>
  </Container>
);

export default CloseButton;
