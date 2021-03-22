import React, { useState } from 'react';
import { IonButton, IonCol, IonGrid, IonPopover, IonRow } from '@ionic/react';

import { ExperienceItem } from 'src/pages/PublicPage/types';
import styleWidget from '../WidgetCards.module.scss';
import {
  Institution,
  Program,
  Period,
  Description,
  MyModal,
  TreeDotsButton,
  PopoverMenuItem,
  ModalFooter
} from './Item';
import ExperienceCardEdit from './Edit';

interface ExperienceItemsProps {
  experienceItem: ExperienceItem;
  handleChange: any;
  updateFunc: any;
  index: number;
  initialStatus?: string;
  removeFunc: any;
  mode: string;
}

const ExperienceItems: React.FC<ExperienceItemsProps> = ({
  experienceItem,
  handleChange,
  updateFunc,
  index,
  removeFunc,
  mode
}) => {
  const [editMode, setEditMode] = useState(
    experienceItem.isEmpty ? 'add' : 'readonly'
  );
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined
  });

  const cancel = () => {
    if (editMode === 'add') removeFunc();
    setEditMode('readonly');
  };

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
                  {experienceItem.start} - {experienceItem.end}
                </Period>
              </IonRow>
              <IonRow>
                <Description>{experienceItem.description}</Description>
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
        <ExperienceCardEdit
          experienceItem={experienceItem}
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
                {editMode === 'add' ? 'Add new Experience' : 'Edit Experience'}
              </IonButton>
            </IonCol>
          </IonRow>
        </ModalFooter>
      </MyModal>
    </>
  );
};

export default ExperienceItems;
