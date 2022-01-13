import React, { useState, useEffect } from 'react';
import { IonButton, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/react';
import { Guid } from 'guid-typescript';

import TeamItem from './Item';

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
import TeamCardEdit, { pattern } from './Edit';
import ProgressBar from 'src/elements/ProgressBar';

interface ITeamProps {
  teamDTO: TeamDTO;
  updateFunc?: any;
  removeFunc?: any;
  isEditable?: boolean;
  isPublicPage?: boolean;
  template?: string;
  userSession: ISessionItem;
  openModal?: boolean;
}

export const defaultTeamItem: TeamItem = {
  guid: Guid.create(),
  isEmpty: true,
  name: '',
  start: '',
  end: '',
  still: false,
  description: '',
  order: '',
  verifiers: []
};

const TeamCard: React.FC<ITeamProps> = ({
  teamDTO,
  updateFunc,
  removeFunc,
  isEditable = false,
  isPublicPage = false,
  template = 'default',
  userSession,
  openModal = false
}: ITeamProps) => {
  const [currentTeamDTO, setCurrentTeamDTO] = useState(teamDTO);
  const [teamVerifiedPercent, setTeamVerifiedPercent] = useState(0);

  useEffect(() => {
    setCurrentTeamDTO(teamDTO);
  }, [teamDTO]);

  let noOfVerifiedEduCred = 0;

  for (let i = 0; i < teamDTO.items.length; i++) {
    noOfVerifiedEduCred += (teamDTO.items[i].verifiers || []).length;
  }

  useEffect(() => {
    setTeamVerifiedPercent((noOfVerifiedEduCred * 100) / teamDTO.items.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTeamDTO, noOfVerifiedEduCred]);

  const [editedItem, setEditedItem] = useState(defaultTeamItem);
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

  const validate = (item: TeamItem) => {
    if (!item.name || !item.start || (!item.end && !item.still)) return false;

    // if (!pattern.test(item.name)) return false;
    return true;
  };

  const saveChanges = (item: TeamItem) => {
    let items = [...currentTeamDTO.items];

    let itemToUpdate = items.find(x => x.guid === item.guid);

    if (itemToUpdate === undefined) {
      items.push(item);
    } else {
      let index = items.indexOf(itemToUpdate);
      items[index] = item;
    }

    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first

    // 5. Set the state to our new copy
    setCurrentTeamDTO({ isEnabled: true, items: items });
    updateFunc(item);
    setIsEditing(false);
  };

  const cancel = () => {
    setMode(MODE.NONE);
    setIsEditing(false);
  };

  const addItem = () => {
    setMode(MODE.ADD);
    // workaround: defaultTeamItem will always have the guid generated when the component is created.
    // We must be generated another guid here or else we will edit the last team item created.
    defaultTeamItem.guid = Guid.create();
    setEditedItem(defaultTeamItem);
  };

  const editItem = (item: TeamItem) => {
    setEditedItem(item);
    setMode(MODE.EDIT);
  };

  const removeItem = async (index: number) => {
    let items = [...currentTeamDTO.items];
    await removeFunc(items[index]);
    items = items.splice(index, 1);
    setCurrentTeamDTO({ isEnabled: true, items: items });
  };

  if (
    !currentTeamDTO.isEnabled ||
    (!isEditable && currentTeamDTO.items.length === 0)
  ) {
    return <></>;
  }

  return (
    <>
      {teamDTO.isEnabled === true ? (
        <>
          <CardOverview template={template}>
            <CardHeaderContent>
              <IonGrid className="ion-no-padding">
                <IonRow className="ion-justify-content-between ion-no-padding">
                  <IonCol className="ion-no-padding">
                    <IonCardTitle>
                      Team
                      {!isEditable && !isPublicPage && (
                        <div
                          style={{
                            width: '10em',
                            float: 'right',
                            fontSize: '0.8em'
                          }}
                        >
                          <ProgressBar
                            value={teamVerifiedPercent}
                            text={'verified'}
                          />
                          <div
                            style={{ float: 'right', fontSize: '0.8em' }}
                          >{`${teamVerifiedPercent}% ${'verified'}`}</div>
                        </div>
                      )}
                    </IonCardTitle>
                  </IonCol>
                  {isEditable ? (
                    <IonCol size="auto" className="ion-no-padding">
                      <LinkStyleSpan onClick={e => addItem()}>
                        + Add Team
                      </LinkStyleSpan>
                    </IonCol>
                  ) : (
                    ''
                  )}
                </IonRow>
              </IonGrid>
            </CardHeaderContent>
            <CardContentContainer>
              {currentTeamDTO.items.sort(
                (a: any, b: any) =>
                  new Date(b.start).getTime() - new Date(a.start).getTime()
              ) &&
                currentTeamDTO.items.map((x, i) => {
                  return (
                    <div key={i}>
                      <TeamItem
                        teamItem={x}
                        handleChange={handleChange}
                        updateFunc={saveChanges}
                        editFunc={editItem}
                        index={i}
                        removeFunc={removeItem}
                        isEditable={isEditable}
                        template={template}
                        userSession={userSession}
                      />
                      {i < currentTeamDTO.items.length - 1 ? <Divider /> : ''}
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
              teamItem={editedItem}
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
