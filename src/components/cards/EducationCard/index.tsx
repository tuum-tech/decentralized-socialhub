import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow
} from '@ionic/react';
import { Guid } from 'guid-typescript';

import EducationItem from './Item';
import styleWidget from '../WidgetCards.module.scss';
import { Divider, LinkStyleSpan, MyModal, ModalFooter, MODE } from '../common';
import EducationCardEdit from './Edit';

interface IEducationProps {
  educationDTO: EducationDTO;
  updateFunc?: any;
  removeFunc?: any;
  isEditable?: boolean;
}

export const defaultEducationItem: EducationItem = {
  guid: Guid.create(),
  isEmpty: true,
  institution: '',
  program: '',
  start: '',
  end: '',
  still: false,
  title: '',
  description: '',
  order: ''
};

const EducationCard: React.FC<IEducationProps> = ({
  educationDTO,
  updateFunc,
  removeFunc,
  isEditable = false
}: IEducationProps) => {
  const [currentEducationDTO, setCurrentEducationDTO] = useState(educationDTO);

  useEffect(() => {
    setCurrentEducationDTO(educationDTO);
  }, [educationDTO]);

  const [editedItem, setEditedItem] = useState(defaultEducationItem);
  const [mode, setMode] = useState<MODE>(MODE.NONE);

  useEffect(() => {
    setCurrentEducationDTO(educationDTO);
  }, [educationDTO]);

  const handleChange = (evt: any) => {
    let v: any;
    if (evt.target.name === 'still') {
      v = evt.target.checked;
    } else {
      v = evt.target.value;
    }

    let item = {
      ...editedItem,
      [evt.target.name]: v
    };

    setEditedItem(item);
  };

  const saveChanges = (item: EducationItem) => {
    let items = [...currentEducationDTO.items];

    let itemToUpdate = items.find(x => x.guid === item.guid);

    if (itemToUpdate === undefined) {
      items.push(item);
    } else {
      let index = items.indexOf(itemToUpdate);
      items[index] = item;
    }

    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first

    // 5. Set the state to our new copy
    setCurrentEducationDTO({ isEnabled: true, items: items });
    updateFunc(item);
  };

  const cancel = () => {
    setMode(MODE.NONE);
  };

  const addItem = () => {
    setMode(MODE.ADD);
    setEditedItem(defaultEducationItem);
  };

  const editItem = (item: ExperienceItem) => {
    setEditedItem(item);
    setMode(MODE.EDIT);
  };

  const removeItem = async (index: number) => {
    let items = [...currentEducationDTO.items];
    await removeFunc(items[index]);
    items = items.splice(index, 1);
    setCurrentEducationDTO({ isEnabled: true, items: items });
  };

  return (
    <>
      {educationDTO.isEnabled === true ? (
        <>
          <IonCard className={styleWidget['overview']}>
            <IonCardHeader>
              <IonGrid>
                <IonRow className="ion-justify-content-between">
                  <IonCol>
                    <IonCardTitle>Education</IonCardTitle>
                  </IonCol>
                  {isEditable ? (
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
            <IonCardContent>
              {currentEducationDTO.items.map((x, i) => {
                return (
                  <div key={i}>
                    <EducationItem
                      educationItem={x}
                      handleChange={handleChange}
                      updateFunc={saveChanges}
                      editFunc={editItem}
                      index={i}
                      removeFunc={removeItem}
                      isEditable={isEditable}
                    />
                    {i < currentEducationDTO.items.length - 1 ? (
                      <Divider />
                    ) : (
                      ''
                    )}
                  </div>
                );
              })}
            </IonCardContent>
          </IonCard>
          <MyModal
            isOpen={mode === MODE.EDIT || mode === MODE.ADD}
            cssClass="my-custom-class"
          >
            <EducationCardEdit
              educationItem={editedItem}
              handleChange={handleChange}
              mode={mode}
            />
            <ModalFooter className="ion-no-border">
              <IonRow className="ion-justify-content-around">
                <IonCol size="auto">
                  <IonButton fill="outline" onClick={cancel}>
                    Cancel
                  </IonButton>
                  <IonButton
                    onClick={() => {
                      saveChanges(editedItem);
                      setMode(MODE.NONE);
                    }}
                  >
                    {mode === MODE.ADD ? 'Add new Education' : 'Edit Education'}
                  </IonButton>
                </IonCol>
              </IonRow>
            </ModalFooter>
          </MyModal>
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default EducationCard;
