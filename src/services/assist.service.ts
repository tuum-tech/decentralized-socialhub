export enum RequestStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Quarantined = 'Quarantined',
  NotFound = 'NotFound'
}

export interface IPublishDocumentResponse {
  confirmationId: string;
  requestStatus: RequestStatus;
}

export class AssistService {
  static async publishDocument(
    did: string,
    request: any
  ): Promise<IPublishDocumentResponse> {
    let url = `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/assist_router/didtx/create`;
    let data = {
      didRequest: request,
      requestFrom: `${process.env.REACT_APP_APPLICATION_NAME}`,
      did: did,
      memo: ''
    };

    let postData: any = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.REACT_APP_PROFILE_API_SERVICE_KEY
      },
      body: JSON.stringify(data)
    };

    let didKey = did.replace('did:elastos:', '');
    let fetchRresponse = await fetch(url, postData);
    let json = await fetchRresponse.json();

    let response: IPublishDocumentResponse = {
      confirmationId: json.data.confirmation_id,
      requestStatus: RequestStatus.Pending
    };

    window.localStorage.setItem(`publish_${didKey}`, JSON.stringify(response));

    return response;
  }

  static async refreshRequestStatus(
    confirmationId: string,
    did: string
  ): Promise<IPublishDocumentResponse> {
    if (confirmationId === undefined) {
      this.removePublishTask(did);
      return {
        requestStatus: RequestStatus.NotFound,
        confirmationId: ''
      };
    }

    let url = `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/assist_router/didtx/confirmation_id/${confirmationId}`;

    let postData: any = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.REACT_APP_PROFILE_API_SERVICE_KEY
      }
    };

    let fetchResponse = await fetch(url, postData);

    let json = await fetchResponse.json();
    let didKey = did.replace('did:elastos:', '');

    let response: IPublishDocumentResponse = {
      confirmationId: confirmationId,
      requestStatus: json.data.status
    };
    window.localStorage.setItem(`publish_${didKey}`, JSON.stringify(response));

    return response;
  }

  static getPublishStatusTask = (
    did: string
  ): IPublishDocumentResponse | undefined => {
    let didKey = did.replace('did:elastos:', '');
    let item = window.localStorage.getItem(`publish_${didKey}`);
    if (!item) return;
    return JSON.parse(item);
  };

  static removePublishTask = (did: string) => {
    let didKey = did.replace('did:elastos:', '');
    window.localStorage.removeItem(`publish_${didKey}`);
  };
}
