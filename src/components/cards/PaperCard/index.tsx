import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { IonCol } from '@ionic/react';
import { Guid } from 'guid-typescript';

import PaperItem from './Item';

import { Divider, LinkStyleSpan, MODE } from '../common';
import PaperCardEdit from './Edit';
import ProgressBar from 'src/elements/ProgressBar';
import Card from 'src/elements-v2/Card';
import Modal from 'src/elements-v2/Modal';

interface IPaperProps {
  paperDTO: PaperDTO;
  updateFunc?: any;
  removeFunc?: any;
  isEditable?: boolean;
  isPublicPage?: boolean;
  template?: string;
  userSession: ISessionItem;
  openModal?: boolean;
}

export const defaultPaperItem: PaperItem = {
  guid: Guid.create(),
  isEmpty: true,
  title: '',
  publish: '',
  still: false,
  description: '',
  order: '',
  verifiers: []
};

const PaperCard: React.FC<IPaperProps> = ({
  paperDTO,
  updateFunc,
  removeFunc,
  isEditable = false,
  isPublicPage = false,
  template = 'default',
  userSession,
  openModal = false
}: IPaperProps) => {
  const [currentPaperDTO, setCurrentPaperDTO] = useState(paperDTO);
  const [verifiedPercent, setVerifiedPercent] = useState(0);

  const sortedPaperItems = useMemo(() => {
    return [...currentPaperDTO.items].sort(
      (a: any, b: any) =>
        new Date(b.start).getTime() - new Date(a.start).getTime()
    );
  }, [currentPaperDTO]);

  useEffect(() => {
    setCurrentPaperDTO(paperDTO);
  }, [paperDTO]);

  let noOfVerifiedEduCred = 0;

  for (let i = 0; i < paperDTO.items.length; i++) {
    noOfVerifiedEduCred += (paperDTO.items[i].verifiers || []).length;
  }

  useEffect(() => {
    setVerifiedPercent((noOfVerifiedEduCred * 100) / paperDTO.items.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPaperDTO, noOfVerifiedEduCred]);

  const [editedItem, setEditedItem] = useState(defaultPaperItem);
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

  const validate = (item: PaperItem) => {
    if (!item.title || (!item.publish && !item.still)) return false;
    return true;
  };

  const saveChanges = (item: PaperItem) => {
    let items = [...currentPaperDTO.items];

    let itemToUpdate = items.find(x => x.guid === item.guid);

    if (itemToUpdate === undefined) {
      items.push(item);
    } else {
      let index = items.indexOf(itemToUpdate);
      items[index] = item;
    }

    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first

    // 5. Set the state to our new copy
    setCurrentPaperDTO({ isEnabled: true, items: items });
    updateFunc(item);
    setIsEditing(false);
  };

  const cancel = () => {
    setMode(MODE.NONE);
    setIsEditing(false);
  };

  const addItem = () => {
    setMode(MODE.ADD);
    // workaround: defaultPaperItem will always have the guid generated when the component is created.
    // We must be generated another guid here or else we will edit the last paper item created.
    defaultPaperItem.guid = Guid.create();
    setEditedItem(defaultPaperItem);
  };

  const editItem = (item: PaperItem) => {
    setEditedItem(item);
    setMode(MODE.EDIT);
  };

  const removeItem = async (index: number) => {
    let items = [...currentPaperDTO.items];
    await removeFunc(items[index]);
    items = items.splice(index, 1);
    setCurrentPaperDTO({ isEnabled: true, items: items });
  };

  if (
    !currentPaperDTO.isEnabled ||
    (!isEditable && currentPaperDTO.items.length === 0)
  ) {
    return <></>;
  }

  return (
    <>
      <Card
        template={template}
        title="Paper"
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
                + Add Paper
              </LinkStyleSpan>
            </IonCol>
          ) : (
            ''
          )
        }
      >
        {currentPaperDTO.items.sort(
          (a: any, b: any) =>
            new Date(b.start).getTime() - new Date(a.start).getTime()
        ) &&
          sortedPaperItems.map((x, i) => {
            return (
              <div key={i}>
                <PaperItem
                  paperItem={x}
                  handleChange={handleChange}
                  updateFunc={saveChanges}
                  editFunc={editItem}
                  index={i}
                  removeFunc={removeItem}
                  isEditable={isEditable}
                  template={template}
                  userSession={userSession}
                />
                {i < sortedPaperItems.length - 1 ? <Divider /> : ''}
              </div>
            );
          })}
      </Card>
      <Modal
        title={mode === MODE.ADD ? 'Add new Paper' : 'Edit Paper'}
        okText={mode === MODE.ADD ? 'Save' : 'Update'}
        onOk={() => {
          if (validate(editedItem)) {
            saveChanges(editedItem);
            setMode(MODE.NONE);
          } else {
            setMode(MODE.ERROR);
          }
        }}
        onClose={cancel}
        isOpen={isEditing}
      >
        <PaperCardEdit
          paperItem={editedItem}
          handleChange={handleChange}
          mode={mode}
        />
      </Modal>
    </>
  );
};

export default PaperCard;
