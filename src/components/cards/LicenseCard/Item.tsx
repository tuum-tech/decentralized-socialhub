import React, { useState } from 'react';
import { IonCol, IonGrid, IonPopover, IonRow } from '@ionic/react';
import styled from 'styled-components';

import {
  Description,
  Institution,
  Period,
  PopoverMenuItem,
  TreeDotsButton
} from '../common';
// import Image from '../../../elements/Image';
import darkDefaultEduImg from '../../../assets/default/default-edu_dark.png';
import defaultEduImg from '../../../assets/default/default-edu.png';
import styleWidget from '../WidgetCards.module.scss';
import VerificatioBadge from '../../VerificatioBadge';

const EditableContent = styled(IonCol)`
  display: flex;
  padding-left: 10px;
`;

interface LicenseItemProps {
  licenseItem: LicenseItem;
  handleChange: any;
  updateFunc: any;
  editFunc: any;
  index: number;
  initialStatus?: string;
  removeFunc: any;
  isEditable: boolean;
  template?: string;
  userSession: ISessionItem;
}

const LicenseItem: React.FC<LicenseItemProps> = ({
  licenseItem,
  editFunc,
  index,
  removeFunc,
  isEditable,
  template = 'default',
  userSession
}) => {
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined
  });

  const remove = () => {
    removeFunc(index);
  };

  const experienceItemLogo = () => {
    if (licenseItem.logo) {
      return licenseItem.logo;
    } else if (template === 'gamer' || template === 'crypto') {
      return darkDefaultEduImg;
    }
    return defaultEduImg;
  };

  return (
    <>
      <IonGrid className="ion-no-padding">
        <IonRow className="ion-justify-content-between ion-no-padding">
          <IonCol size="2" className="ion-no-padding">
            <div>
              <img
                src={experienceItemLogo()}
                alt="university logo"
                width="100px"
              />
            </div>
          </IonCol>
          <EditableContent size="10">
            <IonGrid className="ion-no-padding">
              <IonRow style={{ float: 'right' }}>
                <IonCol>
                  {licenseItem.verifiers &&
                    licenseItem.verifiers.length > 0 && (
                      <VerificatioBadge
                        userSession={userSession}
                        users={licenseItem.verifiers}
                      />
                    )}
                </IonCol>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Institution template={template}>
                  {licenseItem.title}
                </Institution>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Period template={template}>{licenseItem.awardDate}</Period>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Description template={template}>
                  {licenseItem.description}
                </Description>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Institution template={template}>
                  {licenseItem.acknowledger}
                </Institution>
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
                      editFunc(licenseItem);
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

export default LicenseItem;
