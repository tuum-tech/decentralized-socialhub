import React, { useState, useEffect } from 'react';
import { IonButton, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/react';
import { Guid } from 'guid-typescript';

import PaperItem from './Item';

import {
  CardOverview,
  Divider,
  LinkStyleSpan,
  MyModal,
  ModalFooter,
  MODE,
  CardHeaderContent,
  CardContentContainer
} from '../common';
import TeamCardEdit from './Edit';
import ProgressBar from 'src/elements/ProgressBar';

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

const TeamCard: React.FC<IPaperProps> = ({
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
      {paperDTO.isEnabled === true ? (
        <>
          <CardOverview template={template}>
            <CardHeaderContent>
              <IonGrid className="ion-no-padding">
                <IonRow className="ion-justify-content-between ion-no-padding">
                  <IonCol className="ion-no-padding">
                    <IonCardTitle>
                      Paper
                      {!isEditable && !isPublicPage && (
                        <div
                          style={{
                            width: '10em',
                            float: 'right',
                            fontSize: '0.8em'
                          }}
                        >
                          <ProgressBar
                            value={verifiedPercent}
                            text={'verified'}
                          />
                          <div
                            style={{ float: 'right', fontSize: '0.8em' }}
                          >{`${verifiedPercent}% ${'verified'}`}</div>
                        </div>
                      )}
                    </IonCardTitle>
                  </IonCol>
                  {isEditable ? (
                    <IonCol size="auto" className="ion-no-padding">
                      <LinkStyleSpan onClick={e => addItem()}>
                        + Add Paper
                      </LinkStyleSpan>
                    </IonCol>
                  ) : (
                    ''
                  )}
                </IonRow>
              </IonGrid>
            </CardHeaderContent>
            <CardContentContainer>
              {currentPaperDTO.items.sort(
                (a: any, b: any) =>
                  new Date(b.start).getTime() - new Date(a.start).getTime()
              ) &&
                currentPaperDTO.items.map((x, i) => {
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
                      {i < currentPaperDTO.items.length - 1 ? <Divider /> : ''}
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
            <TeamCardEdit
              paperItem={editedItem}
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
      ) : (
        ''
      )}
    </>
  );
};

export default TeamCard;
