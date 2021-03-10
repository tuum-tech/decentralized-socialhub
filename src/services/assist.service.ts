export enum RequestStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Quarantined = 'Quarantined',
  NotFound = 'NotFound',
}

export interface IPublishDocumentResponse {
  confirmationId: string;
  requestStatus: RequestStatus;
}

export class AssistService {
  static async publishDocument(
    did: string,
    request: any, 
  ): Promise<IPublishDocumentResponse> {
    let url = `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/assist_router/didtx/create`;
    let data = {
      didRequest: request,
      requestFrom: `${process.env.REACT_APP_APPLICATION_NAME}`,
      did: did,
      memo: '',
    };
    
    console.log("ASSIST DATA", data)
    let postData: any = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.REACT_APP_PROFILE_API_SERVICE_KEY,
      },
      body: JSON.stringify(data),
    };



    let response = await fetch(url, postData);
    console.log("ASSIST RESPONSE", response)
    let json = await response.json();
    console.log("ASSIST JSON", json)
    
    
    window.localStorage.setItem(
      `publish_${json.data.confirmation_id}`,
      JSON.stringify({
        confirmationId: json.data.confirmation_id,
        requestStatus: RequestStatus.Pending,
      })
    )

    return {
      confirmationId: json.data.confirmation_id,
      requestStatus: RequestStatus.Pending,
    };
  }

  static async getRequestStatus(
    confirmationId: string
  ): Promise<IPublishDocumentResponse> {
    let url = `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/assist_router/didtx/confirmation_id/${confirmationId}`;

    let postData: any = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.REACT_APP_PROFILE_API_SERVICE_KEY,
      },
    };

    let response = await fetch(url, postData);

    let json = await response.json();

    window.localStorage.setItem(
      `publish_${confirmationId}`,
      JSON.stringify({
        confirmationId: confirmationId,
        requestStatus: RequestStatus.Pending,
      })
    )

    return {
      confirmationId: confirmationId,
      requestStatus: json.data.status,
    };
  }
}
