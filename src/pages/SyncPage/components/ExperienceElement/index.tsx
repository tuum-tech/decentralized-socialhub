import React, { useState } from 'react';
import { IonCol, IonGrid, IonPopover, IonRow } from '@ionic/react';
import styled from 'styled-components';

// import VerificatioBadge from '../../VerificatioBadge';
import {
  Description,
  Institution,
  Period,
  PopoverMenuItem,
  Program,
  TreeDotsButton
} from '../../../../components/cards/common';

import darkDefaultExpImg from '../../../../assets/default/default-exp_dark.png';
import defaultExpImg from '../../../../assets/default/default-exp.png';
import { is } from 'immer/dist/internal';
// import styleWidget from '../WidgetCards.module.scss';
import VerificatioBadge from '../../../../components/VerificatioBadge/index';

const EditableContent = styled(IonCol)`
  display: flex;
  padding-left: 10px;
`;

const Wrapper = styled.div`
  color: #27272e !important;
`;

interface ExperienceElementProps {
  experienceItem: ExperienceItem;
  verifiedby?: { name: string; did: string };
  isSelected: boolean;
  template?: string;
  userSession: ISessionItem;
}

const ExperienceElement: React.FC<ExperienceElementProps> = ({
  experienceItem,
  verifiedby = undefined,
  isSelected = false,
  userSession,
  template = 'default'
}) => {
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined
  });

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
                <Institution template={template}>
                  {experienceItem.institution}
                  {verifiedby && (
                    <div style={{ float: 'right' }}>
                      <VerificatioBadge
                        userSession={userSession}
                        users={[verifiedby]}
                      />
                    </div>
                  )}
                </Institution>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Program template={template}>{experienceItem.title}</Program>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Period template={template}>
                  {experienceItem.start} -
                  {experienceItem.still === true
                    ? ' Present'
                    : experienceItem.end}
                </Period>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Description template={template}>
                  {experienceItem.description}
                </Description>
              </IonRow>

              {/* {verifiedby && (
          <IonRow className="ion-no-padding">
                <Program template={template}>Verified by: {verifiedby.name}</Program>
          </IonRow>
          )} */}
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
          <Wrapper>{getElement()}</Wrapper>
        </>
      );
    }

    return getElement();
  };

  return <>{getStyled()}</>;
};

export default ExperienceElement;
