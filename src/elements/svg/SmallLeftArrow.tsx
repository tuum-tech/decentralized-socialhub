import React from 'react';
interface Props {
  fill?: string;
}

const SmallLeftArrow: React.FC<Props> = ({ fill = 'white' }) => {
  return (
    <svg
      width="8"
      height="7"
      viewBox="0 0 8 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 3.5C8 3.77614 7.77614 4 7.5 4H1.70711L3.85355 6.14645C4.04882 6.34171 4.04882 6.65829 3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355L0.146446 3.85355C-0.0488157 3.65829 -0.0488157 3.34171 0.146446 3.14645L3.14645 0.146447C3.34171 -0.0488155 3.65829 -0.0488155 3.85355 0.146447C4.04882 0.341709 4.04882 0.658292 3.85355 0.853554L1.70711 3L7.5 3C7.77614 3 8 3.22386 8 3.5Z"
        fill={fill}
      />
    </svg>
  );
};

export default SmallLeftArrow;
