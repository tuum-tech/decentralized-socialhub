import React from 'react';

const MnemonicContext = React.createContext({
  mnemonic: ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
  did: null,
  isLogged: false
});

export default MnemonicContext;
