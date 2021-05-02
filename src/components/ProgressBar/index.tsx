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
  text?: string;
  containerColor?: string;
  progressColor?: string;
  width?: string;
}

const ProgressBar: React.FC<IProps> = ({
  value = 0,
  text = 'completed',
  width = '100%',
  containerColor = '#EDF2F7',
  progressColor = '#4C6FFF'
}) => {
  return (
    <PBContainer
      style={{
        background: containerColor,
        width: width
      }}
    >
      <PB
        style={{
          width: `${value}%`,
          background: progressColor
        }}
      ></PB>
      <Progress value={value} max="100"></Progress>
    </PBContainer>
  );
};

export default ProgressBar;
