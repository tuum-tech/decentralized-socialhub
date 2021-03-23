import React, { useState } from 'react';
import {
  IonButton,
  IonCol,
  IonPopover,
  IonRow,
  IonFooter,
  IonGrid,
  IonModal,
  IonTextarea
} from '@ionic/react';
import styled from 'styled-components';

import ExperienceCardEdit from './Edit';
import styleWidget from '../WidgetCards.module.scss';

export interface Props {
  experienceItem: ExperienceItem;
  handleChange: any;
  updateFunc: any;
  index: number;
  initialStatus?: string;
  removeFunc: any;
  mode: string;
}

const ExperienceItem: React.FC<Props> = ({
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

export default ExperienceItem;

export const Institution = styled.span`
  font-family: 'SF Pro Display';
  font-size: 16px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.56;
  letter-spacing: normal;
  text-align: left;
  color: #27272e;
`;

export const Program = styled.span`
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.79;
  letter-spacing: normal;
  text-align: left;
  color: #27272e;
`;

export const Period = styled.span`
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  text-align: left;
  color: #27272e;
`;

export const Divider = styled.hr`
  width: 100%;
  height: 1px;
  text-align: center;
  margin-top: 1.5em;
  margin-bottom: 1.5em;
  background-color: #f7fafc;
`;

export const LinkStyleSpan = styled.span`
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.07px;
  text-align: left;
  color: #4c6fff;
  cursor: default;
`;

export const Description = styled.span`
  font-family: 'SF Pro Display';
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.62;
  letter-spacing: normal;
  text-align: left;
  color: rgba(66, 84, 102, 0.57);
`;

export const MyModal = styled(IonModal)`
  --border-radius: 16px;
  --min-height: 200px;
  --height: 480px;
  --width: 560px;
`;

export const TreeDotsButton = styled.div`
  writing-mode: vertical-rl;
  text-orientation: mixed;
  line-height: 0.5;
  margin: 1px 3px 2px 7px;
  padding: 5px 3px 5px 10px;
  border-radius: 22px;
  font-weight: bold;
  background-color: rgba(221, 221, 221, 0.24);
  color: #000;
  cursor: default;
`;

export const PopoverMenuItem = styled.div`
  display: block;
  font-family: 'SF Pro Display';
  padding: 10px 10px 10px 20px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.07px;
  text-align: left;
  color: #000;
  cursor: pointer;
`;

export const MyGrid = styled(IonGrid)`
  margin: 10px 20px 10px 20px;
  height: 100 %;
`;

export const MyTextarea = styled(IonTextarea)`
  width: 90 %;
  margin-top: 8px;
  background: #edf2f7;
  box-shadow: 0px 1px 2px rgba(50, 50, 71, 0.08),
    0px 0px 1px rgba(50, 50, 71, 0.2);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  font-family: 'SF Pro Display';
  letter-spacing: normal;
  text-align: left;
  color: #6b829a;
  --padding-bottom: 8px;
  --padding-top: 9px;
  --padding-end: 16px;
  --padding-start: 16px;
  --placeholder-color: var(--input - muted - placeholder);
`;

export const ModalFooter = styled(IonFooter)`
  padding: 12px;
`;
