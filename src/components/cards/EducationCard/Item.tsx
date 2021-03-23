import React, { useState } from 'react';
import { IonButton, IonCol, IonGrid, IonPopover, IonRow } from '@ionic/react';

import style from '../DidCard.module.scss';
import styleWidget from '../WidgetCards.module.scss';

import SkeletonAvatar from '../../avatars/SkeletonAvatar';
import harvard from '../../../assets/logo/Harvard-Logo.png';

import {
  Institution,
  Program,
  Period,
  Description,
  MyModal,
  TreeDotsButton,
  PopoverMenuItem,
  ModalFooter
} from '../ExperienceCard/Item';
import EducationCardEdit from './Edit';

interface EducationItemProps {
  educationItem: EducationItem;
  handleChange: any;
  updateFunc: any;
  index: number;
  initialStatus?: string;
  removeFunc: any;
  mode: string;
}

const EducationItem: React.FC<EducationItemProps> = ({
  educationItem,
  handleChange,
  updateFunc,
  index,
  removeFunc,
  mode
}) => {
  const [editMode, setEditMode] = useState(
    educationItem.isEmpty ? 'add' : 'readonly'
  );
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined
  });

  const cancel = () => {
    if (editMode === 'add') removeFunc(index);
    setEditMode('readonly');
  };

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
                  {educationItem.start} - {educationItem.end}
                </Period>
              </IonRow>
              <IonRow>
                <Description>{educationItem.description}</Description>
              </IonRow>
            </IonGrid>
          </IonCol>

          {mode === 'edit' ? (
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
                    setEditMode('edit');
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
      <MyModal
        isOpen={editMode === 'add' || editMode === 'edit'}
        cssClass="my-custom-class"
      >
        <EducationCardEdit
          educationItem={educationItem}
          handleChange={handleChange}
          index={index}
          mode={editMode}
        />
        <ModalFooter className="ion-no-border">
          <IonRow className="ion-justify-content-around">
            <IonCol size="auto">
              <IonButton fill="outline" onClick={cancel}>
                Cancel
              </IonButton>
              <IonButton
                onClick={() => {
                  updateFunc(index);
                  setEditMode('readonly');
                }}
              >
                {editMode === 'add' ? 'Add new Education' : 'Edit Education'}
              </IonButton>
            </IonCol>
          </IonRow>
        </ModalFooter>
      </MyModal>
    </>
  );
};

export default EducationItem;
