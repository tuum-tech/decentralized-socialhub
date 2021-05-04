import { alertError } from 'src/utils/notify';
import { AssistService } from './assist.service';
import { DidService, PublishRequestOperation } from './did.service';
import { EventsService, IEventCallback } from './events.service';
import { UserService } from './user.service';

export interface IDIDDocumentState {
  diddocument: any;
  isChanged: boolean;
}

export interface IDocumentChangeCallback extends IEventCallback {
  callback<IDIDDocumentState>(data: IDIDDocumentState): void;
}

export class DidDocumentService {
  private static DOCUMENT_CHANGE_EVENT = 'DocumentChangeEvent';
  private static DIDDOCUMENT_KEY = 'userdiddocument';

  static listenDocumentChange(
    id: string,
    callbackMethod: (data: IDIDDocumentState) => void
  ) {
    // let callbackItem :IDocumentChangeCallback = {
    //     callback: (data) =>{
    //         callbackMethod(data);
    //     }
    // }
    // EventsService.addListener(this.DOCUMENT_CHANGE_EVENT, id, callbackItem)
  }

  static unlistenDocumentChange(id: string) {
    EventsService.removeListener(this.DOCUMENT_CHANGE_EVENT, id);
  }

  private static triggerDocumentChangeEvent(documentstate: IDIDDocumentState) {
    EventsService.trigger(this.DOCUMENT_CHANGE_EVENT, documentstate);
  }

  private static getDocumentState(userDID: string): IDIDDocumentState | null {
    let json = window.localStorage.getItem(
      `${this.DIDDOCUMENT_KEY}_${userDID.replace('did:elastos:', '')}`
    );

    if (!json) return null;
    return JSON.parse(json);
  }

  private static setDocumentState(documentState: IDIDDocumentState) {
    let json = JSON.stringify(documentState);
    window.localStorage.setItem(
      `${this.DIDDOCUMENT_KEY}_${documentState.diddocument?.id.replace(
        'did:elastos:',
        ''
      )}`,
      json
    );
    this.triggerDocumentChangeEvent(documentState);
  }

  static async isDidDocumentPublished(did: string): Promise<boolean> {
    let documentOnBlockchain = await DidService.getDidDocument(did);

    return documentOnBlockchain;
  }

  static async getUserDocument(
    userSession: ISessionItem
  ): Promise<IDIDDocumentState> {
    let documentState = this.getDocumentState(userSession.did);
    if (documentState) return documentState;

    documentState = await this.loadFromBlockchain(userSession.did);
    this.setDocumentState(documentState);

    return documentState;
  }

  static async getUserDocumentByDid(did: string): Promise<IDIDDocumentState> {
    const documentState = await this.loadFromBlockchain(did);
    // this.setDocumentState(documentState);
    return documentState;
  }

  private static async loadFromBlockchain(
    did: string
  ): Promise<IDIDDocumentState> {
    let documentOnBlockchain = await DidService.getDidDocument(did, false);
    if (documentOnBlockchain) {
      let documentState = {
        diddocument: documentOnBlockchain,
        isChanged: false
      };
      return documentState;
    }
    return {
      diddocument: null,
      isChanged: false
    };
  }

  static updateUserDocument(diddocument: any): IDIDDocumentState {
    let documentState: IDIDDocumentState = {
      diddocument: diddocument,
      isChanged: true
    };

    this.setDocumentState(documentState);

    return documentState;
  }

  static async publishUserDocument(
    diddocument: any
  ): Promise<IDIDDocumentState | undefined> {
    let userSession = UserService.GetUserSession();
    if (!userSession) {
      // alertError(null, 'User is not logged in');
      return;
    }

    let userDid = await DidService.loadDid(userSession.mnemonics);
    let signedDocument = DidService.sealDIDDocument(userDid, diddocument);

    if (!signedDocument['proof']) {
      // alertError(null, 'The DID document was not signed');
      return;
    }

    let requestPub = await DidService.generatePublishRequest(
      signedDocument,
      userDid,
      PublishRequestOperation.Update
    );

    await AssistService.publishDocument(userDid.did, requestPub);
    let publishTimes = await AssistService.getPublishTimes(userDid.did);
    let curTime = new Date().getTime();
    if (publishTimes < 5) {
      if (!userSession.badges?.didPublishTimes._1times.archived) {
        userSession.badges!.didPublishTimes!._1times.archived = curTime;
        await UserService.updateSession(userSession);
      }
    } else if (publishTimes < 10) {
      if (!userSession.badges?.didPublishTimes._5times.archived) {
        userSession.badges!.didPublishTimes!._5times.archived = curTime;
        await UserService.updateSession(userSession);
      }
    } else if (publishTimes < 25) {
      if (!userSession.badges?.didPublishTimes._10times.archived) {
        userSession.badges!.didPublishTimes!._10times.archived = curTime;
        await UserService.updateSession(userSession);
      }
    } else if (publishTimes < 50) {
      if (!userSession.badges?.didPublishTimes._25times.archived) {
        userSession.badges!.didPublishTimes!._25times.archived = curTime;
        await UserService.updateSession(userSession);
      }
    } else if (publishTimes < 100) {
      if (!userSession.badges?.didPublishTimes._50times.archived) {
        userSession.badges!.didPublishTimes!._50times.archived = curTime;
        await UserService.updateSession(userSession);
      }
    } else {
      if (!userSession.badges?.didPublishTimes._100times.archived) {
        userSession.badges!.didPublishTimes!._100times.archived = curTime;
        await UserService.updateSession(userSession);
      }
    }

    let documentState = {
      diddocument: signedDocument,
      isChanged: false
    };

    this.setDocumentState(documentState);
    return documentState;
  }

  static async reloadUserDocument(): Promise<IDIDDocumentState | undefined> {
    let userSession = UserService.GetUserSession();
    if (!userSession) {
      alertError(null, 'User is not logged in');
      return;
    }

    let documentState = await this.loadFromBlockchain(userSession.did);
    this.setDocumentState(documentState);

    return documentState;
  }
}
