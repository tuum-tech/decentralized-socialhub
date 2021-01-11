/**
 * example file
 */

// import { ElastosClient } from '@elastosfoundation/elastos-js-sdk';

// const Elastos = {
//     generateDocument: async (didelement:any, profile:any) => {
//         let diddocument = ElastosClient.didDocuments.newDIDDocument(didelement)
//         return ElastosClient.didDocuments.sealDocument(didelement, diddocument)
//     }
// }

// const PublishDocument = async (mnemonic:any, profile:any) => {
//     let didelement = await ElastosClient.did.loadFromMnemonic(mnemonic.join(' '))
//     let isValid = false;


//     //Temporary bypass signature error
//     let signedDocument = null;
//     let tx = null
//     while(!isValid){
//         signedDocument = await Elastos.generateDocument(didelement, profile);
//         isValid = ElastosClient.didDocuments.isValid(signedDocument, didelement)
//     }

//     //Temporary bypass signature error
//     isValid = false;
//     while(!isValid){
//       tx = ElastosClient.idChainRequest.generateCreateRequest(signedDocument, didelement)
//       isValid = ElastosClient.idChainRequest.isValid(tx, didelement)
//     }
    

//     let url = `${process.env.REACT_APP_ASSIST_URL}/v1/didtx/create`
//     let data = {
//       "didRequest" : tx,
//       "requestFrom": "GetDIDs.com",
//       "did": `did:elastos:${didelement.did}`,
//       "memo": ""
//     }

//     let response = await fetch(url, {
//          method: 'POST',
//          headers: {
//             'Content-Type': 'application/json',
//             "Authorization": process.env.REACT_APP_ASSIST_KEY
//          },
//          body: JSON.stringify(data)
//     });

//     let json = await response.json()
//     return {
//       confirmation_id: json.data.confirmation_id,
//       status: "Pending"
//     }

    
//   } 