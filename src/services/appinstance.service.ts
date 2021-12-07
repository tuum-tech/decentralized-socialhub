import {
  connectivity,
  DID as CNDID
} from '@elastosfoundation/elastos-connectivity-sdk-js';
export class AppInstanceService {
  private static APPINSTANCE_KEY = 'AppInstanceDid';
  public static async getAppInstanceDid(
    session: ISessionItem
  ): Promise<string> {
    if (!session.isEssentialUser)
      return `${process.env.REACT_APP_TUUM_TECH_HIVE}`;

    let appInstanceDid = window.localStorage.getItem(
      `${this.APPINSTANCE_KEY}_${session.did}`
    );
    if (!appInstanceDid) {
      let appDid = process.env.REACT_APP_APPLICATION_DID as string;

      connectivity.setApplicationDID(appDid);
      let didAccess = new CNDID.DIDAccess();
      let response = await didAccess.getExistingAppInstanceDIDInfo();
      appInstanceDid = response.didString;

      window.localStorage.setItem(
        `${this.APPINSTANCE_KEY}_${session.did}`,
        appInstanceDid!
      );
    }

    return appInstanceDid!;
  }
}
