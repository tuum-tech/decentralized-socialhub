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

import ExperienceItem from './Item';
import styleWidget from '../WidgetCards.module.scss';

import styled from 'styled-components';
import ExperienceCardEdit from './Edit';
import { LinkStyleSpan, MyModal, ModalFooter, Divider, MODE } from '../common';

interface IExperienceProps {
  experienceDTO: ExperienceDTO;
  updateFunc?: any;
  isEditable?: boolean;
  removeFunc?: any;
}

export const defaultExperienceItem: ExperienceItem = {
  guid: Guid.create(),
  isEmpty: true,
  institution: '',
  program: '',
  start: '',
  end: '',
  still: false,
  title: '',
  description: '',
  order: '',
  isEnabled: false
};

const ExperienceCard: React.FC<IExperienceProps> = ({
  experienceDTO,
  updateFunc,
  isEditable = false,
  removeFunc
}: IExperienceProps) => {
  const [currentExperienceDTO, setcurrentExperienceDTO] = useState(
    experienceDTO
  );

  const [editedItem, setEditedItem] = useState(defaultExperienceItem);
  const [mode, setMode] = useState(MODE.NONE);

  useEffect(() => {
    setcurrentExperienceDTO(experienceDTO);
  }, [experienceDTO]);

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

  const saveChanges = (item: ExperienceItem) => {
    let items = [...currentExperienceDTO.items];

    let itemToUpdate = items.find(x => x.guid === item.guid);

    if (itemToUpdate === undefined) {
      items.push(item);
    } else {
      let index = items.indexOf(itemToUpdate);
      items[index] = item;
    }

    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first

    // 5. Set the state to our new copy
    setcurrentExperienceDTO({ isEnabled: true, items: items });
    updateFunc(item);
  };

  const cancel = () => {
    setMode(MODE.NONE);
  };

  const addItem = () => {
    setMode(MODE.ADD);
    setEditedItem(defaultExperienceItem);
  };

  const editItem = (item: ExperienceItem) => {
    setEditedItem(item);
    setMode(MODE.EDIT);
  };

  const removeItem = async (index: number) => {
    let items = [...currentExperienceDTO.items];
    await removeFunc(items[index]);
    items = items.splice(index, 1);
    setcurrentExperienceDTO({ isEnabled: true, items: items });
  };

  return (
    <>
      {experienceDTO.isEnabled === true ? (
        <>
          <IonCard className={styleWidget['overview']}>
            <IonCardHeader>
              <IonGrid>
                <IonRow className="ion-justify-content-between">
                  <IonCol>
                    <IonCardTitle>Experience</IonCardTitle>
                  </IonCol>
                  {isEditable ? (
                    <IonCol size="auto">
                      <LinkStyleSpan onClick={e => addItem()}>
                        + Add Experience
                      </LinkStyleSpan>
                    </IonCol>
                  ) : (
                    ''
                  )}
                </IonRow>
              </IonGrid>
            </IonCardHeader>
            <IonCardContent>
              {currentExperienceDTO.items.map((x, i) => {
                return (
                  <div key={i}>
                    <ExperienceItem
                      experienceItem={x}
                      handleChange={handleChange}
                      updateFunc={saveChanges}
                      editFunc={editItem}
                      index={i}
                      removeFunc={removeItem}
                      isEditable={isEditable}
                    />
                    {i < currentExperienceDTO.items.length - 1 ? (
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
            onDidDismiss={() => setMode(MODE.NONE)}
            isOpen={mode === MODE.EDIT || mode === MODE.ADD}
            cssClass="my-custom-class"
          >
            <ExperienceCardEdit
              experienceItem={editedItem}
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
                    Save
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

export default ExperienceCard;
