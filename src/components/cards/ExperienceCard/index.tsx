import React, { useState, useEffect } from 'react';
import { IonButton, IonCol, IonRow } from '@ionic/react';
import { Guid } from 'guid-typescript';

import ExperienceItem from './Item';

import ExperienceCardEdit, { pattern } from './Edit';
import { LinkStyleSpan, MyModal, ModalFooter, Divider, MODE } from '../common';
import ProgressVerified from 'src/components/ProgressVerified';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  ExperienceSelector,
  ExperienceSortedSelector
} from 'src/Atoms/Selectors';
import Card from 'src/elements-v2/Card';

interface IExperienceProps {
  updateFunc?: (prevItem: any, item: any) => Promise<boolean>;
  isEditable?: boolean;
  removeFunc?: any;
  requestFunc?: any;
  isPublicPage?: boolean;
  template?: string;
  userSession: ISessionItem;
  openModal?: boolean;
  experience?: ExperienceDTO;
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
  openModal = false,
  experience
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

  const [prevItem, setPrevItem] = useState(defaultExperienceItem);
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

  const saveChanges = async (prevItem: EducationItem, item: ExperienceItem) => {
    let items = [...experienceDTO.items];

    let itemToUpdate = items.find(x => x.guid.value === item.guid.value);
    if (itemToUpdate === undefined) {
      items.push(item);
    } else {
      let index = items.indexOf(itemToUpdate);
      items[index] = item;
    }

    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first

    // 5. Set the state to our new copy

    setIsEditing(false);
    if (updateFunc) {
      if ((await updateFunc(prevItem, item)) === true) {
        setExperienceDTO({ isEnabled: true, items: items });
      }
    }
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
    setPrevItem(item);
    setEditedItem(item);
    setMode(MODE.EDIT);
  };

  const removeItem = async (guid: any) => {
    let items = [...experienceDTO.items];
    let toRemove = items.find(x => x.guid.value === guid.value);
    let toRemoveIndex = items.indexOf(toRemove as ExperienceItem);
    await removeFunc(toRemove);
    items.splice(toRemoveIndex, 1);
    setExperienceDTO({ isEnabled: true, items: items });
  };

  if (
    !isEditable &&
    experienceDTO.items.length === 0 &&
    experience?.items.length === 0
  ) {
    return <></>;
  }

  const getExperienceFromParameter = (): any => {
    experience?.items.sort(
      (a: any, b: any) =>
        new Date(b.start).getTime() - new Date(a.start).getTime()
    );
    return experience?.items.map((x, i) => {
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
          {i < experience.items.length - 1 ? <Divider /> : ''}
        </div>
      );
    });
  };

  const getExperienceFromState = (): any => {
    return experienceSortedDTO.items.map((x, i) => {
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
    });
  };

  return (
    <>
      <Card
        title="Experience"
        action={
          !isEditable ? (
            !isPublicPage && <ProgressVerified percent={expVerifiedPercent} />
          ) : (
            <IonCol size="auto" className="ion-no-padding">
              <LinkStyleSpan onClick={e => addItem()}>
                + Add Experience
              </LinkStyleSpan>
            </IonCol>
          )
        }
      >
        {experience !== undefined
          ? getExperienceFromParameter()
          : getExperienceFromState()}
      </Card>
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
                    saveChanges(prevItem, editedItem);
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
