const { HiveClient, OptionsBuilder } = require("@elastos/elastos-hive-js-sdk");
const { ElastosClient } = require("@elastosfoundation/elastos-js-sdk");
const config = require("./config.json");
const { testHelper } = require("./testsHelper");

let run = async () => {
  let client = await testHelper.getHiveInstance(
    config.app1,
    config.tuum_tech_mnemonic,
    config.hive_host,
    config.appId
  );
  client.Payment.CreateFreeVault();

  // ===== followers section start =====
  await client.Database.createCollection("followers");
  await client.Scripting.SetScript({
    name: "set_followers",
    executable: {
      type: "update",
      name: "set_followers",
      body: {
        collection: "followers",
        filter: {
          did: "$params.did",
        },
        update: {
          $set: {
            did: "$params.did",
            followers: "$params.followers",
          },
        },
        options: {
          upsert: true,
          bypass_document_validation: false,
        },
      },
    },
  });
  await client.Scripting.SetScript({
    name: "get_followers",
    executable: {
      type: "find",
      name: "get_followers",
      output: true,
      body: {
        collection: "followers",
        filter: {
          did: { $in: "$params.did" },
        },
        options: {
          projection: {
            _id: false,
            created: false,
          },
        },
      },
    },
  });
  // ===== followers section end =====

  // ===== users section start =====
  await client.Database.createCollection("users");
  await client.Scripting.SetScript({
    name: "add_user",
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: "insert",
      name: "add_user",
      output: true,
      body: {
        collection: "users",
        document: {
          first_name: "$params.first_name",
          last_name: "$params.last_name",
          name: "$params.full_name",
          email: "$params.email",
          status: "$params.status",
          code: "$params.code",
          did: "$params.did",
          vaulturl: "$params.vaulturl",
        },
      },
    },
  });
  await client.Scripting.SetScript({
    name: "get_users", // by email
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: "find",
      name: "get_users",
      output: true,
      body: {
        collection: "users",
        filter: {
          email: "$params.email",
        },
        options: {
          projection: {
            _id: false,
            created: false,
          },
        },
      },
    },
  });
  await client.Scripting.SetScript({
    name: "get_users_by_did", // by email
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: "find",
      name: "get_users",
      output: true,
      body: {
        collection: "users",
        filter: {
          did: "$params.did",
        },
        options: {
          projection: {
            _id: false,
            created: false,
          },
        },
      },
    },
  });
  await client.Scripting.SetScript({
    name: "update_user_by_did",
    executable: {
      type: "update",
      name: "update_user_by_did",
      output: true,
      body: {
        collection: "users",
        filter: {
          did: "$params.did",
        },
        update: {
          $set: {
            did: "$params.did",
            status: "$params.status",
          },
        },
      },
    },
  });
  await client.Scripting.SetScript({
    name: "verify_code",
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: "aggregated",
      name: "find_and_update_code",
      body: [
        {
          type: "find",
          name: "find_code",
          output: true,
          body: {
            collection: "users",
            filter: {
              code: "$params.code",
              status: "WAITING_CONFIRMATION",
            },
          },
        },
        {
          type: "update",
          name: "update_status",
          output: false,
          body: {
            collection: "users",
            filter: {
              code: "$params.code",
              status: "WAITING_CONFIRMATION",
            },
            update: {
              $set: {
                status: "CONFIRMED",
              },
            },
          },
        },
      ],
    },
  });
  await client.Scripting.SetScript({
    name: "get_users_by_name",
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: "find",
      name: "get_users_by_name",
      output: true,
      body: {
        collection: "users",
        filter: {
          // $regex: { name: '.*$params.name.*' },
          name: { $regex: "$params.name" },
          // name: '$params.name',
        },
      },
    },
  });
  // ===== users section end =====

  // ===== universities section start =====
  //store and retrieve universities data from tuum-tech vault
  await client.Database.createCollection("universities");
  const fs = require("fs");

  fs.readFile("./src/data/world_universities_and_domains.json", (err, data) => {
    if (err) throw err;
    let universityList = JSON.parse(data);
    console.log(universityList[0]);
    client.Database.insertMany("universities", universityList);
  });

  await client.Scripting.SetScript({
    name: "get_universities",
    allowAnonymousUser: true,
    allowAnonymousApp: true,
    executable: {
      type: "find",
      name: "get_universities",
      output: true,
      body: {
        collection: "universities",
        filter: {
          name: { $regex: "$params.name" },
          // $regex: { name: '.*$params.name.*' },
          // name: '$params.name',
        },
      },
    },
  });
  // ===== universities section end =====
  console.log("All scripts OK");
};

run();
