import React, { useState, useEffect } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow
} from '@ionic/react';
import { Guid } from 'guid-typescript';

import {
  EducationDTO,
  EducationItem as EducationItemProp
} from 'src/pages/PublicPage/types';

import EducationItem from './Item';
import styleWidget from '../WidgetCards.module.scss';
import { Divider, LinkStyleSpan } from '../ExperienceCard/components';

interface IEducationProps {
  educationDTO: EducationDTO;
  updateFunc?: any;
  removeFunc?: any;
  mode?: string;
}

const EducationCard: React.FC<IEducationProps> = ({
  educationDTO,
  updateFunc,
  removeFunc,
  mode = 'view'
}: IEducationProps) => {
  const [currentEducationDTO, setCurrentEducationDTO] = useState(educationDTO);

  useEffect(() => {
    setCurrentEducationDTO(educationDTO);
  }, [educationDTO]);

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

    let item: EducationItemProp = {
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
          <IonCardContent>
            {currentEducationDTO.items.map((x, i) => {
              return (
                <div key={i}>
                  <EducationItem
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
            })}
          </IonCardContent>
        </IonCard>
      ) : (
        ''
      )}
    </>
  );
};

export default EducationCard;
