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

import ExperienceItems from './List';
import styleWidget from '../WidgetCards.module.scss';
import { Divider, LinkStyleSpan } from './Item';

interface IExperienceProps {
  experienceDTO: ExperienceDTO;
  updateFunc?: any;
  mode?: string;
  removeFunc?: any;
}

const ExperienceCard: React.FC<IExperienceProps> = ({
  experienceDTO,
  updateFunc,
  mode = 'view',
  removeFunc
}: IExperienceProps) => {
  const [currentExperienceDTO, setcurrentExperienceDTO] = useState(
    experienceDTO
  );

  useEffect(() => {
    setcurrentExperienceDTO(experienceDTO);
  }, [experienceDTO]);

  const handleChange = (evt: any, index: number) => {
    let value: any;
    if (evt.target.name === 'still') {
      value = evt.target.checked;
    } else {
      value = evt.target.value;
    }

    // 1. Make a shallow copy of the items
    let items = [...currentExperienceDTO.items];

    let item = {
      ...items[index],
      [evt.target.name]: value
    };
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    items[index] = item;

    // 5. Set the state to our new copy
    setcurrentExperienceDTO({ isEnabled: true, items: items });
  };

  const saveChanges = (index: number) => {
    updateFunc(currentExperienceDTO.items[index]);
  };

  const addItem = () => {
    // 1. Make a shallow copy of the items
    let items = [...currentExperienceDTO.items];

    let item: ExperienceItem = {
      guid: Guid.create(),
      description: '',
      isEnabled: true,
      institution: '',
      program: '',
      start: '',
      end: '',
      still: false,
      title: '',
      order: '',
      isEmpty: true
    };
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    items.push(item);

    // 5. Set the state to our new copy
    setcurrentExperienceDTO({ isEnabled: true, items: items });
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
        <IonCard className={styleWidget['overview']}>
          <IonCardHeader>
            <IonGrid>
              <IonRow className="ion-justify-content-between">
                <IonCol>
                  <IonCardTitle>Experience</IonCardTitle>
                </IonCol>
                {mode === 'edit' ? (
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
                  <ExperienceItems
                    experienceItem={x}
                    handleChange={handleChange}
                    updateFunc={saveChanges}
                    index={i}
                    removeFunc={removeItem}
                    mode={mode}
                  />
                  {i < currentExperienceDTO.items.length - 1 ? <Divider /> : ''}
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

export default ExperienceCard;
