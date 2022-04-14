import React, { useMemo } from 'react';
import styled from 'styled-components';

const RightSvgContainer = styled.div`
  width: 44px;
  svg {
    display: block;
    margin: 0 auto;
  }
`;

export const ArrowUpSvg = ({ fill = 'black' }) => (
  <RightSvgContainer>
    <svg
      width="12"
      height="6"
      viewBox="0 0 12 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.0205 5.68558C10.843 5.8631 10.5653 5.87923 10.3695 5.734L10.3134 5.68558L6.00033 1.3727L1.68721 5.68558C1.5097 5.8631 1.23193 5.87923 1.03618 5.734L0.980105 5.68558C0.802594 5.50807 0.786457 5.2303 0.931693 5.03456L0.980105 4.97848L5.64677 0.311812C5.82428 0.134301 6.10206 0.118163 6.2978 0.2634L6.35388 0.311812L11.0205 4.97848C11.2158 5.17374 11.2158 5.49032 11.0205 5.68558Z"
        fill={fill}
      />
    </svg>
  </RightSvgContainer>
);

export const ArrowDownSvg = ({ fill = 'black' }) => (
  <RightSvgContainer>
    <svg
      width="12"
      height="6"
      viewBox="0 0 12 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.979454 0.314415C1.15697 0.136904 1.43474 0.120767 1.63048 0.266003L1.68656 0.314415L5.99967 4.6273L10.3128 0.314415C10.4903 0.136904 10.7681 0.120767 10.9638 0.266003L11.0199 0.314415C11.1974 0.491926 11.2135 0.769702 11.0683 0.965443L11.0199 1.02152L6.35323 5.68819C6.17572 5.8657 5.89794 5.88184 5.7022 5.7366L5.64612 5.68819L0.979454 1.02152C0.784192 0.82626 0.784192 0.509677 0.979454 0.314415Z"
        fill={fill}
      />
    </svg>
  </RightSvgContainer>
);

const LeftSvgContainer = styled.div`
  margin-right: 20px;
  svg {
    display: block;
    margin: 0 auto;
  }
`;

export const MenuIcon = ({
  name,
  active = false
}: {
  name: string;
  active: boolean;
}) => {
  const imgSrc = useMemo(
    () => require(`src/assets/sidebar/${name}${active ? '-active' : ''}.svg`),
    [name, active]
  );

  return (
    <LeftSvgContainer>
      <img src={imgSrc} alt={`${name}${active ? '-active' : ''}`} />
    </LeftSvgContainer>
  );
};
