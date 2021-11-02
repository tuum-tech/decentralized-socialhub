import React from 'react';

interface Props {
  fill?: string;
}

const DropUp: React.FC<Props> = ({ fill = '#A0AEC0' }) => {
  return (
    <svg
      width="12"
      height="7"
      viewBox="0 0 12 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.55673 6.07176L1.69251 6.07256L6.00155 2.13547L10.3106 6.07381L10.4466 6.07285L11.0685 5.48795L11.0686 5.34231L6.38064 0.927203L6.31208 0.9H5.69104L5.62252 0.92717L0.931474 5.34101L0.931674 5.48686L1.55673 6.07176Z"
        fill={fill}
        stroke={fill}
        strokeWidth="0.2"
        strokeLinejoin="bevel"
      />
    </svg>
  );
};

export default DropUp;
