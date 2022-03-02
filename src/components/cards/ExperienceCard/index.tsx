import React, { useState, useEffect } from 'react';
import { IonButton, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/react';
import { Guid } from 'guid-typescript';

import ExperienceItem from './Item';

import ExperienceCardEdit, { pattern } from './Edit';
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
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  ExperienceSelector,
  ExperienceSortedSelector
} from 'src/Atoms/Selectors';

interface IExperienceProps {
  updateFunc?: any;
  isEditable?: boolean;
  removeFunc?: any;
  requestFunc?: any;
  isPublicPage?: boolean;
  template?: string;
  userSession: ISessionItem;
  openModal?: boolean;
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
  updateFunc,
  isEditable = false,
  removeFunc,
  requestFunc,
  isPublicPage = false,
  template = 'default',
  userSession,
  openModal = false
}: IExperienceProps) => {
  const [experienceDTO, setExperienceDTO] = useRecoilState(ExperienceSelector);
  const experienceSortedDTO = useRecoilValue(ExperienceSortedSelector);
  const [expVerifiedPercent, setExpVerifiedPercent] = useState(0);

  let noOfVerifiedExpCred = 0;

  for (let i = 0; i < experienceDTO.items.length; i++) {
    noOfVerifiedExpCred += (experienceDTO.items[i].verifiers || []).length;
  }

  useEffect(() => {
    setExpVerifiedPercent(
      (noOfVerifiedExpCred * 100) / experienceDTO.items.length
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienceDTO, noOfVerifiedExpCred]);

  const [editedItem, setEditedItem] = useState(defaultExperienceItem);
  const [isEditing, setIsEditing] = useState(openModal);
  const [mode, setMode] = useState(MODE.NONE);

  useEffect(() => {
    if (mode !== MODE.NONE) {
      setIsEditing(true);
    }
  }, [mode]);

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

    if (!pattern.test(item.title)) return false;
    if (!pattern.test(item.institution)) return false;
    return true;
  };

  const saveChanges = (item: ExperienceItem) => {
    let items = [...experienceDTO.items];

    let itemToUpdate = items.find(x => x.guid === item.guid);

    if (itemToUpdate === undefined) {
      items.push(item);
    } else {
      let index = items.indexOf(itemToUpdate);
      items[index] = item;
    }

    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first

    // 5. Set the state to our new copy
    setExperienceDTO({ isEnabled: true, items: items });
    updateFunc(item);
    setIsEditing(false);
  };

  const cancel = () => {
    setMode(MODE.NONE);
    setIsEditing(false);
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
    let items = [...experienceDTO.items];
    await removeFunc(items[index]);
    items = items.splice(index, 1);
    setExperienceDTO({ isEnabled: true, items: items });
  };

  if (!isEditable && experienceDTO.items.length === 0) {
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
          {experienceSortedDTO.items.map((x, i) => {
            return (
              <div key={i}>
                <ExperienceItem
                  experienceItem={x}
                  handleChange={handleChange}
                  updateFunc={saveChanges}
                  editFunc={editItem}
                  index={i}
                  removeFunc={removeItem}
                  requestVerification={requestFunc}
                  isEditable={isEditable}
                  template={template}
                  userSession={userSession}
                />
                {i < experienceSortedDTO.items.length - 1 ? <Divider /> : ''}
              </div>
            );
          })}
        </CardContentContainer>
      </CardOverview>
      <MyModal
        onDidDismiss={() => {
          setMode(MODE.NONE);
          setIsEditing(false);
        }}
        isOpen={isEditing}
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
