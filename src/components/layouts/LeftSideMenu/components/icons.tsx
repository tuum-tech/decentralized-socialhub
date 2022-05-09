import React, { useMemo } from 'react';
import styled, { CSSProperties } from 'styled-components';

const SvgContainer = styled.div`
  svg {
    display: block;
    margin: 0 auto;
  }
`;

interface IProps {
  name: string;
  active: boolean;
  customStyle?: CSSProperties;
}

export const MenuIcon = ({
  name,
  active = false,
  customStyle = {}
}: IProps) => {
  const imgSrc = useMemo(
    () => require(`src/assets/sidebar/${name}${active ? '-active' : ''}.svg`),
    [name, active]
  );

  return (
    <SvgContainer style={customStyle}>
      <img src={imgSrc} alt={`${name}${active ? '-active' : ''}`} />
    </SvgContainer>
  );
};
