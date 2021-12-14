import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';

import { injected } from './connector';
import { StyledButton } from 'src/elements/buttons';
import MetaMaskIcon from 'src/assets/meta-mask.svg';

const WalletConnectBtn = (props: any) => {
  const { onConnectMetamask } = props;
  const {
    active,
    account,
    library,
    // connector,
    activate,
    deactivate
  } = useWeb3React();

  const [clicked, setClicked] = useState(false);
  async function connect() {
    try {
      await activate(injected);
      setClicked(true);
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
    if (account && clicked) {
      (async () => {
        onConnectMetamask(account);
      })();
    }
  }, [account, library, onConnectMetamask, clicked]);
  useEffect(() => {
    disconnect();
  }, [disconnect]);
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
          {`Connect Wallet`}
        </div>
      )}
    </StyledButton>
  );
};

export default WalletConnectBtn;
