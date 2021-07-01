import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface ButtonLinkProps {
  width?: number;
}
const ButtonLink = styled(Link)<ButtonLinkProps>`
  width: 100%;
  ${props => {
    if (props.width) {
      return `max-width: ${props.width}px;`;
    }
  }}
  display: block;
  margin: 0;
`;

export default ButtonLink;
