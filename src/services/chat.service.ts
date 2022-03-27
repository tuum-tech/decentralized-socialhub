import { UserService } from './user.service';
import { DidService } from './did.service.new';
import request from 'src/baseplate/request';
export interface IChatItem {
  roomid: string;
  friendDid: string;
}

export class ChatService {
  private static async runTuumTechScript(script: any) {
    return request(
      `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/tuumvault_router/scripting/run_script`,
      {
        method: 'POST',
        headers: {
          Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
          Accept: 'application/json',
          charset: 'utf8',
          'content-type': 'application/json'
        },
        body: JSON.stringify(script)
      }
    );
  }

  static async GetRooms(did: string): Promise<IChatItem[]> {
    const script_params = {
      name: 'get_user_message_rooms',
      params: {
        did: did
      },
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };

    let script_response: any = await this.runTuumTechScript(script_params);

    let response: IChatItem[] = [];

    let { meta, data } = script_response;

    if (meta && meta.code === 200 && meta.message === 'OK' && data) {
      let { get_user_message_rooms } = data;
      if (
        get_user_message_rooms &&
        get_user_message_rooms.items &&
        get_user_message_rooms.items.length > 0
      ) {
        response = get_user_message_rooms.items.map((roomitem: any) => {
          let userIndex = roomitem.users.indexOf(did);
          let friendDid = roomitem.users[userIndex === 0 ? 1 : 0];
          return {
            roomid: roomitem.roomid,
            friendDid
          };
        });
      }
    }

    return response;
  }

  static async StartNewChat(
    did: string,
    friendDID: string
  ): Promise<IChatItem> {
    let url = `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/matrix_router/chat/get`;
    let data = {
      did: did,
      friendDid: friendDID
    };

    let postData: any = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.REACT_APP_PROFILE_API_SERVICE_KEY
      },
      body: JSON.stringify(data)
    };

    let fetchRresponse = await fetch(url, postData);
    let json = await fetchRresponse.json();

    let response: IChatItem = {
      roomid: json.data.roomid,
      friendDid: friendDID
    };

    return response;
  }
}
