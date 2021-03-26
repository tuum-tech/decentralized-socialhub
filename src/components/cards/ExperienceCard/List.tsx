import React, { useState } from 'react';
import { IonCol, IonGrid, IonPopover, IonRow } from '@ionic/react';

import styleWidget from '../WidgetCards.module.scss';
import {
  Description,
  Institution,
  Period,
  PopoverMenuItem,
  Program,
  TreeDotsButton
} from '../common';

interface ExperienceItemsProps {
  experienceItem: ExperienceItem;
  handleChange: any;
  updateFunc: any;
  editFunc: any;
  index: number;
  initialStatus?: string;
  removeFunc: any;
  isEditable: boolean;
}

const ExperienceItems: React.FC<ExperienceItemsProps> = ({
  experienceItem,
  editFunc,
  index,
  removeFunc,
  isEditable
}) => {
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined
  });

  const remove = () => {
    removeFunc(index);
  };

  return (
    <>
      <IonGrid>
        <IonRow className="ion-justify-content-between">
          <IonCol size="2">image</IonCol>
          <IonCol size="9">
            <IonGrid>
              <IonRow>
                <Institution>{experienceItem.institution}</Institution>
              </IonRow>
              <IonRow>
                <Program>{experienceItem.title}</Program>
              </IonRow>
              <IonRow>
                <Period>
                  {experienceItem.start} -
                  {experienceItem.still === true
                    ? ' Present'
                    : experienceItem.end}
                </Period>
              </IonRow>
              <IonRow>
                <Description>{experienceItem.description}</Description>
              </IonRow>
            </IonGrid>
          </IonCol>
          {isEditable === true ? (
            <IonCol size="auto">
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
              </IonPopover>
              <TreeDotsButton
                onClick={(e: any) => {
                  e.persist();
                  setShowPopover({ showPopover: true, event: e });
                }}
              >
                ...
              </TreeDotsButton>
            </IonCol>
          ) : (
            ''
          )}
        </IonRow>
      </IonGrid>
    </>
  );
};

export default ExperienceItems;
