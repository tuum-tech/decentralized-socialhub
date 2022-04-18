import React, { useMemo } from 'react';
import styled from 'styled-components';

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
