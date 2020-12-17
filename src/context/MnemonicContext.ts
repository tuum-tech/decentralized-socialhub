import React, { useState } from 'react';

//   const [isLogged, setIsLogged] = useState(false);
  
//   const [mnemonic, setMnemonic] = useState([
//     "-",
//     "-",
//     "-",
//     "-",
//     "-",
//     "-",
//     "-",
//     "-",
//     "-",
//     "-",
//     "-",
//     "-",
//   ]);
//   const [did, setDid] = useState(null);

const MnemonicContext = React.createContext({
    mnemonic: [
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
          ],
    did: null,
    isLogged: false
});
// const MnemonicContext = React.createContext({
//     mnemonic,
//     setMnemonic: (generatedMnemonic) => setMnemonic(generatedMnemonic),
//     did,
//     setDid: (generatedDid) => setDid(generatedDid),
//     isLogged
//   });

export default MnemonicContext;