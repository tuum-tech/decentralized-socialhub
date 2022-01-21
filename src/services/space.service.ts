import { IRunScriptResponse } from '@elastosfoundation/elastos-hive-js-sdk/dist/Services/Scripting.Service';
import { getItemsFromData } from 'src/utils/script';
import { HiveService } from './hive.service';
import { UserService } from './user.service';
import { DidService } from './did.service.new';
import { SearchService } from './search.service';
import { showNotify } from 'src/utils/notify';

export class SpaceService {
  static async getAllSpaces(session: ISessionItem) {
    const hiveInstance = await HiveService.getSessionInstance(session);

    if (session && hiveInstance) {
      const result: IRunScriptResponse<SpacesResponse> = await hiveInstance.Scripting.RunScript(
        {
          name: 'get_all_spaces',
          context: {
            target_did: session.did,
            target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
          }
        }
      );
      const spaces = getItemsFromData(result, 'get_all_spaces');
      return spaces;
    }
    return [];
  }
  static async addSpace(session: ISessionItem, space: Space) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'add_space',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: space
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('New space details has been successfuly saved', 'success');
      }
    }
  }
  static async removeSpace(session: ISessionItem, space: Space) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'remove_space',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: space
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Space has been successfuly removed', 'success');
      }
    }
  }
}
