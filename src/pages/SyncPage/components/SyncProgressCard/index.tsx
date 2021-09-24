import React, { useState, useEffect } from 'react';
import { IonButton, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/react';
import styled from 'styled-components';

import { getThemeData } from 'src/data/theme';
import {
  CardContentContainer,
  CardOverview
} from 'src/components/cards/common';
import { DefaultButton } from 'src/elements/buttons';
import ProgressBar from 'src/elements/ProgressBar';

const AboutText = styled.span<ThemeProps>`
  white-space: break-spaces !important;
  margin: 9px 0 0 0;
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: normal;
  text-align: left;
  color: ${({ template }: ThemeProps) =>
    getThemeData(template, 'card', 'overviewText')};
`;

const ButtonDefault = styled(IonButton)`
  --border-radius: 12px;
  background-color: #ffffff;
  height: 50px !important;
  width: 150px !important;
  text-align: center;
  font: 'SF Pro Display';
  text-transform: none;
  letter-spacing: 0px;
  color: #f7fafc;
  font-size: 12px;
  font-weight: 500;
  --background: #4c6fff 0% 0% no-repeat padding-box;
  --background-activated: #4c6fff 0% 0% no-repeat padding-box;

  float: right;
  &:hover {
    --background-hover: #ffffff 0% 0% no-repeat padding-box;
  }
`;

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

const ProgressDiv = styled.div`
  width: 380px;
  margin-top: 8px;
`;

interface IProps {
  amountCompleted?: number;
  totalAmount: number;
  template?: string;
  onSync: () => void;
}

const SyncProgressCard: React.FC<IProps> = ({
  amountCompleted = 5,
  totalAmount = 0,
  template = 'default',
  onSync = () => {}
}: IProps) => {
  const getProgress = (): number => {
    if (totalAmount === 0) return 100;
    return (amountCompleted * 100) / totalAmount;
  };

  if (totalAmount === 0) return <></>;

  return (
    <>
      <CardOverview template={template}>
        <CardContentContainer>
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-no-padding">
              <IonCol size="8" className="ion-no-padding">
                <TotalItemsText template={template}>
                  {' '}
                  {totalAmount} items needs to be reviewed
                </TotalItemsText>
                <ProgressDiv>
                  <IonGrid className="ion-no-padding">
                    <IonRow className="ion-no-padding">
                      <LocalProgressColumn className="ion-no-padding">
                        <LocalProgressBar value={getProgress()} />
                      </LocalProgressColumn>
                      <IonCol className="ion-no-padding">
                        <ProgressText>
                          {getProgress().toLocaleString('en-US', {
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0
                          })}
                          % Reviewed{' '}
                        </ProgressText>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </ProgressDiv>
              </IonCol>

              <IonCol size="4" className="ion-no-padding">
                <ButtonDefault
                  disabled={amountCompleted < totalAmount}
                  onClick={() => onSync()}
                >
                  Sync Changes
                </ButtonDefault>
              </IonCol>
            </IonRow>
          </IonGrid>
        </CardContentContainer>
      </CardOverview>
    </>
  );
};

export default SyncProgressCard;
