import React, { useState } from 'react';
import { IonCol, IonGrid, IonPopover, IonRow } from '@ionic/react';
import styled from 'styled-components';

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
import shieldIcon from '../../../assets/icon/shield.svg';

const EditableContent = styled(IonCol)`
  display: flex;
`;

interface ExperienceItemProps {
  experienceItem: ExperienceItem;
  handleChange: any;
  updateFunc: any;
  editFunc: any;
  index: number;
  initialStatus?: string;
  removeFunc: any;
  isEditable: boolean;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({
  experienceItem,
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
            <Image
              src={experienceItem.logo}
              alt="company logo"
              maxWidth="100px"
            />
          </IonCol>
          <EditableContent size="10">
            <IonGrid className="ion-no-padding">
              <IonRow style={{ float: 'right' }}>
                <IonCol>
                  {experienceItem.isVerified && (
                    <img
                      alt="shield icon"
                      src={shieldIcon}
                      style={{ width: '1em' }}
                    />
                  )}
                </IonCol>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Institution>{experienceItem.institution}</Institution>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Program>{experienceItem.title}</Program>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Period>
                  {experienceItem.start} -
                  {experienceItem.still === true
                    ? ' Present'
                    : experienceItem.end}
                </Period>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Description>{experienceItem.description}</Description>
              </IonRow>
            </IonGrid>

            {isEditable === true ? (
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
                      setShowPopover({ showPopover: false, event: undefined });
                      editFunc(experienceItem);
                    }}
                  >
                    Edit
                  </PopoverMenuItem>
                  <PopoverMenuItem
                    onClick={() => {
                      setShowPopover({ showPopover: false, event: undefined });
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
            ) : (
              ''
            )}
          </EditableContent>
        </IonRow>
      </IonGrid>
    </>
  );
};

export default ExperienceItem;
