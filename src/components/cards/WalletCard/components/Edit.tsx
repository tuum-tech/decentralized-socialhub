import React, { useEffect, useState, useRef } from 'react';
import { IonCardTitle, IonCol, IonRow } from '@ionic/react';
import styled from 'styled-components';

import SmallTextInput from '../../../../elements/inputs/SmallTextInput';
import { MODE, MyGrid } from '../../common';
import WalletConnectBtn from 'src/components/WalletConnect';

export const pattern = new RegExp('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$');

const IonRowWrapper = styled(IonRow)`
  --ion-margin: 30px;
`;
interface WalletItemProps {
  wallet: WalletItem;
  handleChange: any;
  mode: MODE;
}

const WalletCardEdit: React.FC<WalletItemProps> = ({
  wallet,
  handleChange,
  mode
}: WalletItemProps) => {
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [address, setAddress] = useState(wallet.address);
  const onConnectMetamask = (account: string) => {
    setAddress(account);
    handleChange({ target: { name: 'address', value: account } });
  };
  useEffect(() => {
    setAddress('');
  }, []);
  return (
    <MyGrid>
      <IonRow>
        <IonCardTitle>Wallet</IonCardTitle>
      </IonRow>
      <div>
        {address ? (
          <>
            <IonRow class="ion-justify-content-start">
              <IonCol size="8">
                <SmallTextInput
                  label="Name"
                  placeholder="e.g. my eth wallet"
                  name="name"
                  hasError={
                    (mode === MODE.ERROR && !wallet.name) ||
                    !pattern.test(wallet.name)
                  }
                  value={wallet.name}
                  onChange={handleChange}
                />
              </IonCol>
            </IonRow>
            <IonRow class="ion-justify-content-start">
              <IonCol size="12">
                <SmallTextInput
                  label="Address"
                  name="address"
                  value={address}
                  onChange={handleChange}
                  disabled={true}
                  inputRef={inputRef}
                />
              </IonCol>
            </IonRow>
          </>
        ) : (
          <IonRowWrapper class="ion-justify-content-center ion-margin-top">
            <WalletConnectBtn onConnectMetamask={onConnectMetamask} />
          </IonRowWrapper>
        )}
      </div>
    </MyGrid>
  );
};

export default WalletCardEdit;
