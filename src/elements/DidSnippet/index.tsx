import React from 'react';
import { IonText } from '@ionic/react';
import styled from 'styled-components';

const SnippetSvg = ({ color = '#979797' }) => (
  <svg
    width="10"
    height="11"
    viewBox="0 0 10 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      display: 'inline'
    }}
  >
    <g clip-path="url(#clip0)">
      <path
        d="M7.85538 5.9706V6.51338C7.85751 7.99602 7.50517 9.45716 6.82847 10.772L6.70658 11L5.76974 10.4713C6.39605 9.33471 6.7422 8.06187 6.77878 6.76088L6.78307 6.51338V5.9706H7.85538ZM4.63845 4.34225H5.71076V6.51338L5.70826 6.71927C5.6677 8.20532 5.16248 9.64002 4.26529 10.8169L4.14126 10.9743L3.31022 10.2868C4.12866 9.275 4.59442 8.01806 4.63524 6.71095L4.63845 6.51338V4.34225ZM5.17461 2.17113C5.88559 2.17113 6.56746 2.45706 7.0702 2.96601C7.57294 3.47497 7.85538 4.16526 7.85538 4.88503H6.78307C6.78307 4.45317 6.61361 4.039 6.31196 3.73362C6.01032 3.42825 5.6012 3.25669 5.17461 3.25669C4.74802 3.25669 4.3389 3.42825 4.03725 3.73362C3.73561 4.039 3.56614 4.45317 3.56614 4.88503V6.51338C3.56751 7.70947 3.13418 8.86427 2.34872 9.75776L2.23505 9.8826L1.45727 9.13356C2.0846 8.46918 2.45154 7.59631 2.48955 6.67802L2.49383 6.51338V4.88503C2.49383 4.16526 2.77627 3.47497 3.27901 2.96601C3.78176 2.45706 4.46362 2.17113 5.17461 2.17113ZM5.17461 5.08957e-06C6.45438 5.08957e-06 7.68174 0.514676 8.58668 1.4308C9.49161 2.34692 10 3.58944 10 4.88503V6.51338C9.99994 7.42596 9.89194 8.33526 9.67831 9.22185L9.6036 9.51423L8.57025 9.22728C8.78133 8.44185 8.89975 7.63387 8.92304 6.82023L8.92769 6.51338V4.88503C8.92769 4.17989 8.73386 3.48865 8.36788 2.88869C8.0019 2.28872 7.47821 1.8037 6.85544 1.4879C6.23266 1.1721 5.53535 1.03798 4.84156 1.10055C4.14777 1.16313 3.48487 1.41992 2.92705 1.8422L2.16321 1.0682C3.01751 0.375258 4.07992 -0.00159739 5.17461 5.08957e-06ZM1.40437 1.83641L2.16892 2.61006C1.70912 3.23053 1.44894 3.97915 1.42367 4.7544L1.42152 4.88503L1.42367 5.9706C1.4245 6.57013 1.28446 7.16126 1.01512 7.69519L0.93148 7.8526L0 7.31416C0.204792 6.95186 0.323379 6.54623 0.346356 6.12945L0.35136 5.9706V4.88503C0.34822 3.77692 0.719816 2.70109 1.40437 1.83641Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="10" height="11" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const TruncatedSpan = styled.span`
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProfileDesignation = styled(IonText)`
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.62;
  letter-spacing: normal;
  text-align: left;
  color: #979797;
`;

interface IProp {
  did: string;
  color?: string;
}

const DidSnippet: React.FC<IProp> = ({ did, color = '#979797' }: IProp) => {
  return (
    <ProfileDesignation>
      <SnippetSvg color={color} />
      &nbsp;<TruncatedSpan style={{ color: color }}>{did}</TruncatedSpan>
    </ProfileDesignation>
  );
};

export default DidSnippet;
