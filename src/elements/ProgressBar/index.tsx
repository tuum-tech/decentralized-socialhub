import React from 'react';
import styled from 'styled-components';
import styles from './ProgressBar.module.scss';

const PBContainer = styled.div`
  position: relative;
  border-radius: 30px;

  clip-path: inset(0 0 0 0 round 3px);
`;

const PB = styled.div`
  transition: width 0.4s ease-in-out;
  border-radius: 30px;
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
  height?: number;
}

const ProgressBar: React.FC<IProps> = ({
  value,
  width = '100%',
  height = 6,
  containerColor = 'var(--ion-color-gray200)',
  progressColor = 'var(--ion-color-primary)'
}) => {
  const percent = value ? value : 0;
  return (
    <PBContainer
      style={{
        background: containerColor,
        width,
        height: `${height}px`
      }}
    >
      <PB
        style={{
          width: `${percent}%`,
          background:
            percent === 100 ? styles['main-green-gradient'] : progressColor,
          height: `${height}px`
        }}
      ></PB>
      <Progress value={value} max="100"></Progress>
    </PBContainer>
  );
};

export default ProgressBar;
