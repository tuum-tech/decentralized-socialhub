import React from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import styled from 'styled-components';

import darkDefaultExpImg from '../../../../assets/default/default-exp_dark.png';
import defaultExpImg from '../../../../assets/default/default-exp.png';

const EditableContent = styled(IonCol)`
  display: flex;
  padding-left: 10px;
`;

const SelectedDiv = styled.div`
  color: #27272e !important;
`;

const UnselectedDiv = styled.div`
  color: #a0aec0;
`;

const LocalInstitution = styled.span<ThemeProps>`
  font-family: 'SF Pro Display';
  font-size: 16px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.56;
  letter-spacing: normal;
  text-align: left;
`;

const LocalProgram = styled.span<ThemeProps>`
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.79;
  letter-spacing: normal;
  text-align: left;
`;

const LocalPeriod = styled.span<ThemeProps>`
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  text-align: left;
`;

const LocalDescription = styled.span<ThemeProps>`
  white-space: break-spaces !important;
  font-family: 'SF Pro Display';
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.62;
  letter-spacing: normal;
  text-align: left;
`;

interface ExperienceElementProps {
  experienceItem: ExperienceItem;
  verifiedby?: { name: string; did: string };
  isSelected: boolean;
  template?: string;
}

const ExperienceElement: React.FC<ExperienceElementProps> = ({
  experienceItem,
  verifiedby = undefined,
  isSelected = false,
  template = 'default'
}) => {
  const experienceItemLogo = () => {
    if (experienceItem.logo) {
      return experienceItem.logo;
    } else if (template === 'gamer' || template === 'crypto') {
      return darkDefaultExpImg;
    }
    return defaultExpImg;
  };

  const getElement = () => {
    return (
      <IonGrid className="ion-no-padding">
        <IonRow className="ion-justify-content-between ion-no-padding">
          <IonCol size="2" className="ion-no-padding">
            <img src={experienceItemLogo()} alt="company logo" width="100px" />
          </IonCol>
          <EditableContent size="10">
            <IonGrid className="ion-no-padding">
              <IonRow className="ion-no-padding">
                <LocalInstitution template={template}>
                  {experienceItem.institution}
                </LocalInstitution>
              </IonRow>
              <IonRow className="ion-no-padding">
                <LocalProgram template={template}>
                  {experienceItem.title}
                </LocalProgram>
              </IonRow>
              <IonRow className="ion-no-padding">
                <LocalPeriod template={template}>
                  {experienceItem.start} -
                  {experienceItem.still === true
                    ? ' Present'
                    : experienceItem.end}
                </LocalPeriod>
              </IonRow>
              <IonRow className="ion-no-padding">
                <LocalDescription template={template}>
                  {experienceItem.description}
                </LocalDescription>
              </IonRow>

              {verifiedby && (
                <>
                  <IonRow className="ion-no-padding">
                    <LocalDescription template={template}>
                      <b>Verified by:</b> {verifiedby.name}
                    </LocalDescription>
                  </IonRow>
                  <IonRow className="ion-no-padding">
                    <LocalDescription template={template}>
                      {verifiedby.did}
                    </LocalDescription>
                  </IonRow>
                </>
              )}
            </IonGrid>
          </EditableContent>
        </IonRow>
      </IonGrid>
    );
  };

  const getStyled = () => {
    if (isSelected) {
      return (
        <>
          <SelectedDiv>{getElement()}</SelectedDiv>
        </>
      );
    }

    return (
      <>
        <UnselectedDiv>{getElement()}</UnselectedDiv>
      </>
    );
  };

  return <>{getStyled()}</>;
};

export default ExperienceElement;
