const spaces = require('./community_spaces.json');
const config = require('./config.json');
const { testHelper } = require('./testsHelper');
let run = async () => {
  let client = await testHelper.getHiveInstance(
    config.app1,
    config.tuum_tech_mnemonic,
    config.hive_host,
    config.appId
  );
  await client.Database.deleteMany('community_spaces', {});
  await client.Database.insertMany('community_spaces', spaces);
  await client.Database.insertMany('spaces', spaces.map((space) => ({
    name: space.name,
    owner: config.appId,
  })))
};
run();
