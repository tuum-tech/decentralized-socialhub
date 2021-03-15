import React from 'react';

interface Props {
  fill?: string;
}

const RightArrow: React.FC<Props> = ({ fill = 'white' }) => {
  return (
    <svg
      width="16"
      height="13"
      viewBox="0 0 16 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.68248e-07 6.5C6.13082e-07 5.98716 0.447716 5.57143 1 5.57143L12.5858 5.57143L8.29289 1.58517C7.90237 1.22254 7.90237 0.634602 8.29289 0.271973C8.68342 -0.0906565 9.31658 -0.0906564 9.70711 0.271974L15.7071 5.8434C16.0976 6.20603 16.0976 6.79397 15.7071 7.1566L9.70711 12.728C9.31658 13.0907 8.68342 13.0907 8.29289 12.728C7.90237 12.3654 7.90237 11.7775 8.29289 11.4148L12.5858 7.42857L1 7.42857C0.447716 7.42857 5.23415e-07 7.01284 5.68248e-07 6.5Z"
        fill={fill}
      />
    </svg>
  );
};

export default RightArrow;
