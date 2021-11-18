import React, { useState } from 'react';
import { IonCol, IonRow } from '@ionic/react';
import styled from 'styled-components';

import { ISyncItem, SyncState } from 'src/services/sync.service';
import { VerifiableCredential } from '@elastosfoundation/did-js-sdk/';
import style from './style.module.scss';
import AvatarCredential from 'src/components/AvatarCredential';
import { Guid } from 'guid-typescript';
import EducationCard from 'src/components/cards/EducationCard';
import EducationElement from '../EducationElement';
import ExperienceElement from '../ExperienceElement';
import { DidService } from 'src/services/did.service.new';
import { UserService } from 'src/services/user.service';

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
  userSession: ISessionItem;
}

interface verifier {
  name: string;
  did: string;
}

const SyncItemElement: React.FC<IProps> = ({
  syncItem,
  userSession,
  updateSyncItem = (syncItem: ISyncItem) => {}
}: IProps) => {
  const [verifiers, setVerifiers] = useState<Map<string, verifier>>();

  const getValue = (vc: VerifiableCredential): string => {
    let fragment = vc.getId().getFragment();
    let value = vc.getSubject().getProperties()[fragment];
    return value.toString();
  };

  const hasVerifier = (vc: VerifiableCredential): boolean => {
    if (vc === undefined) return false;
    if (
      vc
        .getId()
        .getDid()
        .equals(vc.issuer)
    )
      return false;

    if (verifiers === undefined || !verifiers.has(vc.issuer.toString())) {
      let verifiersCollection = verifiers ?? new Map<string, verifier>();
      verifiersCollection.set(vc.issuer.toString(), {
        name: 'Loading',
        did: vc.issuer.toString()
      });
      setVerifiers(verifiersCollection);

      DidService.getInstance().then(s => {
        let userService = new UserService(s);
        userService.SearchUserWithDID(vc.issuer.toString()).then(response => {
          if (response === undefined) return;
          let newCollection = verifiers ?? new Map<string, verifier>();
          newCollection?.set(response.did, {
            name: response.name,
            did: response.did
          });
          setVerifiers(newCollection);
        });
      });
    }

    return true;
  };

  const renderElement = (
    label: string,
    vc: VerifiableCredential | undefined,
    state: SyncState
  ) => {
    let stateStyle = 'SyncItemElementNormal';
    if (state === syncItem.State) stateStyle = 'SyncItemElementSelected';

    if (vc === undefined) {
      let value = ' - ';
      return (
        <>
          {label !== 'Education' && label !== 'Experience' && (
            <SyncLabel className={style[stateStyle]}>{label}</SyncLabel>
          )}
          <SyncTextValue className={style[stateStyle]}>{value}</SyncTextValue>
        </>
      );
    }

    switch (label) {
      case 'Avatar':
        return (
          <>
            <SyncLabel className={style[stateStyle]}>{label}</SyncLabel>
            <AvatarCredential credential={vc}></AvatarCredential>
          </>
        );
        break;

      case 'Education':
        let subjectEducation = vc!.getSubject().getProperty(
          vc!
            .getId()
            .getFragment()
            .toLowerCase()
        );
        let educationItem: EducationItem = {
          end:
            subjectEducation['end'] === undefined
              ? ''
              : subjectEducation['end'],
          institution: subjectEducation['institution'],
          start: subjectEducation['start'],
          still: subjectEducation['end'] === undefined,
          program: subjectEducation['program'],
          guid: Guid.create(),
          isEmpty: false,
          title: '',
          description: '',
          order: '',
          verifiers: []
        };

        let hasEduVerifier = hasVerifier(vc);
        let issuerDidEdu = vc.getIssuer().toString();

        return (
          <EducationElement
            userSession={userSession}
            educationItem={educationItem}
            isSelected={state === syncItem.State}
            verifiedby={verifiers && verifiers!.get(issuerDidEdu)!}
          ></EducationElement>
        );

      case 'Experience':
        let subjectExperience = vc!.getSubject().getProperty(
          vc!
            .getId()
            .getFragment()
            .toLowerCase()
        );
        let experienceItem: ExperienceItem = {
          end:
            subjectExperience['end'] === undefined
              ? ''
              : subjectExperience['end'],
          institution:
            subjectExperience['institution'] === undefined
              ? ''
              : subjectExperience['institution'],
          start: subjectExperience['start'],
          still: subjectExperience['end'] === undefined,
          program: subjectExperience['program'],
          guid: Guid.create(),
          isEmpty: false,
          title:
            subjectExperience['title'] === undefined
              ? ''
              : subjectExperience['title'],
          description:
            subjectExperience['description'] === undefined
              ? ''
              : subjectExperience['description'],
          order:
            subjectExperience['order'] === undefined
              ? ''
              : subjectExperience['order'],
          verifiers: [],
          isEnabled: true
        };

        let hasExpVerifier = hasVerifier(vc);
        let issuerDidExp = vc.getIssuer().toString();

        return (
          <ExperienceElement
            userSession={userSession}
            isSelected={state === syncItem.State}
            verifiedby={verifiers && verifiers!.get(issuerDidExp)!}
            experienceItem={experienceItem}
          ></ExperienceElement>
        );

      default:
        let defaultValue = getValue(vc);
        let hasVerifierToShow = hasVerifier(vc);
        let issuerDid = vc.getIssuer().toString();
        return (
          <>
            <SyncLabel className={style[stateStyle]}>{label}</SyncLabel>
            <SyncTextValue className={style[stateStyle]}>
              {defaultValue}
            </SyncTextValue>
            {verifiers && hasVerifierToShow && (
              <>
                <SyncTextValue className={style[stateStyle]}>
                  Verified by: {verifiers!.get(issuerDid)!.name}
                </SyncTextValue>
                <SyncTextValue className={style[stateStyle]}>
                  {verifiers!.get(issuerDid)!.did}
                </SyncTextValue>
              </>
            )}
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
