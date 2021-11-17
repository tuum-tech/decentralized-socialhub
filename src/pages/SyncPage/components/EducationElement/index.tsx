import React, { useState } from 'react';
import { IonCol, IonGrid, IonPopover, IonRow } from '@ionic/react';
import styled from 'styled-components';

import {
  Description,
  Institution,
  Period,
  PopoverMenuItem,
  Program,
  TreeDotsButton
} from '../../../../components/cards/common';

import darkDefaultEduImg from '../../../../assets/default/default-edu_dark.png';
import defaultEduImg from '../../../../assets/default/default-edu.png';
// import styleWidget from '../WidgetCards.module.scss';
import VerificatioBadge from '../../../../components/VerificatioBadge/index';

interface EducationElementProps {
  educationItem: EducationItem;
  template?: string;
  userSession: ISessionItem;
}

const EducationElement: React.FC<EducationElementProps> = ({
  educationItem,
  userSession,
  template = 'default'
}) => {
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined
  });

  const EditableContent = styled(IonCol)`
    display: flex;
    padding-left: 10px;
  `;

  const experienceItemLogo = () => {
    if (educationItem.logo) {
      return educationItem.logo;
    } else if (template === 'gamer' || template === 'crypto') {
      return darkDefaultEduImg;
    }
    return defaultEduImg;
  };

  return (
    <>
      <IonGrid className="ion-no-padding">
        <IonRow className="ion-justify-content-between ion-no-padding">
          <IonCol size="2" className="ion-no-padding">
            <div>
              <img
                src={experienceItemLogo()}
                alt="university logo"
                width="100px"
              />
            </div>
          </IonCol>
          <EditableContent size="10">
            <IonGrid className="ion-no-padding">
              <IonRow style={{ float: 'right' }}>
                <IonCol>
                  {educationItem.verifiers &&
                    educationItem.verifiers.length > 0 && (
                      <VerificatioBadge
                        userSession={userSession}
                        users={educationItem.verifiers}
                      />
                    )}
                </IonCol>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Institution template={template}>
                  {educationItem.institution}
                </Institution>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Program template={template}>{educationItem.program}</Program>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Period template={template}>
                  {educationItem.start} -
                  {educationItem.still ? ' Present' : educationItem.end}
                </Period>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Description template={template}>
                  {educationItem.description}
                </Description>
              </IonRow>
            </IonGrid>
          </EditableContent>
        </IonRow>
      </IonGrid>
    </>
  );
};

export default EducationElement;
