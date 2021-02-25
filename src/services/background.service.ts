import { HiveService } from './hive.service'
import { UserService } from './user.service'
import { UserVaultScripts } from '../scripts/uservault.script'
// import { DidService } from './did.service';

export interface IGetUserRecordResponse {
  isSuccess: boolean
  response: {
    _status?: string
    get_userrecord: {
      items: IUserRecord[]
    }
  }
}
export interface IUserRecord {
  username: string
  did: string
  hiveHost: string
  migrated: boolean
}

export class BackgroundService {
  static async checkIfUserRecordIsAdded() {
    // can set 'migrated' field True in db forcely for testing
    const sessionItem = UserService.getLoggedUser()
    const appHiveClient = await HiveService.getAppHiveClient()

    let runScriptRes: any = await appHiveClient.Scripting.RunScript({
      name: 'get_userrecord',
      params: {
        did: sessionItem.did,
      },
    })

    // if (runScriptRes) {
    //   const { isSuccess, response } = runScriptRes;
    //   if (!isSuccess || !response._status) {
    //     throw new Error('Error while running get_userrecord script');
    //   }
    //   if (
    //     !response.get_userrecord.items ||
    //     response.get_userrecord.items.length === 0
    //   ) {
    //     console.log(
    //       '====>add this record to the userrecord on tuum.tech vault',
    //       sessionItem
    //     );
    //     await appHiveClient.Scripting.RunScript({
    //       name: 'add_userrecord',
    //       params: {
    //         username: sessionItem.userName,
    //         hiveHost: sessionItem.hiveHost,
    //         migrated: false,
    //         did: sessionItem.did,
    //       },
    //     });
    //     console.log('====>added to the tuum.tech vault');
    //     return false;
    //   }
    //   const { migrated } = response.get_userrecord.items[0];
    //   return migrated;
    // } else {
    //   throw new Error('Error while running get_userrecord script');
    // }
  }

  static async migrate() {
    const sessionItem = UserService.getLoggedUser()
    const appHiveClient = await HiveService.getAppHiveClient()

    await this.checkIfUserRecordIsAdded()
    await appHiveClient.Scripting.RunScript({
      name: 'migrate_userrecord',
      params: {
        did: sessionItem.did,
      },
    })
    console.log('====>flag is set')
  }

  static async addDataToUserDetails(category: string, data: string) {
    let hiveClient = await HiveService.getSessionInstance()
    console.log('=====>hiveClient', hiveClient)
    if (hiveClient) {
      await hiveClient.Scripting.RunScript({
        name: 'add_userdetails',
        params: {
          category: category,
          data: data,
        },
      })
    }
  }

  static async run() {
    // const isMigrated = await this.checkIfUserRecordIsAdded(); // for tumm.tech scripts
    // if (isMigrated) {
    //   // set uservault scripts
    //   let instance = await HiveService.getSessionInstance();
    //   if (instance) {
    //     UserVaultScripts.Execute(instance);
    //   }
    //   // run uservault scripts
    // } else {
    //   // alert user to do migrate his current account
    // }
  }

  static async SetUserScripts() {}
}
