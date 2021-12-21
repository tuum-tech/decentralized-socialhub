import React, { useMemo, useState } from 'react';
import { IonCardTitle, IonCol, IonRow, IonButton } from '@ionic/react';

import SmallTextInput from '../../../elements/inputs/SmallTextInput';
import { MyGrid } from '../common';
import SmallSelectInput from 'src/elements/inputs/SmallSelectInput';
import style from './RequestCommunityForm.module.scss';

interface Props {
  sendRequest: () => void;
  onClose: () => void;
}

const RequestCommunityForm: React.FC<Props> = ({
  sendRequest,
  onClose
}: Props) => {
  const [request, setRequest] = useState<any>({ category: 'university', network: 'eth' });
  const category = useMemo(() => {
    return request.category;
  }, [request.category]);
  const network = useMemo(() => {
    return request.network;
  }, [request.network]);
  const categories = [
    {
      text: 'NFT Collection',
      value: 'nft'
    },
    {
      text: 'University',
      value: 'university'
    },
    {
      text: 'Company',
      value: 'company'
    }
  ];
  const networks = [
    {
      text: 'Ethereum',
      value: 'eth'
    },
    {
      text: 'Elastos',
      value: 'ela'
    }
  ];
  const onSelectCategory = (value: string) => {
    setRequest({ ...request, category: value });
  };
  const onSelectNetwork = (value: string) => {
    setRequest({ ...request, network: value });
  };
  const onInputChange = (evt: any) => {
    setRequest({
      ...request,
      [evt.target.name]: evt.target.value
    });
  };
  return (
    <MyGrid className={style['form']}>
      <IonRow className={style['form_title']}>
        <IonCardTitle>Request for Community Space</IonCardTitle>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="12">
          <SmallSelectInput
            onChange={onSelectCategory}
            values={categories}
            defaultValue={category}
            label="Space Category"
            placeholder="NFT Collection, Company, University..."
          ></SmallSelectInput>
        </IonCol>
      </IonRow>
      {request && request.category === 'nft' && (
        <IonRow class="ion-justify-content-start">
          <IonCol size="12">
            <SmallSelectInput
              onChange={onSelectNetwork}
              values={networks}
              defaultValue={network}
              label="Network"
              placeholder="Select Network(Ethereum, Elastos...)"
            ></SmallSelectInput>
          </IonCol>
        </IonRow>
      )}
      <IonRow class="ion-justify-content-start">
        <IonCol size="12">
          <SmallTextInput
            label="Name"
            placeholder="BoredApeYatchClub, CryptoPunks. PUNKS Comic..."
            name="name"
            onChange={onInputChange}
          ></SmallTextInput>
        </IonCol>
      </IonRow>
      {request && request.category === 'nft' && (
        <>
          <IonRow class="ion-justify-content-start">
            <IonCol size="12">
              <SmallTextInput
                label="Smart Contract Address"
                name="contract"
                placeholder="e.g.0x5d07b4f9cA73589d84E70A8191ed7fc948f169c0"
                onChange={onInputChange}
              ></SmallTextInput>
            </IonCol>
          </IonRow>
          <IonRow class="ion-justify-content-start">
            <IonCol size="12">
              <SmallTextInput
                label="NFT collection URL (Profile pages)"
                name="nftlink"
                placeholder="https://opensea.io/BoredApeYatchClub"
                onChange={onInputChange}
              ></SmallTextInput>
            </IonCol>
          </IonRow>
        </>
      )}
      {request && request.category !== 'nft' && (
        <>
          <IonRow class="ion-justify-content-start">
            <IonCol size="12">
              <SmallTextInput
                label="Short Description"
                name="description"
                placeholder="https://company.com"
                onChange={onInputChange}
              ></SmallTextInput>
            </IonCol>
          </IonRow>
          <IonRow class="ion-justify-content-start">
            <IonCol size="12">
              <SmallTextInput
                label="Website, Profile Links, etc..."
                name="profilelink"
                placeholder="https://company.com"
                onChange={onInputChange}
              ></SmallTextInput>
            </IonCol>
          </IonRow>
          <IonRow class="ion-justify-content-start">
            <IonCol size="12">
              <SmallTextInput
                label="Social Links"
                name="sociallink"
                placeholder="https://company.com"
                onChange={onInputChange}
              ></SmallTextInput>
            </IonCol>
          </IonRow>
        </>
      )}
      <IonRow className={style['form_footer']}>
        <IonCol size="12">
          <IonButton shape="round" fill="outline" onClick={onClose}>
            Cancel
          </IonButton>
          <IonButton
            shape="round"
            onClick={() => {
              sendRequest();
            }}
          >
            Send Request
          </IonButton>
        </IonCol>
      </IonRow>
    </MyGrid>
  );
};

export default RequestCommunityForm;
