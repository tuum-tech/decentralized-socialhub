import { IonButton } from '@ionic/react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router';

import { mapStateToProps, mapDispatchToProps } from './index';
import {
  SubState as defaultSubState,
  ActionType as defaultActionType,
  defaultUserInfo
} from 'src/store/users/types';

export { defaultUserInfo };
export type SubState = defaultSubState;

export type ActionType = defaultActionType;

export type InferMappedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export interface MatchParams {
  did: string;
}
export interface PageProps
  extends InferMappedProps,
    RouteComponentProps<MatchParams> {}

export const Header = styled.div`
  width: 100%;
  height: 120px;
  background: #fff;
  padding: 27px 25px 20px 25px;
`;

export const HeaderInfo = styled.div`
  position: absolute;
  display: inline;
  width: 100%;
  margin-left: 20px;
`;

export const Content = styled.div`
  height: 100%
  margin: 0;
  padding: 20px;
`;

export const PageTitle = styled.h2`
  font-family: 'SF Pro Display';
  font-size: 28px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #27272e;
`;

export const PageSubtitle = styled.h3`
  font-family: 'SF Pro Display';
  font-size: 18px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #27272e;
`;

export const ArrowImage = styled(IonButton)`
  color: none;
  --border-width: 0px !important;
  --border-color: transparent !important;
  --border-radius: 0px !important;
  --box-shadow: none !important;
  --background: transparent;
  --background-activated: #e0e0e0 0% 0% no-repeat padding-box;
  margin-top: 20px;
  &:hover {
    --background-hover: #f0f0f0 0% 0% no-repeat padding-box;
  }
`;
