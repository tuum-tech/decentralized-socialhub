import styled from 'styled-components';
import { DefaultLinkButton } from 'src/components/buttons';

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
`;
export const CardTitle = styled.p`
  color: black;
  font-size: 20px;
  font-weight: bold;
  line-height: 26px;
`;
export const CardText = styled.p`
  margin-top: 5px;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 25px;
  color: #425466;
  max-width: 315px;
  maring-bottom: 15px;
`;

export const LinkButton = styled(DefaultLinkButton)`
  margin-top: 25px;
  width: 64px;
  height: 32px;
  color: white;
  background-color: #4c6fff;
  text-align: left !important;
  padding: 15px 25px;
`;
