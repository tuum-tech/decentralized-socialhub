// import React, { useState, useEffect } from 'react';

// import { UserService, ISessionItem } from 'src/services/user.service';
// import LoadingIndicator from 'src/components/LoadingIndicator';

// import styled from 'styled-components';

// import {
//   OnBoardLayout,
//   OnBoardLayoutLeft,
//   OnBoardLayoutLeftContent,
//   OnBoardLayoutLeftContentTitle,
//   OnBoardLayoutLeftContentDescription,
//   OnBoardLayoutLogo,
//   OnBoardLayoutRight,
//   OnBoardLayoutRightContent,
//   OnBoardLayoutRightContentTitle,
//   WavingHandImg
// } from 'src/components/layouts/OnBoardLayout';

// import ButtonWithLogo from 'src/components/buttons/ButtonWithLogo';
// import TextInput from 'src/components/inputs/TextInput';
// import { Text16 } from 'src/components/texts';

// import whitelogo from 'src/assets/logo/whitetextlogo.png';
// import keyimg from 'src/assets/icon/key.png';

// const ErrorText = styled(Text16)`
//   text-align: center;
//   color: red;
//   margin-top: 8px;
// `;

// const RedirectToProfile = () => {
//   const [loading, setLoading] = useState(false);
//   const sessionStorage_transfer = function(event) {
//     if (!event) {
//       event = window.event;
//     } // ie suq
//     if (!event.newValue) return; // do nothing if no value to work with
//     if (event.key == 'getSessionStorage') {
//       // another tab asked for the sessionStorage -> send it
//       localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
//       // the other tab should now have it, so we're done with it.
//       localStorage.removeItem('sessionStorage'); // <- could do short timeout as well.
//     } else if (event.key == 'sessionStorage' && !sessionStorage.length) {
//       // another tab sent data <- get it
//       var data = JSON.parse(event.newValue);
//       for (var key in data) {
//         sessionStorage.setItem(key, data[key]);
//       }
//     }
//   };

//   useEffect(() => {
//     // listen for changes to localStorage
//     if (window.addEventListener) {
//       window.addEventListener('storage', sessionStorage_transfer, false);
//     } else {
//       window.attachEvent('onstorage', sessionStorage_transfer);
//     }

//     // Ask other tabs for session storage (this is ONLY to trigger event)
//     if (!sessionStorage.length) {
//       localStorage.setItem('getSessionStorage', 'foobar');
//       localStorage.removeItem('getSessionStorage', 'foobar');
//     }
//   }, []);

//   return (
//     <OnBoardLayout>
//       {loading && <LoadingIndicator loadingText="Encrypting now..." />}
//       <OnBoardLayoutLeft>
//         <OnBoardLayoutLogo src={whitelogo} />
//         <OnBoardLayoutLeftContent>
//           <WavingHandImg src={keyimg} />
//           <OnBoardLayoutLeftContentTitle className="mt-18px">
//             Your password is not stored by us
//           </OnBoardLayoutLeftContentTitle>
//           <OnBoardLayoutLeftContentDescription className="mt-25px">
//             This is a locally stored password that protects your main profile
//             account (decentralized identity).
//           </OnBoardLayoutLeftContentDescription>
//         </OnBoardLayoutLeftContent>
//       </OnBoardLayoutLeft>
//       <OnBoardLayoutRight>
//         <OnBoardLayoutRightContent>
//           <OnBoardLayoutRightContentTitle style={{ marginBottom: '46px' }}>
//             Create your password
//           </OnBoardLayoutRightContentTitle>
//         </OnBoardLayoutRightContent>
//       </OnBoardLayoutRight>
//     </OnBoardLayout>
//   );
// };

// export default RedirectToProfile;
