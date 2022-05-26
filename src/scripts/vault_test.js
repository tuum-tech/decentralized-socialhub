const jwt_decode = require('jwt-decode');
const { ElastosClient } = require('@elastosfoundation/elastos-js-sdk');
const config = require('./config.json');


//const { testHelper } = require('./testsHelper');

global.fetch = require('node-fetch');

let generateUserVerifiablePresentation = async (
  appDid,
  user,
  appChallenge,
  appId
) => {
  let userDid = await ElastosClient.did.loadFromMnemonic(user);
  let jwt = jwt_decode(appChallenge.challenge);
  let iss = jwt.iss;
  let nonce = jwt.nonce;

  //nonce = "14e2401a-e8b5-11eb-9897-0242ac130002";
  let vc = ElastosClient.didDocuments.createVerifiableCredentialVP(
    appDid,
    userDid,
    appId
  );
  console.error('vc:' + JSON.stringify(vc));

  return ElastosClient.didDocuments.createVerifiablePresentation(
    appDid,
    'VerifiablePresentation',
    vc,
    iss,
    nonce
  );
};

let getApplicationDIDDocument = async appDid => {
  let document = ElastosClient.didDocuments.newDIDDocument(appDid);
  return ElastosClient.didDocuments.sealDocument(appDid, document);
};

let run = async () => {
  async function getHiveInstance(app, user, url, appId) {
    let appDid = await ElastosClient.did.loadFromMnemonic(app);
    let builder = new OptionsBuilder();
    await builder.setAppInstance(appId, appDid);
    builder.setHiveHost(url);
    let options = builder.build();
    let appDocument = await getApplicationDIDDocument(appDid);
    let challenge = await HiveClient.getApplicationChallenge(
      options,
      appDocument
    );
    let vp = await generateUserVerifiablePresentation(
      appDid,
      user,
      challenge,
      appId
    );

    vp = JSON.stringify(vp);
    vp = JSON.parse(vp);

    let token = await HiveClient.getAuthenticationToken(options, vp);
    return await HiveClient.createInstance(token, url);
  }

  let client = await getHiveInstance(
    config.tuum_tech_mnemonic,
    config.user_test_mnemonic,
    config.hive_host,
    config.appId
  );
  client.Payment.CreateFreeVault();

  //const fs = require('fs');

  console.log('All scripts OK');
};

run();
