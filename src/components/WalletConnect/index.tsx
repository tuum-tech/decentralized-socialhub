import React, { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from './connector';

import { StyledButton } from 'src/elements/buttons';
import MetaMaskIcon from 'src/assets/meta-mask.svg';

const WalletConnectBtn = (props: any) => {
  const { onConnectMetaMask } = props;
  const {
    active,
    account,
    // library,
    // connector,
    activate,
    deactivate
  } = useWeb3React();

  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    if (account) {
      onConnectMetaMask(account);
    }
  }, [account, onConnectMetaMask]);
  return (
    <StyledButton
      width={'182px'}
      height={'40px'}
      onClick={() => {
        if (account) {
          disconnect();
        } else {
          connect();
        }
      }}
    >
      {account ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img
            src={MetaMaskIcon}
            alt="meta-mask"
            width="25"
            style={{
              marginRight: '10px'
            }}
          />
          {`${account.substring(0, 8)} ... ${account.substring(
            account.length - 4
          )}`}
        </div>
      ) : (
        'Connect Wallet'
      )}
    </StyledButton>
  );
};

export default WalletConnectBtn;
