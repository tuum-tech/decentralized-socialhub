import styled from 'styled-components';
import { down } from 'styled-breakpoints';

export const Header = styled.div`
  width: 100%;
  height: 83px;
  background: #fff;
  padding: 27px 25px 20px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${down('sm')} {
    padding: 20px;
    height: fit-content;
  }
`;
