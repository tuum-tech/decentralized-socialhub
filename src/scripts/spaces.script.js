const { Guid } = require('guid-typescript');
const initial_spaces = require('./community_spaces.json');
const config = require('./config.json');
const { testHelper } = require('./testsHelper');

let run = async () => {
  let client = await testHelper.getHiveInstance(
    config.app1,
    config.tuum_tech_mnemonic,
    config.hive_host,
    config.appId
  );
  const users = await client.Database.findMany('users', {});
  const dids = users.map(user => user.did);
  const indexed_spaces = initial_spaces.map(space => {
    return {
      ...space,
      followers:
        space.category === 'Welcome to Profile'
          ? dids.filter(did => did.startsWith('did:'))
          : space.owner || []
    };
  });
  Promise.all(
    indexed_spaces.map(async space => {
      const saved = await client.Database.findOne('community_spaces', {
        sid: space.sid
      });
      console.log(saved);
      if (saved) {
        await client.Database.updateOne(
          'community_spaces',
          { sid: space.sid },
          { $set: space }
        );
      } else {
        await client.Database.insertOne('community_spaces', {
          ...space,
          guid: Guid.create()
        });
      }
    })
  );
  // await client.Database.deleteMany('community_spaces', {});
  // await client.Database.insertMany('community_spaces', indexed_spaces);
};
run();
