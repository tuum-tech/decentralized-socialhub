import React from 'react';
import { IonCol, IonRow } from '@ionic/react';
import styled from 'styled-components';

import { ISyncItem, SyncState } from 'src/services/sync.service';
import { VerifiableCredential } from '@elastosfoundation/did-js-sdk/';
import style from './style.module.scss';
import AvatarCredential from 'src/components/AvatarCredential';

const SyncLabel = styled.span`
  font-family: 'SF Pro Display';
  font-size: 12px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: normal;
  text-align: left;
  margin-left: 12px;
`;

const SyncTextValue = styled.span`
  display: block;
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: normal;
  text-align: left;
  margin-left: 12px;
`;

const SyncSelect = styled.select`
  background-color: #edf2f7;
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 500;
  font-size: 15px;
  line-height: 15px;
  border: none;
  height: 30px !important;
  width: 195px;
  box-shadow: 0px 1px 2px rgba(50, 50, 71, 0.08),
    0px 0px 1px rgba(50, 50, 71, 0.2);
  border-radius: 6px;
  padding: 5px;
  color: #718096;
`;

const SyncRowItem = styled(IonRow)`
  border-bottom: 1px solid #cbd5e0;
  align-self: stretch;
  flex-grow: 0;
  margin: 14px 0px;
  padding: 5px 20px;
`;
interface IProps {
  syncItem: ISyncItem;
  updateSyncItem: (syncItem: ISyncItem) => void;
}

const SyncItemElement: React.FC<IProps> = ({
  syncItem,
  updateSyncItem = (syncItem: ISyncItem) => {}
}: IProps) => {
  const getValue = (vc: VerifiableCredential): string => {
    let fragment = vc.getId().getFragment();
    let value = vc.getSubject().getProperties()[fragment];
    return value.toString();
  };

  const renderElement = (
    label: string,
    vc: VerifiableCredential | undefined,
    state: SyncState
  ) => {
    let stateStyle = 'SyncItemElementNormal';
    if (state === syncItem.State) stateStyle = 'SyncItemElementSelected';

    if (label.toLowerCase() == 'avatar') {
      return (
        <>
          <SyncLabel className={style[stateStyle]}>{label}</SyncLabel>
          <AvatarCredential credential={vc}></AvatarCredential>
        </>
      );
    } else {
      let value = ' - ';
      if (vc !== undefined) value = getValue(vc);

      return (
        <>
          <SyncLabel className={style[stateStyle]}>{label}</SyncLabel>
          <SyncTextValue className={style[stateStyle]}>{value}</SyncTextValue>
        </>
      );
    }
  };

  const updateItem = (newValue: string) => {
    let state = SyncState.Waiting;
    if (newValue === '1') state = SyncState.Vault;
    if (newValue === '2') state = SyncState.Blockchain;
    syncItem.State = state;
    updateSyncItem(syncItem);
  };

  return (
    <SyncRowItem ion-align-item-center>
      <IonCol size="5">
        {renderElement(
          syncItem.Label,
          syncItem.VaultCredential,
          SyncState.Vault
        )}
      </IonCol>
      <IonCol size="5">
        {renderElement(
          syncItem.Label,
          syncItem.BlockchainCredential,
          SyncState.Blockchain
        )}
      </IonCol>
      <IonCol size="2">
        <SyncSelect
          value={syncItem.State.toString()}
          disabled={syncItem.BlockchainCredential === undefined}
          onChange={e => {
            updateItem(e.currentTarget.value);
          }}
        >
          <option value="0">Select Version</option>
          <option value="1">Current</option>
          <option value="2">Blockchain</option>
        </SyncSelect>
      </IonCol>
    </SyncRowItem>
  );
};

export default SyncItemElement;
