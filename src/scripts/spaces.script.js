const { Guid } = require('guid-typescript');
const slugify = require('slugify');
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
  const indexed_spaces = initial_spaces.map(space => {
    return {
      ...space,
      followers: space.owner || []
    };
  });
  Promise.all(
    indexed_spaces.map(async space => {
      const saved = await client.Database.findOne('community_spaces', {
        sid: space.sid
      });
      if (saved) {
        const update = {
          name: space.name,
          slug: slugify(space.name, { lower: true }),
          category: space.category,
          owner: space.owner,
          meta: space.meta,
          followers: [...new Set(saved.followers.concat(space.followers))]
        };
        await client.Database.updateOne(
          'community_spaces',
          { sid: space.sid },
          { $set: update }
        );
      } else {
        await client.Database.insertOne('community_spaces', {
          ...space,
          slug: slugify(space.name, { lower: true }),
          avatar: '',
          coverPhoto: '',
          description: '',
          publicFields: ['about', 'follower'],
          socialLinks: {},
          guid: Guid.create()
        });
      }
    })
  );
  // await client.Database.deleteMany('community_spaces', {});
  // await client.Database.insertMany('community_spaces', indexed_spaces);
};
run();
