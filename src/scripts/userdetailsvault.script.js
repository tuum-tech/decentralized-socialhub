// const { HiveClient, OptionsBuilder } = require("../dist/HiveClient")
// const { ElastosClient } = require("@elastosfoundation/elastos-js-sdk")
// const config = require("./config.json");
// const { testHelper } = require("./testsHelper");
// const { info } = require("console");

const { HiveClient, OptionsBuilder } = require('@elastos/elastos-hive-js-sdk');
const { ElastosClient } = require('@elastosfoundation/elastos-js-sdk');
const config = require('./config.json');
const { testHelper } = require('./testsHelper');

let run = async () => {
  let client = await testHelper.getHiveInstance(
    // config.REACT_APP_APPLICATION_MNEMONICS,
    // config.dchagastelles,
    // config.hive_host,
    // config.REACT_APP_APPLICATION_ID
    config.app1,
    config.dchagastelles,
    config.hive_host,
    config.appId
  );
  client.Payment.CreateFreeVault();
  let user_dchagastelles = await ElastosClient.did.loadFromMnemonic(
    config.dchagastelles
  );
  console.log(user_dchagastelles.did);
  await client.Database.deleteCollection('basic_profile');
  let basic_profile = await client.Database.createCollection('basic_profile');
  basic_profile.insertOne({
    did: user_dchagastelles.did,
    first_name: 'Diego',
    last_name: 'Chagastelles',
    about:
      'Experienced Chief Technology Officer with a demonstrated history of working in the financial services industry. Skilled in PHP, Android Development, HTML, Cascading Style Sheets (CSS), and Microsoft PowerPoint. Strong information technology professional with a Bachelor’s degree focused in Computer Software Engineering from University of Management and Technology - UMT. ',
    title: 'Leader, Blockchain ninja, friendly neigbourhood web-developer',
    nationality: 'brazilian',
    vault_url: '',
    birthDate: '1984-04-12',
    address: {
      street_name: 'Phydime-Deschenes',
      number: '307',
      state: 'Quebec',
      country: 'Canada',
      postal_code: 'G2N0K3',
    },
  });
  await client.Scripting.SetScript({
    name: 'get_basic_profile',
    allowAnonymousUser: false,
    allowAnonymousApp: false,
    executable: {
      type: 'find',
      name: 'get_basic_profile',
      output: true,
      body: {
        collection: 'basic_profile',
      },
    },
    condition: {
      type: 'queryHasResults',
      name: 'verify_user_permission',
      body: {
        collection: 'basic_profile',
        filter: {
          did: '$caller_did',
        },
      },
    },
  });
  await client.Database.deleteCollection('education_profile');
  let education_profile = await client.Database.createCollection(
    'education_profile'
  );
  education_profile.insertOne({
    institution: 'UFRGS',
    program: 'Computer Engineering',
    field: 'IT',
    start: '2001-02-20',
    end: '2006-11-20',
    description: 'everything I did.',
    period: { start: '2012-05-01', end: '2017-09-12' },
    title: 'undergrad',
  });
  education_profile.insertOne({
    institution: 'MIT',
    program: 'masters',
    field: 'distributed systems',
    start: '2007-02-20',
    end: '2011-11-20',
    description: 'everything I did. Great program.',
    period: { start: '2012-05-01', end: '2017-09-12' },
    title: 'master',
  });
  await client.Scripting.SetScript({
    name: 'get_education_profile',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'find',
      name: 'get_education_profile',
      output: true,
      body: {
        collection: 'education_profile',
      },
    },
  });
  await client.Database.deleteCollection('experience_profile');
  let experience_profile = await client.Database.createCollection(
    'experience_profile'
  );
  experience_profile.insertOne({
    isEnabled: true,
    entity: {
      name: 'company A',
      did: 'did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX',
    },
    period: { start: '2010-01-01', end: '2012-01-11' },
    title: 'Specialist Architect',
    description: 'Programming like a boss',
    order: '1',
  });
  await client.Scripting.SetScript({
    name: 'get_experience_profile',
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: 'find',
      name: 'get_experience_profile',
      output: true,
      body: {
        collection: 'experience_profile',
      },
    },
  });
  console.log('All scripts OK');
};
run();
