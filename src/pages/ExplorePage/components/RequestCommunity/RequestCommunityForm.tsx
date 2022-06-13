import React, { useEffect, useState } from 'react';
import { IonCol, IonRow, IonGrid } from '@ionic/react';
import Web3 from 'web3';
import SmallTextInput from 'src/elements/inputs/SmallTextInput';
import SmallSelectInput from 'src/elements/inputs/SmallSelectInput';
import { networks } from './constants';
import { DefaultButton } from 'src/elements-v2/buttons';
import { SpaceService, SpaceCategory } from 'src/services/space.service';
import { showNotify } from 'src/utils/notify';
interface Props {
  sendRequest: (request: any) => void;
  onClose: () => void;
}

const RequestCommunityForm: React.FC<Props> = ({
  sendRequest,
  onClose
}: Props) => {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [request, setRequest] = useState<any>({
    category: SpaceCategory.NFT,
    network: 'eth'
  });
  const categories = [{ text: SpaceCategory.NFT, value: SpaceCategory.NFT }];
  const [isOpenseaCollection, setIsOpenseaCollection] = useState<boolean>(
    false
  );
  const onSelectCategory = (value: string) => {
    setRequest({ ...request, category: value });
  };
  const onSelectNetwork = (value: string) => {
    setIsOpenseaCollection(false);
    setRequest({ ...request, network: value });
  };
  const onSelectOpenseaBox = (value: boolean) => {
    setIsOpenseaCollection(value);
    const _request = { ...request };
    if (!value) {
      delete _request['nftlink'];
      setRequest({ ..._request });
    }
  };
  const onInputChange = (evt: any) => {
    setRequest({
      ...request,
      [evt.target.name]: evt.target.value
    });
  };
  const validateRequest = () => {
    if (!request.name) {
      showNotify('Input space name', 'warning');
      return false;
    }
    if (isOpenseaCollection && !request.nftlink) {
      showNotify('Input opensea collection url', 'warning');
      return false;
    }
    if (!Web3.utils.isAddress(request.contract)) {
      showNotify('Invalid smart contract address', 'warning');
      return false;
    }
    if (
      spaces.find(
        (space: any) => space.name.toLowerCase() === request.name.toLowerCase()
      )
    ) {
      showNotify('Community space with same name already exists', 'warning');
      return false;
    }
    if (
      spaces.find(
        (space: any) =>
          space.meta.address?.toLowerCase() === request.contract.toLowerCase()
      )
    ) {
      showNotify(
        'Community space with same contract address already exists',
        'warning'
      );
      return false;
    }
    return true;
  };
  useEffect(() => {
    (async () => {
      const spaces = await SpaceService.getCommunitySpaces();
      setSpaces(spaces);
    })();
  }, []);
  return (
    <IonGrid>
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
      {request && request.category === SpaceCategory.NFT && (
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
      {(request.network === 'eth' || request.network === 'polygon') && (
        <>
          <IonRow class="ion-justify-content-start">
            <IonCol size="12">
              <SmallSelectInput
                onChange={onSelectOpenseaBox}
                values={[
                  { value: true, text: 'Yes' },
                  { value: false, text: 'No' }
                ]}
                defaultValue={isOpenseaCollection}
                label="Is this an Opensea NFT Collection?"
                placeholder="Select whether the collection exists on opensea or not"
              ></SmallSelectInput>
            </IonCol>
          </IonRow>
          {isOpenseaCollection && (
            <IonRow class="ion-justify-content-start">
              <IonCol size="12">
                <SmallTextInput
                  label="Opensea Collection URL"
                  name="nftlink"
                  placeholder="https://opensea.io/BoredApeYatchClub"
                  onChange={onInputChange}
                  value={request.nftlink}
                  hasError={!request.nftlink}
                ></SmallTextInput>
              </IonCol>
            </IonRow>
          )}
        </>
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
      {request && request.category === SpaceCategory.NFT && (
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
        </>
      )}
      {request && request.category !== SpaceCategory.NFT && (
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
      <IonRow className="mt-4">
        <IonCol size="12">
          <DefaultButton
            variant="contained"
            btnColor="primary-gradient"
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
                  'NFT Collection URL': request.nftlink || '',
                  Id: Math.max(...spaces.map(space => space.sid)) + 1
                });
              }
            }}
          >
            Send Request
          </DefaultButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default RequestCommunityForm;
