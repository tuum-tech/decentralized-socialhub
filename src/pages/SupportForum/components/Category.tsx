import styled from 'styled-components';

interface Props {
  color?: string;
}

export const Category = styled.div<Props>`
  background: rgba(76, 111, 255, 0.1);
  border-radius: 8px;
  padding: 3px 10px;

  display: block;
  margin: 0 auto;

  ${props => {
    return `color: ${props.color ? props.color : '4c6fff'};`;
  }}
`;
