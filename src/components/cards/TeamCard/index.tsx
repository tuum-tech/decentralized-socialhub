import React, { useState, useEffect, useMemo } from 'react';
import { IonCol } from '@ionic/react';
import { Guid } from 'guid-typescript';

import TeamItem from './Item';

import { Divider, LinkStyleSpan, MODE } from '../common';
import TeamCardEdit from './Edit';
import ProgressBar from 'src/elements/ProgressBar';
import Modal from 'src/elements-v2/Modal';
import Card from 'src/elements-v2/Card';

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

  const sortedTeamItems = useMemo(() => {
    return [...currentTeamDTO.items].sort(
      (a: any, b: any) =>
        new Date(b.start).getTime() - new Date(a.start).getTime()
    );
  }, [currentTeamDTO]);

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
      <Card
        title="Team"
        template={template}
        action={
          !isEditable && !isPublicPage ? (
            <div
              style={{
                width: '10em',
                float: 'right',
                fontSize: '0.8em'
              }}
            >
              <ProgressBar value={teamVerifiedPercent} text={'verified'} />
              <div
                style={{ float: 'right', fontSize: '0.8em' }}
              >{`${teamVerifiedPercent}% ${'verified'}`}</div>
            </div>
          ) : isEditable ? (
            <IonCol size="auto" className="ion-no-padding">
              <LinkStyleSpan onClick={e => addItem()}>+ Add Team</LinkStyleSpan>
            </IonCol>
          ) : (
            ''
          )
        }
      >
        {sortedTeamItems.map((x, i) => {
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
              {i < sortedTeamItems.length - 1 ? <Divider /> : ''}
            </div>
          );
        })}
      </Card>
      <Modal
        title={mode === MODE.ADD ? 'Add new team' : 'Edit Team'}
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
        autoWidth
      >
        <TeamCardEdit
          teamItem={editedItem}
          handleChange={handleChange}
          mode={mode}
        />
      </Modal>
    </>
  );
};

export default TeamCard;
