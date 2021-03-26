import React, { useState } from 'react';
import { IonCol, IonGrid, IonPopover, IonRow } from '@ionic/react';

import style from '../DidCard.module.scss';
import styleWidget from '../WidgetCards.module.scss';

import SkeletonAvatar from '../../avatars/SkeletonAvatar';
import harvard from '../../../assets/logo/Harvard-Logo.png';
import {
  Description,
  Institution,
  Period,
  PopoverMenuItem,
  Program,
  TreeDotsButton
} from '../common';

interface EducationItemProps {
  educationItem: EducationItem;
  handleChange: any;
  updateFunc: any;
  editFunc: any;
  index: number;
  initialStatus?: string;
  removeFunc: any;
  isEditable: boolean;
}

const EducationItem: React.FC<EducationItemProps> = ({
  educationItem,
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
          <IonCol size="2">
            <div>
              <SkeletonAvatar />
              <img
                alt="avatar"
                src={harvard}
                width="80"
                height="80"
                className={style['clip-avatar-svg']}
              />
            </div>
          </IonCol>
          <IonCol size="9">
            <IonGrid>
              <IonRow>
                <Institution>{educationItem.institution}</Institution>
              </IonRow>
              <IonRow>
                <Program>{educationItem.program}</Program>
              </IonRow>
              <IonRow>
                <Period>
                  {educationItem.start} -
                  {educationItem.still ? ' Present' : educationItem.end}
                </Period>
              </IonRow>
              <IonRow>
                <Description>{educationItem.description}</Description>
              </IonRow>
            </IonGrid>
          </IonCol>

          {isEditable ? (
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
                    editFunc(educationItem);
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

export default EducationItem;
