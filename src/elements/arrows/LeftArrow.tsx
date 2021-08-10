import React from 'react';

interface Props {
  fill?: string;
  onClick?: () => void;
}

const LeftArrow: React.FC<Props> = ({ fill = 'white', onClick }) => {
  return (
    <div
      onClick={() => {
        if (onClick) onClick();
      }}
    >
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
          d="M16 6.5C16 7.01284 15.5523 7.42857 15 7.42857L3.41421 7.42857L7.70711 11.4148C8.09763 11.7775 8.09763 12.3654 7.70711 12.728C7.31658 13.0907 6.68341 13.0907 6.29289 12.728L0.292891 7.1566C-0.0976326 6.79397 -0.0976325 6.20603 0.292891 5.8434L6.29289 0.271971C6.68342 -0.0906591 7.31658 -0.090659 7.70711 0.271971C8.09763 0.634601 8.09763 1.22254 7.70711 1.58517L3.41421 5.57143L15 5.57143C15.5523 5.57143 16 5.98716 16 6.5Z"
          fill={fill}
        />
      </svg>
    </div>
  );
};

export default LeftArrow;
