import React, { useState } from 'react';
import { IonCol, IonGrid, IonPopover, IonRow } from '@ionic/react';
import styled from 'styled-components';
import Blockies from 'react-blockies';

import {
  Description,
  Institution,
  Period,
  PopoverMenuItem,
  Program,
  TreeDotsButton
} from '../../common';
// import Image from '../../../elements/Image';
import shieldIcon from 'src/assets/icon/shield.svg';
import styleWidget from '../../WidgetCards.module.scss';
import VerificatioBadge from '../../../VerificatioBadge';

const EditableContent = styled(IonCol)`
  display: flex;
  padding-left: 10px;
`;

interface WalletItemProps {
  wallet: WalletItem;
  updateFunc: any;
  editFunc: any;
  index: number;
  initialStatus?: string;
  removeFunc: any;
  isEditable: boolean;
  template?: string;
  userSession: ISessionItem;
}

const WalletItem: React.FC<WalletItemProps> = ({
  wallet,
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

  return (
    <>
      <IonGrid className="ion-no-padding">
        <IonRow className="ion-justify-content-between ion-no-padding">
          <IonCol size="1" className="ion-no-padding">
            <Blockies seed={wallet.name} size={50} scale={1} />
          </IonCol>
          <EditableContent size="11">
            <IonGrid className="ion-no-padding">
              <IonRow style={{ float: 'right' }}>
                <IonCol>
                  <img
                    alt="shield icon"
                    src={shieldIcon}
                    className="social-profile-badge"
                    height={15}
                  />
                </IonCol>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Institution template={template}>{wallet.name}</Institution>
              </IonRow>
              <IonRow className="ion-no-padding">
                <Program template={template}>{wallet.address}</Program>
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
                      editFunc(wallet);
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

export default WalletItem;
