import React, { useEffect, useState } from 'react';
import { IonCol, IonGrid, IonPopover, IonRow } from '@ionic/react';
import styled from 'styled-components';
import shieldIcon from '../../../assets/icon/shield.svg';

import {
  Description,
  Institution,
  Period,
  PopoverMenuItem,
  Program,
  TreeDotsButton
} from '../common';
import Image from '../../Image';
import styleWidget from '../WidgetCards.module.scss';

const EditableContent = styled(IonCol)`
  display: flex;
`;

interface EducationItemProps {
  educationItem: EducationItem;
  handleChange: any;
  updateFunc: any;
  editFunc: any;
  index: number;
  initialStatus?: string;
  removeFunc: any;
  isEditable: boolean;
}

const EducationItem: React.FC<EducationItemProps> = ({
  educationItem,
  editFunc,
  index,
  removeFunc,
  isEditable
}) => {
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined
  });

  const remove = () => {
    removeFunc(index);
  };

  return (
    <>
      <IonGrid className="ion-no-padding">
        <IonRow className="ion-justify-content-between ion-no-padding">
          <IonCol size="2" className="ion-no-padding">
            <div>
              <Image
                src={educationItem.logo}
                alt="university logo"
                maxWidth="100px"
              />
            </div>
          </IonCol>
          <EditableContent size="10">
            <IonGrid className="ion-no-padding">
              <IonRow style={{ float: 'right' }}>
                <IonCol>
                  {educationItem.isVerified && (
                    <img src={shieldIcon} style={{ width: '1em' }} />
                  )}
                </IonCol>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Institution>{educationItem.institution}</Institution>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Program>{educationItem.program}</Program>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Period>
                  {educationItem.start} -
                  {educationItem.still ? ' Present' : educationItem.end}
                </Period>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Description>{educationItem.description}</Description>
              </IonRow>
            </IonGrid>

            {isEditable && (
              <div>
                <IonPopover
                  showBackdrop={false}
                  cssClass={styleWidget['popover-class']}
                  event={popoverState.event}
                  isOpen={popoverState.showPopover}
                  onDidDismiss={() =>
                    setShowPopover({ showPopover: false, event: undefined })
                  }
                >
                  <PopoverMenuItem
                    onClick={e => {
                      setShowPopover({
                        showPopover: false,
                        event: undefined
                      });
                      editFunc(educationItem);
                    }}
                  >
                    Edit
                  </PopoverMenuItem>
                  <PopoverMenuItem
                    onClick={() => {
                      setShowPopover({
                        showPopover: false,
                        event: undefined
                      });
                      remove();
                    }}
                  >
                    Remove
                  </PopoverMenuItem>
                </IonPopover>
                <TreeDotsButton
                  onClick={(e: any) => {
                    e.persist();
                    setShowPopover({ showPopover: true, event: e });
                  }}
                >
                  ...
                </TreeDotsButton>
              </div>
            )}
          </EditableContent>
        </IonRow>
      </IonGrid>
    </>
  );
};

export default EducationItem;
