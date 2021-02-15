export enum CredentialType {
  Linkedin = 'Linkedin',
  Facebook = 'Facebook',
  Google = 'Google',
  Twitter = 'Twitter',
}

export class DidcredsService {
  static async generateVerifiableCredential(
    did: string,
    credential_type: CredentialType,
    credential_value: string
  ): Promise<any> {
    let url = `${process.env.REACT_APP_DIDCREDS_API_SERVICE_URL}/validation/internet_account`;
    let data = {
      did: did,
      credential_type: credential_type.toLowerCase(),
      credential_value: credential_value,
    };

    let postData: any = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.REACT_APP_DIDCREDS_API_SERVICE_KEY,
      },
      body: JSON.stringify(data),
    };

    let response = await fetch(url, postData);

    let json = await response.json();
    return json.data.verifiable_credential;
  }
}
