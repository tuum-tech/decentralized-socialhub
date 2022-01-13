import React, { useState, useEffect } from 'react';
import { IonButton, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/react';
import { Guid } from 'guid-typescript';

import GameExpItem from './Item';

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
import GameExpCardEdit, { pattern } from './Edit';
import ProgressBar from 'src/elements/ProgressBar';

interface IGameExpProps {
  gameExpDTO: GameExpDTO;
  updateFunc?: any;
  removeFunc?: any;
  isEditable?: boolean;
  isPublicPage?: boolean;
  template?: string;
  userSession: ISessionItem;
  openModal?: boolean;
}

export const defaultGameExpItem: GameExpItem = {
  guid: Guid.create(),
  isEmpty: true,
  name: '',
  like: 0,
  description: '',
  order: '',
  verifiers: []
};

const GameExpCard: React.FC<IGameExpProps> = ({
  gameExpDTO,
  updateFunc,
  removeFunc,
  isEditable = false,
  isPublicPage = false,
  template = 'default',
  userSession,
  openModal = false
}: IGameExpProps) => {
  const [currentGameExpDTO, setCurrentGameExpDTO] = useState(gameExpDTO);
  const [gameExpVerifiedPercent, setGameExpVerifiedPercent] = useState(0);

  useEffect(() => {
    setCurrentGameExpDTO(gameExpDTO);
  }, [gameExpDTO]);

  let noOfVerifiedEduCred = 0;

  for (let i = 0; i < gameExpDTO.items.length; i++) {
    noOfVerifiedEduCred += (gameExpDTO.items[i].verifiers || []).length;
  }

  useEffect(() => {
    setGameExpVerifiedPercent(
      (noOfVerifiedEduCred * 100) / gameExpDTO.items.length
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGameExpDTO, noOfVerifiedEduCred]);

  const [editedItem, setEditedItem] = useState(defaultGameExpItem);
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

  const validate = (item: GameExpItem) => {
    if (!item.name) return false;

    // if (!pattern.test(item.name)) return false;
    return true;
  };

  const saveChanges = (item: GameExpItem) => {
    let items = [...currentGameExpDTO.items];

    let itemToUpdate = items.find(x => x.guid === item.guid);

    if (itemToUpdate === undefined) {
      items.push(item);
    } else {
      let index = items.indexOf(itemToUpdate);
      items[index] = item;
    }

    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first

    // 5. Set the state to our new copy
    setCurrentGameExpDTO({ isEnabled: true, items: items });
    updateFunc(item);
    setIsEditing(false);
  };

  const cancel = () => {
    setMode(MODE.NONE);
    setIsEditing(false);
  };

  const addItem = () => {
    setMode(MODE.ADD);
    // workaround: defaultGameExpItem will always have the guid generated when the component is created.
    // We must be generated another guid here or else we will edit the last gameExp item created.
    defaultGameExpItem.guid = Guid.create();
    setEditedItem(defaultGameExpItem);
  };

  const editItem = (item: GameExpItem) => {
    setEditedItem(item);
    setMode(MODE.EDIT);
  };

  const removeItem = async (index: number) => {
    let items = [...currentGameExpDTO.items];
    await removeFunc(items[index]);
    items = items.splice(index, 1);
    setCurrentGameExpDTO({ isEnabled: true, items: items });
  };

  if (
    !currentGameExpDTO.isEnabled ||
    (!isEditable && currentGameExpDTO.items.length === 0)
  ) {
    return <></>;
  }

  return (
    <>
      {gameExpDTO.isEnabled === true ? (
        <>
          <CardOverview template={template}>
            <CardHeaderContent>
              <IonGrid className="ion-no-padding">
                <IonRow className="ion-justify-content-between ion-no-padding">
                  <IonCol className="ion-no-padding">
                    <IonCardTitle>
                      Game Experience
                      {!isEditable && !isPublicPage && (
                        <div
                          style={{
                            width: '10em',
                            float: 'right',
                            fontSize: '0.8em'
                          }}
                        >
                          <ProgressBar
                            value={gameExpVerifiedPercent}
                            text={'verified'}
                          />
                          <div
                            style={{ float: 'right', fontSize: '0.8em' }}
                          >{`${gameExpVerifiedPercent}% ${'verified'}`}</div>
                        </div>
                      )}
                    </IonCardTitle>
                  </IonCol>
                  {isEditable ? (
                    <IonCol size="auto" className="ion-no-padding">
                      <LinkStyleSpan onClick={e => addItem()}>
                        + Add Game
                      </LinkStyleSpan>
                    </IonCol>
                  ) : (
                    ''
                  )}
                </IonRow>
              </IonGrid>
            </CardHeaderContent>
            <CardContentContainer>
              {currentGameExpDTO.items.sort(
                (a: any, b: any) =>
                  new Date(b.start).getTime() - new Date(a.start).getTime()
              ) &&
                currentGameExpDTO.items.map((x, i) => {
                  return (
                    <div key={i}>
                      <GameExpItem
                        gameExpItem={x}
                        handleChange={handleChange}
                        updateFunc={saveChanges}
                        editFunc={editItem}
                        index={i}
                        removeFunc={removeItem}
                        isEditable={isEditable}
                        template={template}
                        userSession={userSession}
                      />
                      {i < currentGameExpDTO.items.length - 1 ? (
                        <Divider />
                      ) : (
                        ''
                      )}
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
            <GameExpCardEdit
              gameExpItem={editedItem}
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

export default GameExpCard;
