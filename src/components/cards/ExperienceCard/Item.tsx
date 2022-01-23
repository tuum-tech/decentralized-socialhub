import React, { useState } from 'react';
import { IonCol, IonGrid, IonPopover, IonRow } from '@ionic/react';
import styled from 'styled-components';

import VerificatioBadge from '../../VerificatioBadge';
import {
  Description,
  Institution,
  Period,
  PopoverMenuItem,
  Program,
  TreeDotsButton
} from '../common';

import darkDefaultExpImg from '../../../assets/default/default-exp_dark.png';
import defaultExpImg from '../../../assets/default/default-exp.png';
import styleWidget from '../WidgetCards.module.scss';

const EditableContent = styled(IonCol)`
  display: flex;
  padding-left: 10px;
`;

interface ExperienceItemProps {
  experienceItem: ExperienceItem;
  handleChange: any;
  updateFunc: any;
  editFunc: any;
  index: number;
  requestVerification: any;
  initialStatus?: string;
  removeFunc: any;
  isEditable: boolean;
  template: string;
  userSession: ISessionItem;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({
  experienceItem,
  editFunc,
  index,
  removeFunc,
  requestVerification,
  isEditable,
  template,
  userSession
}) => {
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined
  });

  const remove = () => {
    removeFunc(index);
  };

  const experienceItemLogo = () => {
    if (experienceItem.logo) {
      return experienceItem.logo;
    } else if (template === 'gamer' || template === 'crypto') {
      return darkDefaultExpImg;
    }
    return defaultExpImg;
  };

  return (
    <>
      <IonGrid className="ion-no-padding">
        <IonRow className="ion-justify-content-between ion-no-padding">
          <IonCol size="2" className="ion-no-padding">
            <img src={experienceItemLogo()} alt="company logo" width="100px" />
          </IonCol>
          <EditableContent size="10">
            <IonGrid className="ion-no-padding">
              <IonRow style={{ float: 'right' }}>
                <IonCol>
                  {experienceItem.verifiers &&
                    experienceItem.verifiers.length > 0 && (
                      <VerificatioBadge
                        userSession={userSession}
                        users={experienceItem.verifiers}
                      />
                    )}
                </IonCol>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Institution template={template}>
                  {experienceItem.institution}
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
            </IonGrid>

            {isEditable === true ? (
              <div>
                <IonPopover
                  showBackdrop={false}
                  cssClass={styleWidget['popover-class']}
                  event={popoverState.event}
                  isOpen={popoverState.showPopover}
                  onDidDismiss={() =>
                    setShowPopover({ showPopover: false, event: undefined })
                  }
                >
                  <PopoverMenuItem
                    onClick={e => {
                      setShowPopover({ showPopover: false, event: undefined });
                      editFunc(experienceItem);
                    }}
                  >
                    Edit
                  </PopoverMenuItem>
                  <PopoverMenuItem
                    onClick={() => {
                      setShowPopover({ showPopover: false, event: undefined });
                      remove();
                    }}
                  >
                    Remove
                  </PopoverMenuItem>
                  <PopoverMenuItem
                    onClick={() => {
                      setShowPopover({
                        showPopover: false,
                        event: undefined
                      });
                      requestVerification(experienceItem);
                    }}
                  >
                    Request Verification
                  </PopoverMenuItem>
                </IonPopover>
                <TreeDotsButton
                  onClick={(e: any) => {
                    e.persist();
                    setShowPopover({ showPopover: true, event: e });
                  }}
                >
                  ...
                </TreeDotsButton>
              </div>
            ) : (
              ''
            )}
          </EditableContent>
        </IonRow>
      </IonGrid>
    </>
  );
};

export default ExperienceItem;
