// import { combineReducers } from 'redux';
import { AssistService } from "./assist.service";
import { DidService } from "./did.service";
import { CredentialType, DidcredsService } from "./didcreds.service";
import { HiveService } from "./hive.service";

const CryptoJS = require("crypto-js");

export enum AccountType {
  DID = "DID",
  Linkedin = "Linkedin",
  Facebook = "Facebook",
  Google = "Google",
  Twitter = "Twitter",
}

export interface ISessionItem {
  hiveHost: string;
  userToken: string;
  accountType: AccountType;
  did: string;
  firstName: string;
  lastName: string;
  isDIDPublished: boolean;
  onBoardingCompleted: boolean;
}

export interface ITemporaryDID {
  mnemonic: string;
  confirmationId: string;
}

export interface UserData {
  did: string;
  name: string;
  data: string;
}

export interface SignInDIDData {
  firstName: string;
  lastName: string;
  did: string;
  hiveHost: string;
  userToken: string;
  isDIDPublished: boolean;
}

export class UserService {
  private static key(did: string): string {
    return `user_${did.replace("did:elastos:", "")}`;
  }

  public static getSignedUsers(): string[] {
    let response: string[] = [];

    for (var i = 0, len = window.localStorage.length; i < len; ++i) {
      let key = window.localStorage.key(i);
      if (key && key.startsWith("user_")) {
        response.push(key.replace("user_", "did:elastos:"));
      }
    }
    return response;
  }

  public static getPrevDiD(id: string, appName: string): UserData[] {
    let userKey = appName + "_" + id;
    let response: UserData[] = [];
    for (var i = 0, len = window.localStorage.length; i < len; ++i) {
      let key = window.localStorage.key(i);
      console.log("====>key, userKey", key, userKey);
      if (key === userKey) {
        const localData = window.localStorage.getItem(key);
        if (localData) {
          console.log("====>JSON.parse(localData)", JSON.parse(localData));
          response.push(JSON.parse(localData));
        }
      }
    }
    return response;
  }

  // public static getOtherUsers(appName: string): string[] {
  //   let appKey = appName + '_';
  //   let response: string[] = [];
  //   for (var i = 0, len = window.localStorage.length; i < len; ++i) {
  //     let key = window.localStorage.key(i);
  //     if (key && key.startsWith(appKey)) {
  //       response.push(key.replace(appKey, ''));
  //     }
  //   }
  //   return response;
  // }

  public static GetUserSession(): ISessionItem {
    let item = window.sessionStorage.getItem("session_instance");

    if (!item) {
      throw Error("Not logged in");
    }

    return JSON.parse(item);
  }

  public static SignInWithDID(data: SignInDIDData, storePassword: string) {
    let sessionItem: ISessionItem = {
      did: data.did,
      accountType: AccountType.DID,
      isDIDPublished: data.isDIDPublished,
      firstName: data.firstName,
      lastName: data.lastName,
      hiveHost: data.hiveHost,
      userToken: data.userToken,
      onBoardingCompleted: false,
    };

    this.lockUser(this.key(data.did), sessionItem, storePassword);
    SessionService.saveSessionItem(sessionItem);
  }

  public static async SignIn3rdParty(
    id: string,
    fname: string,
    lname: string,
    token: string,
    service: AccountType,
    email: string,
    credential: string,
    storePassword: string
  ) {
    console.log("Sign in with", service.toString());
    let sessionItem: ISessionItem;

    let did = await this.generateTemporaryDID(service, credential);
    sessionItem = {
      did: did,
      accountType: service,
      isDIDPublished: false,
      firstName: fname,
      lastName: lname,
      hiveHost: "http://localhost:5000",
      userToken: token,
      onBoardingCompleted: false,
    };

    // add new user to the tuum.tech vault
    const get_users_scripts = {
      name: "add_user",
      params: {
        first_name: fname,
        last_name: lname,
        full_name: fname + " " + lname,
        email: email,
        status: "CONFIRMED",
        code: 1,
        did: did,
        vaulturl: sessionItem.hiveHost,
      },
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID,
      },
    };
    const url = `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/tuumvault_router/scripting/run_script`;
    const postData: any = {
      method: "POST",
      headers: {
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: "application/json",
        charset: "utf8",
        "content-type": "application/json",
      },
      body: JSON.stringify(get_users_scripts),
    };
    let response = await fetch(url, postData);
    console.log("=====>response", response);

