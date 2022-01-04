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
  const [connection, setConnection] = useState(false);
  async function connect() {
    try {
      await activate(injected);
      setConnection(true);
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    if (account && connection) {
      (async () => {
        onConnectMetamask(account);
      })();
    }
  }, [account, connection, onConnectMetamask]);

  return (
    <StyledButton
      width={'182px'}
      height={'40px'}
      onClick={() => {
        connect();
      }}
    >
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
    </StyledButton>
  );
};

export default WalletConnectBtn;
