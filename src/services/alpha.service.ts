import { alertError } from 'src/utils/notify';
import { HiveService } from './hive.service';

export class AlphaService {
  static async isCodeValid(accesscode: string): Promise<boolean> {
    let client = await HiveService.getAppHiveClient();

    let scriptResponse = await client.Scripting.RunScript<any>({
      name: 'get_requestcode_status',
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      },
      params: {
        accesscode: accesscode
      }
    });

    if (
      !scriptResponse.isSuccess ||
      !scriptResponse.response.requeststatus ||
      !scriptResponse.response.requeststatus.items ||
      scriptResponse.response.requeststatus.items.length === 0
    ) {
      return false;
    }

    return !scriptResponse.response.requeststatus.items[0].isUsed;
  }

  private static LocalStorageKey: string = 'invitecode';

  static addInviteCodeToLocal(accessCode: string) {
    window.localStorage.setItem(this.LocalStorageKey, accessCode);
  }

  static async isLocalCodeValid(): Promise<boolean> {
    let localItem = window.localStorage.getItem(this.LocalStorageKey);
    if (!localItem) return false;

    return await this.isCodeValid(localItem);
  }

  static async useCode(accesscode: string, did: string): Promise<boolean> {
    let client = await HiveService.getAppHiveClient();

    let scriptResponse = await client.Scripting.RunScript({
      name: 'user_access_code',
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      },
      params: {
        accesscode: accesscode,
        did: did
      }
    });
    return scriptResponse.isSuccess;
  }

  static async requestAccess(email: string): Promise<boolean> {
    try {
      let URL = `${
        process.env.REACT_APP_MAILCHIMP_URL
      }&EMAIL=${encodeURIComponent(
        email
      )}&b_8d74b221b8912cf1478a69f37_1eb3890eaf=`;
      await fetch(URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      let client = await HiveService.getAppHiveClient();
      let scriptResponse = await client.Scripting.RunScript({
        name: 'email_request_access',
        context: {
          target_did: process.env.REACT_APP_APPLICATION_DID,
          target_app_did: process.env.REACT_APP_APPLICATION_ID
        },
        params: {
          email: email
        }
      });

      return scriptResponse.isSuccess;
    } catch (error) {
      alertError(null, 'Failed request Access');
      return false;
    }
  }
}
