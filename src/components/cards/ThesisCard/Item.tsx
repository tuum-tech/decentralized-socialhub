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
// import Image from '../../../elements/Image';
import darkDefaultEduImg from '../../../assets/default/default-edu_dark.png';
import defaultEduImg from '../../../assets/default/default-edu.png';
import styleWidget from '../WidgetCards.module.scss';
import VerificatioBadge from '../../VerificatioBadge';

const EditableContent = styled(IonCol)`
  display: flex;
  padding-left: 10px;
`;

interface ThesisItemProps {
  thesisItem: ThesisItem;
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

const ThesisItem: React.FC<ThesisItemProps> = ({
  thesisItem,
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
    if (thesisItem.logo) {
      return thesisItem.logo;
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
                  {thesisItem.verifiers && thesisItem.verifiers.length > 0 && (
                    <VerificatioBadge
                      userSession={userSession}
                      users={thesisItem.verifiers}
                    />
                  )}
                </IonCol>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Institution template={template}>
                  {thesisItem.title}
                </Institution>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Period template={template}>
                  {thesisItem.still
                    ? ' In the middle of writing...'
                    : thesisItem.publish}
                </Period>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Description template={template}>
                  {thesisItem.description}
                </Description>
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
                      editFunc(thesisItem);
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

export default ThesisItem;
