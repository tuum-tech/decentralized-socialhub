import Web3 from 'web3';
export const signWithMetamask = (
  address: string,
  web3: Web3,
  meta: any
): Promise<any> => {
  const msgParams = JSON.stringify({
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' }
      ],
      Mail: [
        { name: 'Address', type: 'address' },
        { name: 'Nonce', type: 'string' }
      ]
    },
    primaryType: 'Mail',
    domain: {
      name: meta.domain,
      version: '1.0.0-beta'
    },
    message: {
      Address: address,
      Nonce: meta.nonce
    }
  });
  let params = [address, msgParams];
  let method = 'eth_signTypedData_v3';
  const provider = web3.currentProvider;

  return new Promise<any>((resolve, reject) => {
    (provider as any).sendAsync(
      {
        method,
        params,
        from: address
      },
      function(err: any, result: { error: any; result: any }) {
        if (err) reject('error occurred');
        if (result.error) reject('error occurred');
        resolve(result.result);
      }
    );
  });
};

export const shortenAddress = (address: string, chars = 4): string => {
  if (address) {
    return `${address.substring(0, chars + 2)}...${address.substring(
      42 - chars
    )}`;
  } else {
    return `No owner`;
  }
};
