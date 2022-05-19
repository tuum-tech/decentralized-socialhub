import { UserService } from './user.service';
import { DidService } from './did.service.new';
import request from 'src/baseplate/request';
export interface IChatItem {
  roomid: string;
  friendDid: string;
}

export class ChatService {
  static async Authentication(did: string): Promise<string> {
    let url = `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/matrix_router/auth`;
    let data = {
      did: did
    };

    let postData: any = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.REACT_APP_PROFILE_API_SERVICE_KEY
      },
      body: JSON.stringify(data)
    };

    let fetchRresponse = await fetch(url, postData);
    let json = await fetchRresponse.json();
    return json.access_token;
  }
}
