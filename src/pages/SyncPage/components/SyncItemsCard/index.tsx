import React, { useState, useEffect } from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import styled from 'styled-components';

import { getThemeData } from 'src/data/theme';
import {
  CardContentContainer,
  CardOverview
} from 'src/components/cards/common';
import { DefaultButton } from 'src/elements/buttons';
import ProgressBar from 'src/elements/ProgressBar';

const TotalItemsText = styled.span<ThemeProps>`
  font-family: 'SF Pro Display';
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: normal;
  text-align: left;
  color: #4c6fff;
`;

const ProgressText = styled.span`
  font-family: 'SF Pro Display';
  font-size: 12px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: normal;
  text-align: left;
  color: #000000;
  margin-left: 12px;
`;

const LocalProgressBar = styled(ProgressBar)`
  display: inline !important;
`;

const LocalProgressColumn = styled(IonCol)`
  padding-top: 8px;
`;

interface IProps {
  // amountCompleted?: number;
  // totalAmount: number;
  template?: string;
  // onSync: () => void;
}

const SyncItemsCard: React.FC<IProps> = ({
  // amountCompleted = 5,
  // totalAmount = 0,
  template = 'default'
}: // onSync = () => { }
IProps) => {
  // const getProgress = (): number => {
  //     if (totalAmount === 0) return 100;
  //     return (amountCompleted * 100) / totalAmount
  // }

  // if (totalAmount === 0) return <></>;

  return (
    <>
      <CardOverview template={template}>
        <CardContentContainer>asfasdf</CardContentContainer>
      </CardOverview>
    </>
  );
};

export default SyncItemsCard;
