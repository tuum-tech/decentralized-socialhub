import React, { useState } from 'react';
import { IonCardTitle, IonCol, IonRow, IonButton } from '@ionic/react';
import Web3 from 'web3';
import SmallTextInput from '../../../elements/inputs/SmallTextInput';
import { MyGrid } from '../common';
import SmallSelectInput from 'src/elements/inputs/SmallSelectInput';
import style from './RequestCommunityForm.module.scss';
import { categories, networks } from './constants';
interface Props {
  sendRequest: (request: any) => void;
  onClose: () => void;
}

const RequestCommunityForm: React.FC<Props> = ({
  sendRequest,
  onClose
}: Props) => {
  const [request, setRequest] = useState<any>({
    category: 'nft',
    network: 'eth'
  });
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
  const validateRequest = () => {
    return (
      request.name && request.contract && Web3.utils.isAddress(request.contract)
    );
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
            defaultValue={request.category}
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
              defaultValue={request.network}
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
            value={request.name}
            hasError={!request.name}
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
                value={request.contract}
                hasError={
                  !request.contract || !Web3.utils.isAddress(request.contract)
                }
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
                value={request.nftlink}
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
                value={request.description}
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
                value={request.profilelink}
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
                value={request.sociallink}
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
              if (validateRequest()) {
                const category = categories.find(
                  cg => cg.value === request.category
                );
                const network = networks.find(
                  nt => nt.value === request.network
                );
                // dedicate code for nft collection space.
                sendRequest({
                  'Space Category': category?.text,
                  Network: network?.text,
                  Name: request.name,
                  'Smart Contract Address': request.contract,
                  'NFT Collection URL': request.nftlink || ''
                });
              }
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