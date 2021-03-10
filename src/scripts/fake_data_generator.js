const { HiveClient, OptionsBuilder } = require('@elastos/elastos-hive-js-sdk')
const { ElastosClient } = require('@elastosfoundation/elastos-js-sdk')
const config = require('./config.json')
const uservault_scripts = require('./uservault.script')
const { testHelper } = require('./testsHelper')

let run = async () => {
  let client = await testHelper.getHiveInstance(
    config.app1,
    config.user1,
    config.hive_host,
    config.appId
  )
  client.Payment.CreateFreeVault()

  await uservault_scripts.UserVaultScripts.Execute(client)

  let user = await ElastosClient.did.loadFromMnemonic(config.dchagastelles)
  let basic_profile = await client.Database.createCollection('basic_profile')
  basic_profile.insertOne({
    did: user.did,
    name: 'Diego Chagastelles',
    about:
      'Experienced Chief Technology Officer with a demonstrated history of working in the financial services industry. Skilled in PHP, Android Development, HTML, Cascading Style Sheets (CSS), and Microsoft PowerPoint. Strong information technology professional with a Bachelor’s degree focused in Computer Software Engineering from University of Management and Technology - UMT. ',
    title: 'Leader, Blockchain ninja, friendly neigbourhood web-developer',
    nationality: 'brazilian',
    birthDate: '1984-04-12',
    address: {
      street_name: 'Phydime-Deschenes',
      number: '307',
      state: 'Quebec',
      country: 'Canada',
      postal_code: 'G2N0K3',
    },
  })

  let experience_profile = await client.Database.createCollection(
    'experience_profile'
  )
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
  })

  let education_profile = await client.Database.createCollection(
    'education_profile'
  )
  education_profile.insertOne({
    institution: 'UFRGS',
    program: 'Computer Engineering',
    field: 'IT',
    start: '2001-02-20',
    end: '2006-11-20',
    description: 'everything I did.',
    period: { start: '2012-05-01', end: '2017-09-12' },
    title: 'undergrad',
  })

  education_profile.insertOne({
    institution: 'MIT',
    program: 'masters',
    field: 'distributed systems',
    start: '2007-02-20',
    end: '2011-11-20',
    description: 'everything I did. Great program.',
    period: { start: '2012-05-01', end: '2017-09-12' },
    title: 'master',
  })

  console.log('All scripts OK')
}

run()
