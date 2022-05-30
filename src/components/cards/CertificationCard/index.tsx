import React, { useState, useEffect, useMemo } from 'react';
import { IonCol } from '@ionic/react';
import { Guid } from 'guid-typescript';

import CertificationItem from './Item';

import { Divider, LinkStyleSpan, MODE } from '../common';
import CertificationCardEdit from './Edit';
import ProgressBar from 'src/elements/ProgressBar';
import Card from 'src/elements-v2/Card';
import Modal from 'src/elements-v2/Modal';

interface ICertificationProps {
  certificationDTO: CertificationDTO;
  updateFunc?: any;
  removeFunc?: any;
  isEditable?: boolean;
  isPublicPage?: boolean;
  template?: string;
  userSession: ISessionItem;
  openModal?: boolean;
}

export const defaultCertificationItem: CertificationItem = {
  guid: Guid.create(),
  isEmpty: true,
  title: '',
  awardDate: '',
  acknowledger: '',
  description: '',
  order: '',
  verifiers: []
};

const CertificationCard: React.FC<ICertificationProps> = ({
  certificationDTO,
  updateFunc,
  removeFunc,
  isEditable = false,
  isPublicPage = false,
  template = 'default',
  userSession,
  openModal = false
}: ICertificationProps) => {
  const [currentCertificationDTO, setCurrentCertificationDTO] = useState(
    certificationDTO
  );
  const [
    certificationVerifiedPercent,
    setCertificationVerifiedPercent
  ] = useState(0);

  const sortedCertificationItems = useMemo(() => {
    return [...currentCertificationDTO.items].sort(
      (a: any, b: any) =>
        new Date(b.start).getTime() - new Date(a.start).getTime()
    );
  }, [currentCertificationDTO]);

  useEffect(() => {
    setCurrentCertificationDTO(certificationDTO);
  }, [certificationDTO]);

  let noOfVerifiedEduCred = 0;

  for (let i = 0; i < certificationDTO.items.length; i++) {
    noOfVerifiedEduCred += (certificationDTO.items[i].verifiers || []).length;
  }

  useEffect(() => {
    setCertificationVerifiedPercent(
      (noOfVerifiedEduCred * 100) / certificationDTO.items.length
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCertificationDTO, noOfVerifiedEduCred]);

  const [editedItem, setEditedItem] = useState(defaultCertificationItem);
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

  const validate = (item: CertificationItem) => {
    if (!item.title || !item.acknowledger || !item.awardDate) return false;

    // if (!pattern.test(item.name)) return false;
    return true;
  };

  const saveChanges = (item: CertificationItem) => {
    let items = [...currentCertificationDTO.items];

    let itemToUpdate = items.find(x => x.guid === item.guid);

    if (itemToUpdate === undefined) {
      items.push(item);
    } else {
      let index = items.indexOf(itemToUpdate);
      items[index] = item;
    }

    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first

    // 5. Set the state to our new copy
    setCurrentCertificationDTO({ isEnabled: true, items: items });
    updateFunc(item);
    setIsEditing(false);
  };

  const cancel = () => {
    setMode(MODE.NONE);
    setIsEditing(false);
  };

  const addItem = () => {
    setMode(MODE.ADD);
    // workaround: defaultCertificationItem will always have the guid generated when the component is created.
    // We must be generated another guid here or else we will edit the last certification item created.
    defaultCertificationItem.guid = Guid.create();
    setEditedItem(defaultCertificationItem);
  };

  const editItem = (item: CertificationItem) => {
    setEditedItem(item);
    setMode(MODE.EDIT);
  };

  const removeItem = async (index: number) => {
    let items = [...currentCertificationDTO.items];
    await removeFunc(items[index]);
    items = items.splice(index, 1);
    setCurrentCertificationDTO({ isEnabled: true, items: items });
  };

  if (
    !currentCertificationDTO.isEnabled ||
    (!isEditable && currentCertificationDTO.items.length === 0)
  ) {
    return <></>;
  }

  return (
    <>
      <Card
        template={template}
        title="Certification"
        action={
          !isEditable && !isPublicPage ? (
            <div
              style={{
                width: '10em',
                float: 'right',
                fontSize: '0.8em'
              }}
            >
              <ProgressBar
                value={certificationVerifiedPercent}
                text={'verified'}
              />
              <div
                style={{ float: 'right', fontSize: '0.8em' }}
              >{`${certificationVerifiedPercent}% ${'verified'}`}</div>
            </div>
          ) : isEditable ? (
            <IonCol size="auto" className="ion-no-padding">
              <LinkStyleSpan onClick={e => addItem()}>
                + Add Certification
              </LinkStyleSpan>
            </IonCol>
          ) : (
            ''
          )
        }
      >
        {currentCertificationDTO.items.sort(
          (a: any, b: any) =>
            new Date(b.start).getTime() - new Date(a.start).getTime()
        ) &&
          sortedCertificationItems.map((x, i) => {
            return (
              <div key={i}>
                <CertificationItem
                  certificationItem={x}
                  handleChange={handleChange}
                  updateFunc={saveChanges}
                  editFunc={editItem}
                  index={i}
                  removeFunc={removeItem}
                  isEditable={isEditable}
                  template={template}
                  userSession={userSession}
                />
                {i < sortedCertificationItems.length - 1 ? <Divider /> : ''}
              </div>
            );
          })}
      </Card>
      <Modal
        title={
          mode === MODE.ADD ? 'Add new Certification' : 'Edit Certification'
        }
        okText={mode === MODE.ADD ? 'Save' : 'Update'}
        onClose={cancel}
        onOk={() => {
          if (validate(editedItem)) {
            saveChanges(editedItem);
            setMode(MODE.NONE);
          } else {
            setMode(MODE.ERROR);
          }
        }}
        isOpen={isEditing}
      >
        <CertificationCardEdit
          certificationItem={editedItem}
          handleChange={handleChange}
          mode={mode}
        />
      </Modal>
    </>
  );
};

export default CertificationCard;
