import React, { useState, useEffect, useCallback } from 'react';
import { IonCol } from '@ionic/react';
import { Guid } from 'guid-typescript';

import EducationItem from './Item';

import { Divider, LinkStyleSpan, MODE } from '../common';
import EducationCardEdit, { pattern } from './Edit';

import { useRecoilState, useRecoilValue } from 'recoil';

import ProgressVerified from 'src/components/ProgressVerified';
import {
  EducationSelector,
  EducationSortedSelector
} from 'src/Atoms/Selectors';
import Card from 'src/elements-v2/Card';
import Modal from 'src/elements-v2/Modal';

interface IEducationProps {
  updateFunc?: (prevItem: any, item: any) => Promise<boolean>;
  isEditable?: boolean;
  removeFunc?: any;
  requestFunc?: any;
  isPublicPage?: boolean;
  template?: string;
  userSession: ISessionItem;
  openModal?: boolean;
  education?: EducationDTO;
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
  order: '',
  verifiers: []
};

const EducationCard: React.FC<IEducationProps> = ({
  updateFunc,
  removeFunc,
  requestFunc,
  isEditable = false,
  isPublicPage = false,
  template = 'default',
  userSession,
  openModal = false,
  education
}: IEducationProps) => {
  const [educationDTO, setEducationDTO] = useRecoilState(EducationSelector);
  const educationSortedDTO = useRecoilValue(EducationSortedSelector);
  const [eduVerifiedPercent, setEduVerifiedPercent] = useState(0);

  let noOfVerifiedEduCred = 0;

  for (let i = 0; i < educationDTO.items.length; i++) {
    noOfVerifiedEduCred += (educationDTO.items[i].verifiers || []).length;
  }

  useEffect(() => {
    setEduVerifiedPercent(
      (noOfVerifiedEduCred * 100) / educationDTO.items.length
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [educationDTO, noOfVerifiedEduCred]);

  const [prevItem, setPrevItem] = useState(defaultEducationItem);
  const [editedItem, setEditedItem] = useState(defaultEducationItem);
  const [isEditing, setIsEditing] = useState(openModal);
  const [mode, setMode] = useState<MODE>(MODE.NONE);

  useEffect(() => {
    if (mode !== MODE.NONE) {
      setIsEditing(true);
    }
  }, [mode]);

  const handleChange = useCallback(
    (evt: any) => {
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
    },
    [editedItem]
  );

  const validate = (item: EducationItem) => {
    if (
      !item.program ||
      !item.institution ||
      !item.start ||
      (!item.end && !item.still)
    )
      return false;

    if (!pattern.test(item.program)) return false;
    if (!pattern.test(item.institution)) return false;
    return true;
  };

  const saveChanges = useCallback(
    (prevItem: EducationItem, item: EducationItem) => {
      (async () => {
        let items = [...educationDTO.items];

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
            setEducationDTO({ isEnabled: true, items: items });
          }
        }
      })();
    },
    [educationDTO.items, setEducationDTO, updateFunc]
  );

  const handleSave = useCallback(() => {
    if (validate(editedItem)) {
      saveChanges(prevItem, editedItem);
      setMode(MODE.NONE);
    } else {
      setMode(MODE.ERROR);
    }
  }, [editedItem, prevItem, saveChanges]);

  const handleCancel = useCallback(() => {
    setMode(MODE.NONE);
    setIsEditing(false);
  }, []);

  const addItem = () => {
    setMode(MODE.ADD);
    // workaround: defaultEducationItem will always have the guid generated when the component is created.
    // We must be generated another guid here or else we will edit the last education item created.
    defaultEducationItem.guid = Guid.create();
    setEditedItem(defaultEducationItem);
  };

  const editItem = (item: EducationItem) => {
    setPrevItem(item);
    setEditedItem(item);
    setMode(MODE.EDIT);
  };

  const removeItem = async (guid: any) => {
    let items = [...educationDTO.items];
    let toRemove = items.find(x => x.guid.value === guid.value);
    let toRemoveIndex = items.indexOf(toRemove as EducationItem);
    await removeFunc(toRemove);
    items.splice(toRemoveIndex, 1);
    setEducationDTO({ isEnabled: true, items: items });
  };

  if (
    !isEditable &&
    educationDTO.items.length === 0 &&
    education?.items.length === 0
  ) {
    return <></>;
  }

  const getEducationFromParameter = (): any => {
    education?.items.sort(
      (a: any, b: any) =>
        new Date(b.start).getTime() - new Date(a.start).getTime()
    );
    return education?.items.map((x, i) => {
      return (
        <div key={i}>
          <EducationItem
            educationItem={x}
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
          {i < education.items.length - 1 ? <Divider /> : ''}
        </div>
      );
    });
  };

  const getEducationFromState = (): any => {
    return educationSortedDTO.items.map((x, i) => {
      return (
        <div key={i}>
          <EducationItem
            educationItem={x}
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
          {i < educationSortedDTO.items.length - 1 ? <Divider /> : ''}
        </div>
      );
    });
  };

  return (
    <>
      <Card
        template={template}
        title="Education"
        action={
          !isEditable ? (
            !isPublicPage && <ProgressVerified percent={eduVerifiedPercent} />
          ) : (
            <IonCol size="auto" className="ion-no-padding">
              <LinkStyleSpan onClick={e => addItem()}>
                + Add Education
              </LinkStyleSpan>
            </IonCol>
          )
        }
      >
        {education !== undefined
          ? getEducationFromParameter()
          : getEducationFromState()}
      </Card>
      <Modal
        title={mode === MODE.ADD ? 'Add new education' : 'Edit Education'}
        okText={mode === MODE.ADD ? 'Save' : 'Update'}
        isOpen={isEditing}
        onOk={handleSave}
        onClose={handleCancel}
        autoWidth
      >
        <EducationCardEdit
          educationItem={editedItem}
          handleChange={handleChange}
          mode={mode}
        />
      </Modal>
    </>
  );
};

export default EducationCard;