    console.log(sessionItem);
    this.lockUser(this.key(did), sessionItem, storePassword);
    SessionService.saveSessionItem(sessionItem);
  }

  private static getCredentialType(service: AccountType): CredentialType {
    if (service === AccountType.Facebook) return CredentialType.Facebook;
    if (service === AccountType.Twitter) return CredentialType.Twitter;
    if (service === AccountType.Google) return CredentialType.Google;
    if (service === AccountType.Linkedin) return CredentialType.Linkedin;
    throw Error("Invalid account type");
  }

  private static async generateTemporaryDID(
    service: AccountType,
    credential: string
  ): Promise<string> {
    console.log("Generating temporary DID");
    let newDID = await DidService.generateNew();
    let temporaryDocument = await DidService.temporaryDidDocument(newDID);

    let vc = DidcredsService.generateVerifiableCredential(
      newDID.did,
      this.getCredentialType(service),
      credential
    );

    DidService.addVerfiableCredentialToDIDDocument(temporaryDocument, vc);

    DidService.sealDIDDocument(newDID, temporaryDocument);

    let requestPub = await DidService.generatePublishRequest(temporaryDocument);

    let response = await AssistService.publishDocument(newDID.did, requestPub);

    window.localStorage.setItem(
      `temporary_${newDID.did.replace("did:elastos:", "")}`,
      JSON.stringify({
        mnemonic: newDID.mnemonic,
      })
    );

    window.localStorage.setItem(
      `publish_${response.confirmationId}`,
      JSON.stringify({
        confirmationId: response.confirmationId,
        status: response.requestStatus,
      })
    );

    return newDID.did;
  }

  static getLoggedUser(): ISessionItem {
    return SessionService.getSession();
  }

  private static lockUser(
    key: string,
    instance: ISessionItem,
    storePassword: string
  ) {
    console.log("======>localUserData", key, instance, storePassword);
    let encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(instance),
      storePassword
    ).toString();
    let localUserData: UserData = {
      name: instance.firstName + " " + instance.lastName,
      did: instance.did,
      data: encrypted,
    };
    let json = JSON.stringify(localUserData, null, "");
    window.localStorage.setItem(key, json);
  }

  private static unlockUser(key: string, storePassword: string): ISessionItem {
    console.log("Unlocking user", key);
    let item = window.localStorage.getItem(key);

    if (!item) throw new Error("User not found");

    try {
      let userData: UserData = JSON.parse(item);
      console.log("user data", userData);
      let decrypted = CryptoJS.AES.decrypt(userData.data, storePassword);
      console.log("decrypted", decrypted);
      let instance = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
      console.log("instance", instance);
      if (!instance && !instance.userToken)
        throw new Error("Incorrect password");
      return instance;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public static LoginWithPassword(
    did: string,
    storePassword: string
  ): ISessionItem | null {
    try {
      let instance = this.unlockUser(this.key(did), storePassword);
      SessionService.saveSessionItem(instance);
      return instance;
    } catch (error) {
      return null;
    }
  }

  public static setOnBoardingComplted() {
    let item = window.sessionStorage.getItem("session_instance");
    if (item) {
      const sessionItem = JSON.parse(item);
      sessionItem.onBoardingCompleted = true;
      window.sessionStorage.setItem(
        "session_instance",
        JSON.stringify(sessionItem, null, "")
      );
    }
  }

  public static Login(did: string, storePassword: string) {
    let instance = this.unlockUser(this.key(did), storePassword);
    SessionService.saveSessionItem(instance);
  }

  public static logout() {
    SessionService.Logout();
  }
}

//To be
class SessionService {
  static getSession(): ISessionItem {
    let item = window.sessionStorage.getItem("session_instance");

    if (!item) {
      throw Error("Not logged in");
    }

    let instance = JSON.parse(item);
    return instance;
  }

  static saveSessionItem(item: ISessionItem) {
    window.sessionStorage.clear();
    window.sessionStorage.setItem(
      "session_instance",
      JSON.stringify(item, null, "")
    );
  }

  static Logout() {
    window.sessionStorage.clear();
  }
}
