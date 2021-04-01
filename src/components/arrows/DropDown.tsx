import React from 'react';

interface Props {
  fill?: string;
}

const DropDown: React.FC<Props> = ({ fill = '#A0AEC0' }) => {
  return (
    <svg
      width="12"
      height="7"
      viewBox="0 0 12 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.4433 0.928244L10.3075 0.927437L5.99845 4.86453L1.68939 0.926186L1.55342 0.927154L0.931492 1.51205L0.931439 1.65769L5.61936 6.0728L5.68792 6.1H6.30896L6.37748 6.07283L11.0685 1.65899L11.0683 1.51314L10.4433 0.928244Z"
        stroke-width="0.2"
        stroke-linejoin="bevel"
        fill={fill}
        stroke={fill}
      />
    </svg>
  );
};

export default DropDown;
