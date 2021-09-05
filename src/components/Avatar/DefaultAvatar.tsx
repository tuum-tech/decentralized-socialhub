import React from 'react';
import styled from 'styled-components';

import style from './style.module.scss';

interface AvatarProps {
  name: string;
  ready: boolean;
  didPublished: boolean;
}

const ContentDiv = styled.div`
  min-width: 40px;
  width: 100%;
  height: 100%;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  background-color: #f5f8fa;
  color: #7a7a9d;
  font-weight: bold;
`;

const DefaultAvatar: React.FC<AvatarProps> = ({
  name,
  ready,
  didPublished
}: AvatarProps) => {
  const cn = ready
    ? style['border-primary']
    : didPublished
    ? style['border-primary']
    : style['border-danger'];
  return (
    <ContentDiv className={cn}>
      {name[0]} {name[1]}
    </ContentDiv>
  );
};

export default DefaultAvatar;
