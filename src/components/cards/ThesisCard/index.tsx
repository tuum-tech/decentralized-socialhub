import React, { useState, useEffect, useMemo } from 'react';
import { IonCol } from '@ionic/react';
import { Guid } from 'guid-typescript';

import ThesisItem from './Item';

import { Divider, LinkStyleSpan, MODE } from '../common';
import ThesisEditCard from './Edit';
import ProgressBar from 'src/elements/ProgressBar';
import Card from 'src/elements-v2/Card';
import Modal from 'src/elements-v2/Modal';

interface IThesisProps {
  thesisDTO: ThesisDTO;
  updateFunc?: any;
  removeFunc?: any;
  isEditable?: boolean;
  isPublicPage?: boolean;
  template?: string;
  userSession: ISessionItem;
  openModal?: boolean;
}

export const defaultThesisItem: ThesisItem = {
  guid: Guid.create(),
  isEmpty: true,
  title: '',
  publish: '',
  still: false,
  description: '',
  order: '',
  verifiers: []
};

const ThesisCard: React.FC<IThesisProps> = ({
  thesisDTO,
  updateFunc,
  removeFunc,
  isEditable = false,
  isPublicPage = false,
  template = 'default',
  userSession,
  openModal = false
}: IThesisProps) => {
  const [currentThesisDTO, setCurrentThesisDTO] = useState(thesisDTO);
  const [verifiedPercent, setVerifiedPercent] = useState(0);

  const sortedThesisItems = useMemo(() => {
    return [...currentThesisDTO.items].sort(
      (a: any, b: any) =>
        new Date(b.start).getTime() - new Date(a.start).getTime()
    );
  }, [currentThesisDTO]);

  useEffect(() => {
    setCurrentThesisDTO(thesisDTO);
  }, [thesisDTO]);

  let noOfVerifiedEduCred = 0;

  for (let i = 0; i < thesisDTO.items.length; i++) {
    noOfVerifiedEduCred += (thesisDTO.items[i].verifiers || []).length;
  }

  useEffect(() => {
    setVerifiedPercent((noOfVerifiedEduCred * 100) / thesisDTO.items.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentThesisDTO, noOfVerifiedEduCred]);

  const [editedItem, setEditedItem] = useState(defaultThesisItem);
  const [isEditing, setIsEditing] = useState(openModal);
  const [mode, setMode] = useState<MODE>(MODE.NONE);

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

  const validate = (item: ThesisItem) => {
    if (!item.title || (!item.publish && !item.still)) return false;
    return true;
  };

  const saveChanges = (item: ThesisItem) => {
    let items = [...currentThesisDTO.items];

    let itemToUpdate = items.find(x => x.guid === item.guid);

    if (itemToUpdate === undefined) {
      items.push(item);
    } else {
      let index = items.indexOf(itemToUpdate);
      items[index] = item;
    }

    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first

    // 5. Set the state to our new copy
    setCurrentThesisDTO({ isEnabled: true, items: items });
    updateFunc(item);
    setIsEditing(false);
  };

  const cancel = () => {
    setMode(MODE.NONE);
    setIsEditing(false);
  };

  const addItem = () => {
    setMode(MODE.ADD);
    // workaround: defaultThesisItem will always have the guid generated when the component is created.
    // We must be generated another guid here or else we will edit the last thesis item created.
    defaultThesisItem.guid = Guid.create();
    setEditedItem(defaultThesisItem);
  };

  const editItem = (item: ThesisItem) => {
    setEditedItem(item);
    setMode(MODE.EDIT);
  };

  const removeItem = async (index: number) => {
    let items = [...currentThesisDTO.items];
    await removeFunc(items[index]);
    items = items.splice(index, 1);
    setCurrentThesisDTO({ isEnabled: true, items: items });
  };

  if (
    !currentThesisDTO.isEnabled ||
    (!isEditable && currentThesisDTO.items.length === 0)
  ) {
    return <></>;
  }

  return (
    <>
      <Card
        template={template}
        title="Thesis"
        action={
          !isEditable && !isPublicPage ? (
            <div
              style={{
                width: '10em',
                float: 'right',
                fontSize: '0.8em'
              }}
            >
              <ProgressBar value={verifiedPercent} text={'verified'} />
              <div
                style={{ float: 'right', fontSize: '0.8em' }}
              >{`${verifiedPercent}% ${'verified'}`}</div>
            </div>
          ) : isEditable ? (
            <IonCol size="auto" className="ion-no-padding">
              <LinkStyleSpan onClick={e => addItem()}>
                + Add Thesis
              </LinkStyleSpan>
            </IonCol>
          ) : (
            ''
          )
        }
      >
        {sortedThesisItems.map((x, i) => {
          return (
            <div key={i}>
              <ThesisItem
                thesisItem={x}
                handleChange={handleChange}
                updateFunc={saveChanges}
                editFunc={editItem}
                index={i}
                removeFunc={removeItem}
                isEditable={isEditable}
                template={template}
                userSession={userSession}
              />
              {i < sortedThesisItems.length - 1 ? <Divider /> : ''}
            </div>
          );
        })}
      </Card>
      <Modal
        title={mode === MODE.ADD ? 'Add new Thesis' : 'Edit Thesis'}
        okText={mode === MODE.ADD ? 'Save' : 'Update'}
        onOk={() => {
          if (validate(editedItem)) {
            saveChanges(editedItem);
            setMode(MODE.NONE);
          } else {
            setMode(MODE.ERROR);
          }
        }}
        isOpen={isEditing}
        onClose={() => {
          setMode(MODE.NONE);
          setIsEditing(false);
        }}
      >
        <ThesisEditCard
          thesisItem={editedItem}
          handleChange={handleChange}
          mode={mode}
        />
      </Modal>
    </>
  );
};

export default ThesisCard;
