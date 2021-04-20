import React from 'react';
import styled from 'styled-components';

const PBContainer = styled.div`
  position: relative;
  height: 6px;
  border-radius: 3px;

  clip-path: inset(0 0 0 0 round 3px);
`;

const PB = styled.div`
  height: 6px;
  transition: width 0.4s ease-in-out;
  border-radius: 3px;
  will-change: width;
`;

const Progress = styled.progress`
  opacity: 0;
  width: 1px;
  height: 1px;
  position: absolute;
  pointer-events: none;
`;

interface IProps {
  value?: number;
  containerColor?: string;
  progressColor?: string;
  width?: string;
}

const ProgressBar: React.FC<IProps> = ({
  value,
  width = '100%',
  containerColor = '#EDF2F7',
  progressColor = '#4C6FFF'
}) => {
  const percent = value ? value : 0;
  return (
    <PBContainer
      style={{
        background: containerColor,
        width: width
      }}
    >
      <PB
        style={{
          width: `${percent}%`,
          background: progressColor
        }}
      ></PB>
      <Progress value={percent} max="100">
        {percent}%
      </Progress>
    </PBContainer>
  );
};

export default ProgressBar;
