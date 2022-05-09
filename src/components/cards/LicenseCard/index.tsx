import React, { useState, useEffect } from 'react';
import { IonButton, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/react';
import { Guid } from 'guid-typescript';

import LicenseItem from './Item';

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
import LicenseCardEdit from './Edit';
import ProgressBar from 'src/elements/ProgressBar';

interface ILicenseProps {
  licenseDTO: LicenseDTO;
  updateFunc?: any;
  removeFunc?: any;
  isEditable?: boolean;
  isPublicPage?: boolean;
  template?: string;
  userSession: ISessionItem;
  openModal?: boolean;
}

export const defaultLicenseItem: LicenseItem = {
  guid: Guid.create(),
  isEmpty: true,
  title: '',
  awardDate: '',
  acknowledger: '',
  description: '',
  order: '',
  verifiers: []
};

const LicenseCard: React.FC<ILicenseProps> = ({
  licenseDTO,
  updateFunc,
  removeFunc,
  isEditable = false,
  isPublicPage = false,
  template = 'default',
  userSession,
  openModal = false
}: ILicenseProps) => {
  const [currentLicenseDTO, setCurrentLicenseDTO] = useState(licenseDTO);
  const [licenseVerifiedPercent, setLicenseVerifiedPercent] = useState(0);

  useEffect(() => {
    setCurrentLicenseDTO(licenseDTO);
  }, [licenseDTO]);

  let noOfVerifiedEduCred = 0;

  for (let i = 0; i < licenseDTO.items.length; i++) {
    noOfVerifiedEduCred += (licenseDTO.items[i].verifiers || []).length;
  }

  useEffect(() => {
    setLicenseVerifiedPercent(
      (noOfVerifiedEduCred * 100) / licenseDTO.items.length
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLicenseDTO, noOfVerifiedEduCred]);

  const [editedItem, setEditedItem] = useState(defaultLicenseItem);
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

  const validate = (item: LicenseItem) => {
    if (!item.title || !item.acknowledger || !item.awardDate) return false;

    // if (!pattern.test(item.name)) return false;
    return true;
  };

  const saveChanges = (item: LicenseItem) => {
    let items = [...currentLicenseDTO.items];

    let itemToUpdate = items.find(x => x.guid === item.guid);

    if (itemToUpdate === undefined) {
      items.push(item);
    } else {
      let index = items.indexOf(itemToUpdate);
      items[index] = item;
    }

    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first

    // 5. Set the state to our new copy
    setCurrentLicenseDTO({ isEnabled: true, items: items });
    updateFunc(item);
    setIsEditing(false);
  };

  const cancel = () => {
    setMode(MODE.NONE);
    setIsEditing(false);
  };

  const addItem = () => {
    setMode(MODE.ADD);
    // workaround: defaultLicenseItem will always have the guid generated when the component is created.
    // We must be generated another guid here or else we will edit the last license item created.
    defaultLicenseItem.guid = Guid.create();
    setEditedItem(defaultLicenseItem);
  };

  const editItem = (item: LicenseItem) => {
    setEditedItem(item);
    setMode(MODE.EDIT);
  };

  const removeItem = async (index: number) => {
    let items = [...currentLicenseDTO.items];
    await removeFunc(items[index]);
    items = items.splice(index, 1);
    setCurrentLicenseDTO({ isEnabled: true, items: items });
  };

  if (
    !currentLicenseDTO.isEnabled ||
    (!isEditable && currentLicenseDTO.items.length === 0)
  ) {
    return <></>;
  }

  return (
    <>
      {licenseDTO.isEnabled === true ? (
        <>
          <CardOverview template={template}>
            <CardHeaderContent>
              <IonGrid className="ion-no-padding">
                <IonRow className="ion-justify-content-between ion-no-padding">
                  <IonCol className="ion-no-padding">
                    <IonCardTitle>
                      License
                      {!isEditable && !isPublicPage && (
                        <div
                          style={{
                            width: '10em',
                            float: 'right',
                            fontSize: '0.8em'
                          }}
                        >
                          <ProgressBar
                            value={licenseVerifiedPercent}
                            text={'verified'}
                          />
                          <div
                            style={{ float: 'right', fontSize: '0.8em' }}
                          >{`${licenseVerifiedPercent}% ${'verified'}`}</div>
                        </div>
                      )}
                    </IonCardTitle>
                  </IonCol>
                  {isEditable ? (
                    <IonCol size="auto" className="ion-no-padding">
                      <LinkStyleSpan onClick={e => addItem()}>
                        + Add License
                      </LinkStyleSpan>
                    </IonCol>
                  ) : (
                    ''
                  )}
                </IonRow>
              </IonGrid>
            </CardHeaderContent>
            <CardContentContainer>
              {currentLicenseDTO.items.sort(
                (a: any, b: any) =>
                  new Date(b.start).getTime() - new Date(a.start).getTime()
              ) &&
                currentLicenseDTO.items.map((x, i) => {
                  return (
                    <div key={i}>
                      <LicenseItem
                        licenseItem={x}
                        handleChange={handleChange}
                        updateFunc={saveChanges}
                        editFunc={editItem}
                        index={i}
                        removeFunc={removeItem}
                        isEditable={isEditable}
                        template={template}
                        userSession={userSession}
                      />
                      {i < currentLicenseDTO.items.length - 1 ? (
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
            <LicenseCardEdit
              licenseItem={editedItem}
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

export default LicenseCard;
