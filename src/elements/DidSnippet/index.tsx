import React, { useMemo } from 'react';
import { IonText, IonRow } from '@ionic/react';
import styled from 'styled-components';
import { useBreakpoint } from 'styled-breakpoints/react-styled';
import { down } from 'styled-breakpoints';

export const DidSnippetSvg = ({ color = '#979797' }) => (
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
    <g clipPath="url(#clip0)">
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

const CalendarSvg = () => (
  <svg
    width="15"
    height="22"
    viewBox="0 0 15 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      display: 'inline'
    }}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.875 7H1.125C0.50368 7 0 7.50368 0 8.125V14.875C0 15.4963 0.50368 16 1.125 16H7.875C8.49632 16 9 15.4963 9 14.875V8.125C9 7.50368 8.49632 7 7.875 7ZM0.5625 9.16964C0.5625 8.90336 0.81434 8.6875 1.125 8.6875H7.875C8.18566 8.6875 8.4375 8.90336 8.4375 9.16964V14.9554C8.4375 15.2216 8.18566 15.4375 7.875 15.4375H1.125C0.81434 15.4375 0.5625 15.2216 0.5625 14.9554V9.16964Z"
      fill="#313049"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.65625 10.9375C3.96691 10.9375 4.21875 10.6857 4.21875 10.375C4.21875 10.0643 3.96691 9.8125 3.65625 9.8125C3.34559 9.8125 3.09375 10.0643 3.09375 10.375C3.09375 10.6857 3.34559 10.9375 3.65625 10.9375Z"
      fill="#313049"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.34375 10.9375C5.65441 10.9375 5.90625 10.6857 5.90625 10.375C5.90625 10.0643 5.65441 9.8125 5.34375 9.8125C5.03309 9.8125 4.78125 10.0643 4.78125 10.375C4.78125 10.6857 5.03309 10.9375 5.34375 10.9375Z"
      fill="#313049"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.03125 10.9375C7.34191 10.9375 7.59375 10.6857 7.59375 10.375C7.59375 10.0643 7.34191 9.8125 7.03125 9.8125C6.72059 9.8125 6.46875 10.0643 6.46875 10.375C6.46875 10.6857 6.72059 10.9375 7.03125 10.9375Z"
      fill="#313049"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.96875 12.625C2.27941 12.625 2.53125 12.3732 2.53125 12.0625C2.53125 11.7518 2.27941 11.5 1.96875 11.5C1.65809 11.5 1.40625 11.7518 1.40625 12.0625C1.40625 12.3732 1.65809 12.625 1.96875 12.625Z"
      fill="#313049"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.65625 12.625C3.96691 12.625 4.21875 12.3732 4.21875 12.0625C4.21875 11.7518 3.96691 11.5 3.65625 11.5C3.34559 11.5 3.09375 11.7518 3.09375 12.0625C3.09375 12.3732 3.34559 12.625 3.65625 12.625Z"
      fill="#313049"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.34375 12.625C5.65441 12.625 5.90625 12.3732 5.90625 12.0625C5.90625 11.7518 5.65441 11.5 5.34375 11.5C5.03309 11.5 4.78125 11.7518 4.78125 12.0625C4.78125 12.3732 5.03309 12.625 5.34375 12.625Z"
      fill="#313049"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.03125 12.625C7.34191 12.625 7.59375 12.3732 7.59375 12.0625C7.59375 11.7518 7.34191 11.5 7.03125 11.5C6.72059 11.5 6.46875 11.7518 6.46875 12.0625C6.46875 12.3732 6.72059 12.625 7.03125 12.625Z"
      fill="#313049"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.96875 14.3125C2.27941 14.3125 2.53125 14.0607 2.53125 13.75C2.53125 13.4393 2.27941 13.1875 1.96875 13.1875C1.65809 13.1875 1.40625 13.4393 1.40625 13.75C1.40625 14.0607 1.65809 14.3125 1.96875 14.3125Z"
      fill="#313049"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.65625 14.3125C3.96691 14.3125 4.21875 14.0607 4.21875 13.75C4.21875 13.4393 3.96691 13.1875 3.65625 13.1875C3.34559 13.1875 3.09375 13.4393 3.09375 13.75C3.09375 14.0607 3.34559 14.3125 3.65625 14.3125Z"
      fill="#313049"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.34375 14.3125C5.65441 14.3125 5.90625 14.0607 5.90625 13.75C5.90625 13.4393 5.65441 13.1875 5.34375 13.1875C5.03309 13.1875 4.78125 13.4393 4.78125 13.75C4.78125 14.0607 5.03309 14.3125 5.34375 14.3125Z"
      fill="#313049"
    />
  </svg>
);

const TruncatedSpan = styled.h1`
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0px;
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
  display: flex;
  flex-direction: column;
  white-space: pre-wrap;
`;

interface IProp {
  did: string;
  dateJoined: number;
  color?: string;
  width?: string;
}

const DidSnippet: React.FC<IProp> = ({
  did,
  dateJoined,
  color = '#979797',
  width
}: IProp) => {
  const isSmDown = useBreakpoint(down('sm'));
  const dateJoinedObject = new Date(dateJoined);
  const dateWeekday = dateJoinedObject.toLocaleString('en-US', {
    weekday: 'short'
  });
  const dateDay = dateJoinedObject.toLocaleString('en-US', { day: 'numeric' });
  const dateMonth = dateJoinedObject.toLocaleString('en-US', {
    month: 'short'
  });
  const dateYear = dateJoinedObject.toLocaleString('en-US', {
    year: 'numeric'
  });

  const shortenedDid = useMemo(() => {
    let sDid = did.replace('did:elastos:', '');
    sDid = `${sDid.substring(0, 4)}...${sDid.substring(sDid.length - 4)}`;
    return `did:elastos:${sDid}`;
  }, [did]);

  return (
    <ProfileDesignation>
      <IonRow className="ion-align-items-center">
        <DidSnippetSvg color={color} />
        &nbsp;
        <TruncatedSpan style={{ color: color, width: width }}>
          {isSmDown ? shortenedDid : did}
        </TruncatedSpan>
      </IonRow>
      {}
      {dateJoined !== 0 && (
        <IonRow className="ion-align-items-center">
          <CalendarSvg />
          <TruncatedSpan style={{ color: color, width: width }}>
            Joined {dateWeekday}, {dateDay} {dateMonth} {dateYear}
          </TruncatedSpan>
        </IonRow>
      )}
    </ProfileDesignation>
  );
};

export default DidSnippet;
