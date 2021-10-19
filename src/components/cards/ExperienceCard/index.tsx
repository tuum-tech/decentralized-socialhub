import React, { useState, useEffect } from 'react';
import { IonButton, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/react';
import { Guid } from 'guid-typescript';

import ExperienceItem from './Item';

import ExperienceCardEdit from './Edit';
import {
  CardOverview,
  LinkStyleSpan,
  MyModal,
  ModalFooter,
  Divider,
  MODE,
  CardHeaderContent,
  CardContentContainer
} from '../common';
import ProgressBar from 'src/elements/ProgressBar';

interface IExperienceProps {
  experienceDTO: ExperienceDTO;
  updateFunc?: any;
  isEditable?: boolean;
  removeFunc?: any;
  isPublicPage?: boolean;
  template?: string;
  userSession: ISessionItem;
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
  isEnabled: false,
  verifiers: []
};

const ExperienceCard: React.FC<IExperienceProps> = ({
  experienceDTO,
  updateFunc,
  isEditable = false,
  removeFunc,
  isPublicPage = false,
  template = 'default',
  userSession
}: IExperienceProps) => {
  const [currentExperienceDTO, setCurrentExperienceDTO] = useState(
    experienceDTO
  );
  const [expVerifiedPercent, setExpVerifiedPercent] = useState(0);

  useEffect(() => {
    setCurrentExperienceDTO(experienceDTO);
  }, [experienceDTO]);

  let noOfVerifiedExpCred = 0;

  for (let i = 0; i < experienceDTO.items.length; i++) {
    noOfVerifiedExpCred += (experienceDTO.items[i].verifiers || []).length;
  }

  useEffect(() => {
    setExpVerifiedPercent(
      (noOfVerifiedExpCred * 100) / experienceDTO.items.length
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExperienceDTO, noOfVerifiedExpCred]);

  const [editedItem, setEditedItem] = useState(defaultExperienceItem);
  const [mode, setMode] = useState(MODE.NONE);

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

  const validate = (item: ExperienceItem) => {
    if (
      !item.title ||
      !item.institution ||
      !item.start ||
      (!item.end && !item.still)
    )
      return false;
    return true;
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
    setCurrentExperienceDTO({ isEnabled: true, items: items });
    updateFunc(item);
  };

  const cancel = () => {
    setMode(MODE.NONE);
  };

  const addItem = () => {
    setMode(MODE.ADD);
    // workaround: defaultEducationItem will always have the guid generated when the component is created.
    // We must be generated another guid here or else we will edit the last education item created.
    defaultExperienceItem.guid = Guid.create();
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
    setCurrentExperienceDTO({ isEnabled: true, items: items });
  };

  if (
    !experienceDTO.isEnabled ||
    (!isEditable && currentExperienceDTO.items.length === 0)
  ) {
    return <></>;
  }

  return (
    <>
      <CardOverview template={template}>
        <CardHeaderContent>
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-justify-content-between ion-no-padding">
              <IonCol className="ion-no-padding">
                <IonCardTitle>
                  Experience
                  {!isEditable && !isPublicPage && (
                    <div
                      style={{
                        width: '10em',
                        float: 'right',
                        fontSize: '0.8em'
                      }}
                    >
                      <ProgressBar
                        value={expVerifiedPercent}
                        text={'verified'}
                      />
                      <div
                        style={{ float: 'right', fontSize: '0.8em' }}
                      >{`${expVerifiedPercent}% ${'verified'}`}</div>
                    </div>
                  )}
                </IonCardTitle>
              </IonCol>
              {isEditable ? (
                <IonCol size="auto" className="ion-no-padding">
                  <LinkStyleSpan onClick={e => addItem()}>
                    + Add Experience
                  </LinkStyleSpan>
                </IonCol>
              ) : (
                ''
              )}
            </IonRow>
          </IonGrid>
        </CardHeaderContent>
        <CardContentContainer>
          {currentExperienceDTO.items.sort(
            (a: any, b: any) =>
              new Date(b.start).getTime() - new Date(a.start).getTime()
          ) &&
            currentExperienceDTO.items.map((x, i) => {
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
                    template={template}
                    userSession={userSession}
                  />
                  {i < currentExperienceDTO.items.length - 1 ? <Divider /> : ''}
                </div>
              );
            })}
        </CardContentContainer>
      </CardOverview>
      <MyModal
        onDidDismiss={() => setMode(MODE.NONE)}
        isOpen={mode !== MODE.NONE}
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
                  if (validate(editedItem)) {
                    saveChanges(editedItem);
                    setMode(MODE.NONE);
                  } else {
                    setMode(MODE.ERROR);
                  }
                }}
              >
                Save
              </IonButton>
            </IonCol>
          </IonRow>
        </ModalFooter>
      </MyModal>
    </>
  );
};

export default ExperienceCard;
