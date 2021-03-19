import React, { useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonCol,
  IonFooter,
  IonGrid,
  IonLabel,
  IonModal,
  IonPopover,
  IonRow,
  IonTextarea
} from '@ionic/react';
import styled from 'styled-components';
import { Guid } from 'guid-typescript';

import { EducationDTO, EducationItem } from 'src/pages/PublicPage/types';
import style from './DidCard.module.scss';
import styleWidget from './WidgetCards.module.scss';

import { ButtonLink } from '../buttons';
import SmallTextInput from '../inputs/SmallTextInput';
import SkeletonAvatar from '../avatars/SkeletonAvatar';
import harvard from '../../assets/logo/Harvard-Logo.png';

interface IEducationProps {
  educationDTO: EducationDTO;
  updateFunc?: any;
  removeFunc?: any;
  mode?: string;
}

const Institution = styled.span`
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

const Program = styled.span`
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

const Period = styled.span`
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

const Description = styled.span`
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

const SmallLightButton = styled.button`
  height: 27px;
  display: inline;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 7px 13px;
  border-radius: 6px;
  background-color: #f3f9ff;
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #4c6fff;
`;

const SmallBlueButton = styled(ButtonLink)`
  height: 27px;
  display: inline;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 7px 13px;
  border-radius: 6px;
  background-color: #f3f9ff;
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #4c6fff;
`;

const MyModal = styled(IonModal)`
  --border-radius: 16px;
  --min-height: 200px;
  --height: 480px;
  --width: 560px;
`;

const ModalFooter = styled(IonFooter)`
  padding: 12px;
`;

const Divider = styled.hr`
  width: 100%;
  height: 1px;
  text-align: center;
  background-color: #f7fafc;
`;

const TreeDotsButton = styled.div`
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

const PopoverMenuItem = styled.div`
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

interface EducationItemsProps {
  educationItem: EducationItem;
  handleChange: any;
  updateFunc: any;
  index: number;
  initialStatus?: string;
  removeFunc: any;
  mode: string;
}

const EducationItems: React.FC<EducationItemsProps> = ({
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

const LinkStyleSpan = styled.span`
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

const EducationCard: React.FC<IEducationProps> = ({
  educationDTO,
  updateFunc,
  removeFunc,
  mode = 'view'
}: IEducationProps) => {
  const [currentEducationDTO, setCurrentEducationDTO] = useState(educationDTO);

  const handleChange = (evt: any, index: number) => {
    if (evt.target.name === 'stillWorking') {
      evt.target.name = 'end';
      evt.target.value = '';
    }

    // 1. Make a shallow copy of the items
    let items = [...currentEducationDTO.items];

    let item = {
      ...items[index],
      [evt.target.name]: evt.target.value
    };
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    items[index] = item;

    // 5. Set the state to our new copy
    setCurrentEducationDTO({ isEnabled: true, items: items });
  };

  const saveChanges = (index: number) => {
    updateFunc(currentEducationDTO.items[index]);
  };

  const addItem = () => {
    // 1. Make a shallow copy of the items
    let items = [...currentEducationDTO.items];

    let item: EducationItem = {
      guid: Guid.create(),
      description: '',
      institution: '',
      program: '',
      title: '',
      stillWorking: false,
      order: '',
      start: '',
      end: '',
      isEmpty: true
    };
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    items.push(item);

    // 5. Set the state to our new copy
    setCurrentEducationDTO({ isEnabled: true, items: items });
  };

  const removeItem = (index: number) => {
    let items = [...currentEducationDTO.items];

    let itemToDelete = items.splice(index, 1);

    setCurrentEducationDTO({ isEnabled: true, items: items });

    if (itemToDelete[0].isEmpty) removeFunc(itemToDelete[0]);
  };

  const listEducation = currentEducationDTO.items.map((x, i) => {
    return (
      <div key={i}>
        <EducationItems
          educationItem={x}
          handleChange={handleChange}
          updateFunc={saveChanges}
          index={i}
          removeFunc={removeItem}
          mode={mode}
        />
        {i < currentEducationDTO.items.length - 1 ? <Divider /> : ''}
      </div>
    );
  });

  return (
    <>
      {educationDTO.isEnabled === true ? (
        <IonCard className={styleWidget['overview']}>
          <IonCardHeader>
            <IonGrid>
              <IonRow className="ion-justify-content-between">
                <IonCol>
                  <IonCardTitle>Education</IonCardTitle>
                </IonCol>
                {mode === 'edit' ? (
                  <IonCol size="auto">
                    <LinkStyleSpan onClick={e => addItem()}>
                      + Add Education
                    </LinkStyleSpan>
                  </IonCol>
                ) : (
                  ''
                )}
              </IonRow>
            </IonGrid>
          </IonCardHeader>
          <IonCardContent>{listEducation}</IonCardContent>
        </IonCard>
      ) : (
        ''
      )}
    </>
  );
};
export default EducationCard;

interface EducationItemProps {
  educationItem: EducationItem;
  handleChange: any;
  index: number;
  mode: string;
}

const MyGrid = styled(IonGrid)`
  margin: 10px 20px 10px 20px;
  height: 100 %;
`;

const MyTextarea = styled(IonTextarea)`
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

const Spacer = styled.div`
  margin-top: 40px;
  padding: 5px;
`;

const EducationCardEdit: React.FC<EducationItemProps> = ({
  educationItem,
  handleChange,
  index,
  mode
}: EducationItemProps) => {
  //const [stillWorking, setStillWorking] = useState(educationItem.end === "")

  const handleChangeIndex = (evt: any) => {
    handleChange(evt, index);
  };

  return (
    <MyGrid>
      <IonRow>
        <IonCardTitle>
          {mode === 'edit' ? 'Edit Education' : 'Add new Education'}
        </IonCardTitle>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="5">
          <SmallTextInput
            label="Program / Degree"
            placeholder="e.g. Blockchain developer"
            name="program"
            value={educationItem.program}
            onChange={handleChangeIndex}
          />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="8">
          <SmallTextInput
            label="University / Institution name"
            placeholder="e.g. Harvard, MIT, ..."
            name="institution"
            value={educationItem.institution}
            onChange={handleChangeIndex}
          />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="4.5">
          <SmallTextInput
            label="Duration"
            placeholder="Start"
            type="date"
            name="start"
            value={educationItem.start}
            onChange={handleChangeIndex}
          />
        </IonCol>
        <IonCol size="4.5">
          <SmallTextInput
            label="&nbsp;"
            type="date"
            placeholder="End"
            name="end"
            value={educationItem.end}
            onChange={handleChangeIndex}
          />
        </IonCol>
        <IonCol size="3">
          <Spacer>
            <IonCheckbox
              checked={educationItem.stillWorking}
              name="stillWorking"
              onIonChange={handleChangeIndex}
            />{' '}
            Still Working
          </Spacer>
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="8">
          <IonLabel>Description</IonLabel>
          <MyTextarea
            rows={3}
            name="description"
            placeholder="..."
            value={educationItem.description}
            onIonChange={handleChangeIndex}
          />
        </IonCol>
      </IonRow>
    </MyGrid>
  );
};
