import { InjectedConnector } from '@web3-react/injected-connector';

export const injected = new InjectedConnector({
  // 1 - Ethereum
  // 20 - Elastos Smart Contract Chain
  // 22 - Elastos ID Sidechain
  // 25 - Cronos
  // 56 - Binance Smart Chain
  // 137 - Polygon
  // 250 - Fantom Opera
  supportedChainIds: [1, 3, 4, 5, 20, 22, 25, 42, 56, 137, 250]
});
